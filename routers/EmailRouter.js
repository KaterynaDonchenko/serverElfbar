const Router = require('express');
const EmailController = require('../controllers/EmailController');

const emailRouter = new Router();

emailRouter.post('/', EmailController.sendEmail);


module.exports = emailRouter;