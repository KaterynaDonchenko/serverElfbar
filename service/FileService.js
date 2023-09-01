const fs = require('fs');
const path = require('path');

class FileService {
    saveFile = (file, folder) => {
        try {
            const mimeType = file.src.split(';')[0].split(':')[1];
            const base64Data = file.src.replace(/^data:image\/\w+;base64,/, '');

            const imageBuffer = Buffer.from(base64Data, 'base64');

            let extension;
            if (mimeType === 'image/png') {
                extension = 'png';
            } else if (mimeType === 'image/jpeg') {
                extension = 'jpeg';
            } else if (mimeType === 'image/webp') {
                extension = 'webp';
            } else if (mimeType === 'image/svg+xml') {
                extension = 'svg';
            } else {
                throw new Error('Unsupported image format');
            }

            if (folder === 'products') {
                const filePath = path.resolve(__dirname, '../img/products', `${file.title}`);

                fs.writeFile(filePath, imageBuffer, (err) => {
                    if (err) {
                    console.error('Error saving image:', err);
                    } 
                });
            }

            if (folder === 'filterSlides') {
                const filePath = path.resolve(__dirname, '../img/filterSlides', `${file.title}`);

                fs.writeFile(filePath, imageBuffer, (err) => {
                    if (err) {
                    console.error('Error saving image:', err);
                    } 
                });
            }
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = new FileService();