const EmailService = require('../service/EmailService');

class EmailController {
    
    sendEmail = async (req, res) => {
        try {
            const email = await EmailService.sendEmail(req.body);
            return res.json(email);   
        } catch (error) {
            return res.status(500).json(error.message);
        }
        
    }


}

module.exports = new EmailController();