// https://github.com/getbrevo/brevo-node
const brevo = require('@getbrevo/brevo')
import { env } from '~/config/environment'

/**
* You can check additional configuration documentation for different languages depending on the project in Brevo Dashboard > Account > SMTP & API > API Keys
* https://brevo.com
* For Node.js, it’s quickest to refer directly to their GitHub repo:
* https://github.com/getbrevo/brevo-node
*/
let apiInstance = new brevo.TransactionalEmailsApi()
let apiKey = apiInstance.authentications['apiKey']
apiKey.apiKey = env.BREVO_API_KEY

const sendEmail = async (recipientEmail, customSubject, customHtmlContent) => {
  // Initialize a sendSmtpEmail object with required email information
  let sendSmtpEmail = new brevo.SendSmtpEmail()

  // Sender's email account
  sendSmtpEmail.sender = { email: env.ADMIN_EMAIL_ADDRESS, name: env.ADMIN_EMAIL_NAME }

  // Recipient's email account
  sendSmtpEmail.to = [{ email: recipientEmail }]

  // Email subject
  sendSmtpEmail.subject = customSubject

  // Email content
  sendSmtpEmail.htmlContent = customHtmlContent

  // Call the send email action
  return apiInstance.sendTransacEmail(sendSmtpEmail)
}

export const BrevoProvider = {
  sendEmail
}
