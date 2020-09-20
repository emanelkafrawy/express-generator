const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const Leaders = require('../models/leaders');
const leaderRouter = express.Router();
const authenticate = require('../authenticate');
const cors = require('./cors');

leaderRouter.use(bodyparser.json());

leaderRouter.route('/')
.options(cors.corsWithOptions, (req, res) =>{ res.sendStatus(200);})
.get(cors.cors,(req,res,next) => {
    Leaders.find({})
    .then((leaders) => {//handling
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders);//send it back to the server
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser ,authenticate.verifyAdmin, (req, res, next) => {
    Leaders.create(req.body)
    .then((leader) => {
        console.log('leader Created ', leader);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next)=>{
    res.statusCode = 403;   //means operation is not suported  
    res.end("put operation not supported on leader");
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next)=>{
    Leaders.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    },(err) => next(err))
    .catch((err) => next(err));
});

leaderRouter.route('/:leaderid')
.options(cors.corsWithOptions, (req, res) =>{ res.sendStatus(200);})
.get(cors.cors,(req,res,next) => {
    Leaders.findById(req.params.leaderid)
    .then((leaders) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next)=>{
    res.end("not supported");
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next)=>{
    Leaders.findByIdAndUpdate(req.params.leaderid, {
        $set: req.body
    }, {new: true})
    .then((leaders) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next)=>{
    Leaders.findByIdAndRemove(req.params.leaderid)
    .then((leaders) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = leaderRouter;
