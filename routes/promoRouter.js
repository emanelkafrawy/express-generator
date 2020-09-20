const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const Promotions = require('../models/promotions');
const cors = require('./cors');

const promorouter = express.Router();

promorouter.use(bodyparser.json());

promorouter.route('/')
.options(cors.corsWithOptions, (req, res) =>{ res.sendStatus(200);})
.get(cors.cors,(req,res,next) => {
    Promotions.find({})
    .then((promotions) => {//handling
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);//send it back to the server
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotions.create(req.body)
    .then((promotion) => {
        console.log('Promotion Created ', promotion);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next)=>{
    res.statusCode = 403;   //means operation is not suported  
    res.end("put operation not supported on promotion");
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next)=>{
    Promotions.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    },(err) => next(err))
    .catch((err) => next(err));
});

promorouter.route('/:promoid')
.options(cors.corsWithOptions, (req, res) =>{ res.sendStatus(200);})
.get(cors.cors,(req,res,next) => {
    Dishes.findById(req.params.promoid)
    .then((lromotions) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(lromotions);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next)=>{
    res.end("not supported");
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next)=>{
    Promotions.findByIdAndUpdate(req.params.promoid, {
        $set: req.body
    }, {new: true})
    .then((promotions) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next)=>{
    Promotions.findByIdAndRemove(req.params.promoid)
    .then((promotions) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = promorouter;
