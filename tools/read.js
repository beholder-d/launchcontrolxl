const fs = require('fs');

const readFilePromise = (filename) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, (error, data) => {
            if(error) {
                reject(error);
            } else {
                resolve(data);
            }
        })
    })
};

readFilePromise('./template/template-test.syx')
    .then(data => {
        console.log('Reading succesful');
        console.log(data);
        console.log(typeof(data));
    })
    .catch(err => {
        throw err
    }); 