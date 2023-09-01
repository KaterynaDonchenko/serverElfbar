require('dotenv').config();  // if you want to works impor/export, write in packege/lock.json - "type": "module"
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const productRouter = require('./routers/ProductRouter');
const filterSlidesRouter = require('./routers/FilterSlidesRouter');
const emailRouter = require('./routers/EmailRouter');
const fileUpload = require('express-fileupload');
const adminRouter = require('./routers/AdminRouter');
const ApiMiddelware = require('./middelwares/ErrorMiddelware');

const PORT = process.env.PORT || 3001;

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL); 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Range'); 
    res.setHeader('Access-Control-Allow-Credentials', true)
    next();
});
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));

app.use('/products', productRouter);
app.use('/filterSlides', filterSlidesRouter);
app.use('/email', emailRouter);
app.use(fileUpload({}));
app.use('/admin', adminRouter);
app.use('/img', express.static('img'));
app.use(ApiMiddelware);

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        const server = app.listen(PORT, function () {
            const host = server.address().address
            console.log("Example app listening at http://%s:%s", host, PORT)
        }); 
    } catch (error) {
        console.log(error);
    }
}
start();



