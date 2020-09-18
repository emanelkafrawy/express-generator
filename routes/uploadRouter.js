const express = require('express');
const bodyparser = require('body-parser');
const authenticate = require('../authenticate');
const multer = require('multer');//to upload file


const storage = multer.diskStorage({
    destination: (req, file, cb/*callback */) => {
        cb(null, 'public/images');
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('you can only upload omage files!'), false);
    }
    cb(null, true); //otherwise file uploaded match
};

const upload = multer({storage: storage, fileFilter: imageFileFilter});

const uploadRouter = express.Router();

uploadRouter.use(bodyparser.json());

uploadRouter.route('/') //allow only the post method
.get(authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next)=>{
    res.statusCode = 403;   //means operation is not suported  
    res.end("get operation not supported on /imageUpload");
})

.post(authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'),(req,res,next)=>{
    res.statusCode = 200;
    res.setHeader('ContentType', 'application/json');
    res.json(req.file); 
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next)=>{
    res.statusCode = 403;   //means operation is not suported  
    res.end("put operation not supported on /imageUpload");
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next)=>{
    res.statusCode = 403;   //means operation is not suported  
    res.end("delete operation not supported on /imageUplad");
});


module.exports = uploadRouter;