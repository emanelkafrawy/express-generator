const express = require('express');
const bodyparser = require('body-parser');


const dishrouter = express.Router();

dishrouter.use(bodyparser.json());

dishrouter.route('/')
.all((req,res,next)=>{ //for all the requests, no matter method is invoked 

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain'); //plaintext back to the client
    next();

})//callback function 
.get((req,res,next)=>{
    res.end("will send all the dishes to you!");
})
.post((req,res,next)=>{
    res.end("will add the dishes " + req.body.name +
    "with details: " + req.body.description);
})
.put((req,res,next)=>{
    res.statusCode = 403;   //means operation is not suported  
    res.end("put operation not supported on dishes");
})
.delete((req,res,next)=>{
    res.end("deleting all the dishs ");
});

dishrouter.route('/:dishId')
.get((req,res,next)=>{
    res.end("will send all the dishes to you!" + req.params.dishId);
})
.post((req,res,next)=>{
    res.end("not supported");
})
.put((req,res,next)=>{
    res.statusCode = 403;   //means operation is not suported  
    res.write("will update the dish: " + req.params.dishId);
    res.end('will update the dish: ' + req.body.name + "with details" + req.body.description);
})
.delete((req,res,next)=>{
    res.end("deleting the dish: " + req.params.dishId);
});

module.exports = dishrouter;
