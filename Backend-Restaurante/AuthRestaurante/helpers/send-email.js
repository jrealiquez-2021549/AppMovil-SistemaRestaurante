import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendVerificationEmail = async (email, token) => {
  const verificationLink = `${process.env.FRONTEND_URL}/verify/${token}`

  const { error } = await resend.emails.send({
    from: 'Auth Restaurante <onboarding@resend.dev>', // dominio de prueba de Resend
    to: email,
    subject: 'Verifica tu cuenta!',
    html: `
      <h2>Verifica tu cuenta</h2>
      <p>Haz click en el siguiente enlace para activar tu cuenta:</p>
      <br><br>
      <a href="${verificationLink}">${verificationLink}</a>
    `
  })

  if (error) throw new Error(`Error al enviar correo: ${error.message}`)
}

export const sendResetPasswordEmail = async (email, name, token) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`

  const { error } = await resend.emails.send({
    from: 'Kinal Gourmet House <onboarding@resend.dev>',
    to: email,
    subject: 'Restablece tu contraseña - Kinal Gourmet House',
    html: `
      <div style="font-family: sans-serif; max-width: 520px; margin: auto;">
        <h2 style="color: #e8602c;">Kinal Gourmet House</h2>
        <p>Hola <strong>${name}</strong>,</p>
        <p>Recibimos una solicitud para restablecer tu contraseña.</p>
        <a href="${resetLink}"
           style="display:inline-block;margin:20px 0;padding:14px 28px;background:#e8602c;color:#fff;text-decoration:none;border-radius:8px;font-weight:700;">
          Restablecer contraseña
        </a>
        <p style="color:#999;font-size:0.85rem;">
          Este enlace expira en <strong>1 hora</strong>. Si no solicitaste esto, ignora este correo.
        </p>
      </div>
    `
  })

  if (error) throw new Error(`Error al enviar correo: ${error.message}`)
}