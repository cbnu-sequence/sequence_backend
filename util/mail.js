const {MAIL_SERVICE, MAIL_HOST, MAIL_USER, MAIL_PASS, MAIL_FROM} = require("../configs");
const nodemailer = require("nodemailer");
const createError = require("http-errors");
module.exports = {
    sendMail: async (to, subject, html) => {
        try {
            const mailConfig = {
                service: MAIL_SERVICE,
                host: MAIL_HOST,
                port: 587,
                auth: {
                    user: MAIL_USER,
                    pass: MAIL_PASS
                }
            }
            const message = {
                from: MAIL_FROM,
                to,
                subject,
                html
            }
            const transporter = nodemailer.createTransport(mailConfig)
            await transporter.sendMail(message)
        } catch (error) {
            throw createError(400, "Mail does not send")
        }
    }
}