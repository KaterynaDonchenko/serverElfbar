require('dotenv').config(); 
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
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');

// const options = {
//     key: fs.readFileSync('/etc/nginx/ssl-certs/parking.key'),
//     cerf: fs.readFileSync('/etc/nginx/ssl-certs/parking.crt'),
// };

const options = {};

const PORT = process.env.PORT || 3001;

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL); 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Range'); 
    res.setHeader('Access-Control-Allow-Credentials', true)
    next();
});
app.use(bodyParser.json({ limit: '30mb' }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
app.use(fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 }
}));

app.use('/products', productRouter);
app.use('/filterSlides', filterSlidesRouter);
app.use('/email', emailRouter);
app.use('/admin', adminRouter);
app.use('/img', express.static('img'));
// app.get("/*", function (req, res) {
//     const indexPath = '/var/www/solodkiypar__usr/data/www/solodkiypar.com.us/index.html';
//     res.sendFile(indexPath, function (err) {
//       if (err) res.status(500).send(err)
//     })
// })\
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});
app.use(ApiMiddelware);

const start = async () => {
    // try {
    //     await mongoose.connect(process.env.DB_URL);
    //     const server = https.createServer(options, (req, res) => {
    //     });
    //     server.listen(PORT, function () {
    //         const host = server.address().address
    //         console.log("Example app listening at http://%s:%s", host, PORT)
    //     }); 
    // } catch (error) {
    //     console.log(error);
    // }

    try {
        await mongoose.connect(process.env.DB_URL);
        const server = app.listen(3001, function () {
            const host = server.address().address
            const port = server.address().port
            console.log("Example app listening at http://%s:%s", host, port)
        });
    } catch (error) {
        console.log(error);
    }
}
start();



