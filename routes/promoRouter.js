const express = require('express');
const bodyparser = require('body-parser');


const promorouter = express.Router();

promorouter.use(bodyparser.json());

promorouter.route('/')
.all((req,res,next)=>{ //for all the requests, no matter method is invoked 

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain'); //plaintext back to the client
    next();

})//callback function 
.get((req,res,next)=>{
    res.end("will send all the promotion to you!");
})
.post((req,res,next)=>{
    res.end("will add the promotion " + req.body.name +
    "with details: " + req.body.description);
})
.put((req,res,next)=>{
    res.statusCode = 403;   //means operation is not suported  
    res.end("put operation not supported on promotion");
})
.delete((req,res,next)=>{
    res.end("deleting all the promotions ");
});

promorouter.route('/:promoid')
.get((req,res,next)=>{
    res.end("will send all the promotion to you!" + req.params.promoid);
})
.post((req,res,next)=>{
    res.end("not supported");
})
.put((req,res,next)=>{
    res.statusCode = 403;   //means operation is not suported  
    res.write("will update the promotion: " + req.params.promoid);
    res.end('will update the promotion: ' + req.body.name + "with details" + req.body.description);
})
.delete((req,res,next)=>{
    res.end("deleting the promotion: " + req.params.promoid);
});

module.exports = promorouter;
