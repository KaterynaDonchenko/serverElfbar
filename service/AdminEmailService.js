const nodemailer = require('nodemailer')

class AdminEmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTO_HOST,
            port: process.env.SMTO_PORT,
            secure: true,
            auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
            },
        }) 
    }

    async sendActivateEmail(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Activation accaunt on' + process.env.API_URL,
            text: '',
            html: 
                `
                    <div>
                        <h1>To activation, to go </h1>
                        <a href="${link}">${link}</a>
                    </div>
                `
        })
    }
}

module.exports = new AdminEmailService();