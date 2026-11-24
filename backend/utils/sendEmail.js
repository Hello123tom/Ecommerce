import nodemailer from "nodemailer";
export const sendEmail = async (option) => {
    const transporter = nodemailer.createTransport({
        service: process.env.SMTP_Service,
        auth:{
            user:process.env.SMTP_MAIL,
            pass:process.env.SMTP_PASSWORD
        }
    })
    const mailOptions = {
        from:process.env.SMTP_MAIL,
        to:option.email,
        subject:option.subject,
        text:option.message
    }

    return await transporter.sendMail(mailOptions)
}