'use strict';

import Restaurant from './restaurant.model.js';
import mongoose from 'mongoose';
import { cloudinary } from '../../middlewares/files-uploaders.js';

export const createRestaurant = async (req, res) => {
    try {
        const restaurantData = { ...req.body };

        // Parsear campos JSON que vienen como string desde form-data
        const jsonFields = ['location', 'addressDetails', 'features', 'socialMedia', 'paymentMethods', 'subcategories', 'weeklySchedule', 'alternativePhones', 'certifications'];
        for (const field of jsonFields) {
            if (restaurantData[field] && typeof restaurantData[field] === 'string') {
                try {
                    restaurantData[field] = JSON.parse(restaurantData[field]);
                } catch {
                    return res.status(400).json({
                        success: false,
                        message: `El campo '${field}' tiene formato JSON inválido`
                    });
                }
            }
        }

        // El restaurante nace INACTIVE: se activa solo cuando se le asigna un ADMIN_RESTAURANTE
        const initialStatus = req.user.role === 'ADMIN_GENERAL' ? 'INACTIVE' : 'PENDING_APPROVAL';

        const restaurant = new Restaurant({
            ...restaurantData,
            createdBy: req.user.id,
            ownerUserId: null,
            status: initialStatus,
            photo: req.file ? req.file.path : null,
            photo_public_id: req.file ? req.file.filename : null,
        });

        await restaurant.save();

        res.status(201).json({
            success: true,
            message: 'Restaurante creado',
            data: restaurant
        });

    } catch (error) {
        if (req.file?.filename) {
            await cloudinary.uploader.destroy(req.file.filename).catch(console.error);
        }
        res.status(500).json({
            success: false,
            message: 'Error al crear restaurante',
            error: error.message,
            details: error.errors
        });
    }
};

export const getRestaurants = async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;

        const filter = {};
        if (status) filter.status = status;

        if (req.user && req.user.role === 'ADMIN_RESTAURANTE') {
            if (!req.user.restaurantId) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes un restaurante asignado.'
                });
            }
            filter._id = req.user.restaurantId;
        }

        const restaurants = await Restaurant.find(filter)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await Restaurant.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: restaurants,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalRecords: total,
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener los restaurantes',
            error: error.message
        });
    }
};

export const getRestaurantById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "ID inválido" });
        }

        const restaurant = await Restaurant.findById(id);

        if (!restaurant) {
            return res.status(404).json({ success: false, message: "Restaurante no encontrado" });
        }

        res.status(200).json({ success: true, data: restaurant });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al obtener el restaurante", error: error.message });
    }
};

export const updateRestaurant = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "ID inválido" });
        }

        const currentRestaurant = await Restaurant.findById(id);
        if (!currentRestaurant) {
            return res.status(404).json({ success: false, message: "Restaurante no encontrado" });
        }

        const updateData = { ...req.body };

        // Parsear campos JSON
        const jsonFields = ['location', 'addressDetails', 'features', 'socialMedia', 'paymentMethods', 'subcategories', 'weeklySchedule'];
        for (const field of jsonFields) {
            if (updateData[field] && typeof updateData[field] === 'string') {
                try {
                    updateData[field] = JSON.parse(updateData[field]);
                } catch {
                    return res.status(400).json({ success: false, message: `El campo '${field}' tiene formato JSON inválido` });
                }
            }
        }

        if (req.file) {
            if (currentRestaurant.photo_public_id) {
                await cloudinary.uploader.destroy(currentRestaurant.photo_public_id)
                    .catch(err => console.error('Error al eliminar imagen anterior:', err));
            }
            updateData.photo = req.file.path;
            updateData.photo_public_id = req.file.filename;
        }

        const updatedRestaurant = await Restaurant.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            message: "Restaurante actualizado exitosamente",
            data: updatedRestaurant,
        });
    } catch (error) {
        if (req.file?.filename) {
            await cloudinary.uploader.destroy(req.file.filename).catch(console.error);
        }
        res.status(500).json({ success: false, message: "Error al actualizar restaurante", error: error.message });
    }
};

export const deleteRestaurant = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "ID inválido" });
        }

        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            return res.status(404).json({ success: false, message: "Restaurante no encontrado" });
        }

        // Bug fix: no se puede eliminar si tiene admin asignado
        if (restaurant.ownerUserId) {
            return res.status(409).json({
                success: false,
                message: "No se puede eliminar el restaurante porque tiene un administrador asignado. Primero desasigna al administrador."
            });
        }

        if (restaurant.photo_public_id) {
            await cloudinary.uploader.destroy(restaurant.photo_public_id)
                .catch(err => console.error('Error al eliminar imagen:', err));
        }

        await Restaurant.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: "Restaurante eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al eliminar restaurante", error: error.message });
    }
};

export const assignAdminToRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, ownerInfo } = req.body;

        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            return res.status(404).json({ success: false, message: 'Restaurante no encontrado' });
        }

        // Bug fix: si userId es null o vacío se desasigna y el restaurante vuelve a INACTIVE
        if (!userId) {
            restaurant.ownerUserId = null;
            restaurant.status = 'INACTIVE';
            await restaurant.save();
            return res.status(200).json({ success: true, message: 'Admin desasignado. Restaurante marcado como INACTIVE.', data: restaurant });
        }

        // Bug fix: al asignar admin el restaurante pasa a ACTIVE automáticamente
        restaurant.ownerUserId = userId;
        restaurant.status = 'ACTIVE';
        await restaurant.save();

        res.status(200).json({ success: true, message: 'Admin asignado correctamente', data: restaurant });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al asignar admin', error: error.message });
    }
};