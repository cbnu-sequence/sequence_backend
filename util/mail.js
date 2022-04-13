const {MAIL_SERVICE, MAIL_HOST, MAIL_USER, MAIL_PASS, MAIL_FROM} = require("../configs");
const nodemailer = require("nodemailer");
const createError = require("http-errors");
const ejs = require('ejs');

module.exports = {
    sendMail: async (to, subject, token) => {
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
            let emailTemplate;

            ejs.renderFile('./resources/user/mail.ejs', {token}, function (err, data) {
                emailTemplate = data;
                console.log(err);
            });

            const message = {
                from: MAIL_FROM,
                to,
                subject,
                html: emailTemplate,
            }
            const transporter = nodemailer.createTransport(mailConfig)
            await transporter.sendMail(message)
        } catch (error) {
            console.log(error);
            throw createError(400, "Mail does not send")
        }
    }
}
