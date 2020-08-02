const express = require('express');
const bodyparser = require('body-parser');


const leaderRouter = express.Router();

leaderRouter.use(bodyparser.json());

leaderRouter.route('/')
.all((req,res,next)=>{ //for all the requests, no matter method is invoked 

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain'); //plaintext back to the client
    next();

})//callback function 
.get((req,res,next)=>{
    res.end("will send all the leaders to you!");
})
.post((req,res,next)=>{
    res.end("will add the leaders " + req.body.name +
    "with details: " + req.body.description);
})
.put((req,res,next)=>{
    res.statusCode = 403;   //means operation is not suported  
    res.end("put operation not supported on leaders");
})
.delete((req,res,next)=>{
    res.end("deleting all the leaders ");
});

leaderRouter.route('/:leaderid')
.get((req,res,next)=>{
    res.end("will send all the leaders to you!" + req.params.leaderid);
})
.post((req,res,next)=>{
    res.end("not supported");
})
.put((req,res,next)=>{
    res.statusCode = 403;   //means operation is not suported  
    res.write("will update the leaders: " + req.params.leaderid);
    res.end('will update the leader: ' + req.body.name + "with details" + req.body.description);
})
.delete((req,res,next)=>{
    res.end("deleting the leaders: " + req.params.leaderid);
});

module.exports = leaderRouter;
