import fs from 'fs'
import path from 'path'
import nodemailer from 'nodemailer'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const sendVerificationEmail = async (email, username, otp, res) => {
    try {
        // Read the email template file
        let emailTemplate = fs.readFileSync(path.join(__dirname, 'templates', 'emailTemplate.html'), 'utf8');

        // Replace placeholders with actual values
        emailTemplate = emailTemplate
            .replace('${username}', username)
            .replace('${email}', email)
            .replace('${otp}', otp);
        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })
        const options = {
            from: 'Auth Sys',
            to: email,
            subject: "Welcome to AuthSys",
            html: emailTemplate
        }
        await transporter.sendMail(options);
        return { success: true, message: 'Verification email sent successfully!' };

    } catch (error) {
        console.error('❌ Error sending email:', error);
        return  { success: false, message: 'Error sending verification email', error: error.message };
    }
}
