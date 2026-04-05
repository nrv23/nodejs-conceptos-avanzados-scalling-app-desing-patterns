
const fs = require('fs');
const path = require('path');


class FS_Proxy {

    #filePath;

    constructor(filePath) {
        this. #filePath = filePath;
    }

    readFile(filePath, format, cb) {
        const allowedExtension = ['.txt',".TXT"];
        if (!allowedExtension.includes(path.extname(filePath))) {
            return cb(new Error('Only .txt files are allowed'));
        }
        
        fs.readFile(filePath, format, (err, data) => {
            if (err) {
                return cb(err);
            }
            cb(null, data);
        });
    }

}



module.exports = FS_Proxy;