import multer from 'multer';


const storage = multer.diskStorage(
    {
        destination: function (req, file, cb) {
            console.log(file);
            
            cb(null, './public');
        },
        filename: function (req, file, cb) {
            cb(null,"A" +Date.now() + '-' + file.originalname);
        },
    })


export default multer({ storage })
