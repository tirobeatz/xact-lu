import { Resend } from "resend"

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

interface EmailOptions {
  to: string
  subject: string
  html: string
}

async function sendEmail(options: EmailOptions): Promise<void> {
  if (!resend) {
    console.log("[DEV] Email would be sent to:", options.to)
    console.log("[DEV] Subject:", options.subject)
    return
  }

  try {
    await resend.emails.send({
      from: "noreply@xact.lu",
      to: options.to,
      subject: options.subject,
      html: options.html,
    })
  } catch (error) {
    console.error("Failed to send email:", error)
    throw error
  }
}

export async function sendPasswordResetEmail(email: string, resetToken: string, resetUrl: string): Promise<void> {
  const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background-color: #1A1A1A; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
      .content { background-color: #FAFAF8; padding: 30px; }
      .button { display: inline-block; background-color: #B8926A; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: 500; }
      .footer { background-color: #E8E6E3; color: #6B6B6B; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
      .divider { border-top: 1px solid #E8E6E3; margin: 20px 0; }
      h2 { color: #1A1A1A; margin-top: 0; }
      p { color: #6B6B6B; line-height: 1.6; }
      .code { background-color: #E8E6E3; padding: 10px 15px; border-radius: 4px; font-family: monospace; font-size: 12px; word-break: break-all; margin: 10px 0; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1 style="margin: 0;">Xact Real Estate</h1>
      </div>
      <div class="content">
        <h2>Reset Your Password</h2>
        <p>Hello,</p>
        <p>We received a request to reset your password. Click the button below to set a new password. This link will expire in 1 hour.</p>
        <a href="${resetUrl}" class="button">Reset Password</a>
        <p style="font-size: 14px; color: #6B6B6B;">Or copy and paste this URL into your browser:</p>
        <div class="code">${resetUrl}</div>
        <div class="divider"></div>
        <p style="font-size: 14px;">If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
        <p style="font-size: 14px;">For security, never share this link with anyone.</p>
      </div>
      <div class="footer">
        <p>&copy; 2025 Xact Real Estate. All rights reserved.</p>
        <p><a href="https://xact.lu" style="color: #B8926A; text-decoration: none;">Visit our website</a></p>
      </div>
    </div>
  </body>
</html>
  `.trim()

  await sendEmail({
    to: email,
    subject: "Reset Your Password - Xact Real Estate",
    html,
  })
}
