const nodemailer = require('nodemailer');

class EmailService {
    sendEmail = async (email) => {
        let productString  = '';
        email.userProductCart.forEach(item => {
            productString += `
            <tr>
                <td><img src='https://solodkiypar.com.ua:3001/${item.img}' 
                         style="width: 70px; height: 70px; background-color: #f4f3f5"/>
                </td>
                <td style="max-width: 200px;"><strong>${item.title}</strong></td>
                <td><strong>${item.price}</strong> грн</td>
                <td> x <strong>${item.counter}</strong></td>
            </tr>
            `
        });

        let transporter = nodemailer.createTransport({
            host: process.env.SMTO_HOST,
            port: process.env.SMTO_PORT,
            secure: true,
            auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
            },
        });

        try {
            const sendEmail = await transporter.sendMail({
                from: process.env.SMTP_USER,
                to: 'katedonchenkov@gmail.com',
                subject: 'Elfbar',
                html: `
                    <div>Ім*я: ${email.firstName}</div>
                    <div>Прізвище: ${email.lastName}</div>
                    <div>Телефон: ${email.phone}</div>
                    <div>Спосіб доставки: ${email.deliveryMethod === 'nova' ? 'Hова Пошта' : 'Укрпошта'}</div>
                    <div>${email.city.length > 0 ? `Адресса: ${email.city}, відділення: ${email.warehouse}` : `Адресса: ${email.ukrDelivery}`}</div>
                    <div>${email.checkbox === 'card' ? 'Оплата на картку' : 'Оплата при отриманні'}</div>
                    <div>${email.text.length > 0 ? `Додаткова інформація: ${email.text}` : ''}</div>
                    <div>Загальна сума: ${email.total} грн</div> <br/>
                    <table style="background-color: #f4f3f5">${productString}</table>
                `,
            });

            return sendEmail

        } catch (error) {
            console.log("Error sending email:", error);
        }
        
    }
}

module.exports = new EmailService();