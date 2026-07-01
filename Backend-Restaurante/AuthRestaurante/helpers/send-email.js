import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys, SendSmtpEmail } from '@getbrevo/brevo'

const emailAPI = new TransactionalEmailsApi()
emailAPI.setApiKey(TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY)

export const sendVerificationEmail = async (email, token) => {
  const verificationLink = `${process.env.FRONTEND_URL}/verify/${token}`

  const message = new SendSmtpEmail()
  message.subject = 'Verifica tu cuenta!'
  message.htmlContent = `
    <h2>Verifica tu cuenta</h2>
    <p>Haz click en el siguiente enlace para activar tu cuenta:</p>
    <br><br>
    <a href="${verificationLink}">${verificationLink}</a>
  `
  message.sender = { name: 'Auth Restaurante', email: process.env.BREVO_SENDER_EMAIL }
  message.to = [{ email }]

  await emailAPI.sendTransacEmail(message)
}

export const sendResetPasswordEmail = async (email, name, token) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`

  const message = new SendSmtpEmail()
  message.subject = 'Restablece tu contraseña - Kinal Gourmet House'
  message.htmlContent = `
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
  message.sender = { name: 'Kinal Gourmet House', email: process.env.BREVO_SENDER_EMAIL }
  message.to = [{ email }]

  await emailAPI.sendTransacEmail(message)
}