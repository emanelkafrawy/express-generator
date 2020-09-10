const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

const Dishes = require('../models/dishes');

const dishrouter = express.Router();

dishrouter.use(bodyparser.json());

dishrouter.route('/')
.get((req,res,next)=>{
    Dishes.find({})
    .then((dishes) => {//handling
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);//send it back to the server
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    Dishes.create(req.body)
    .then((dish) => {
        console.log('Dish Created ', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser, (req,res,next)=>{
    res.statusCode = 403;   //means operation is not suported  
    res.end("put operation not supported on dishes");
})
.delete(authenticate.verifyUser, (req,res,next)=>{
    Dishes.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    },(err) => next(err))
    .catch((err) => next(err));
});

dishrouter.route('/:dishId')
.get((req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req,res,next)=>{
    res.end("not supported");
})
.put(authenticate.verifyUser, (req,res,next)=>{
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body
    }, {new: true})
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, (req,res,next)=>{
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);
    }, (err) => next(err))
    .catch((err) => next(err));
});


//comments and comments by id
dishrouter.route('/:dishId/comments')
.get((req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish) => {//handling
        if(dish != null){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments);
        }
        else {
            err = new Error('Dish' + req.params.dishId + 'not found');
            err.status = 404; //not found
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish != null){
            dish.comments.push(req.body);
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish.comments);
            },(err) => next(err)); //if the save send succ.*the operation done successfully*
        }
        else {
            err = new Error('Dish ' + req.params.dishId + 'not found');
            err.status = 404; //not found
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser, (req,res,next)=>{
    res.statusCode = 403;   //means operation is not suported  
    res.end("put operation not supported on dishes/" + req.params.dishId +"/commenents" );
})
.delete(authenticate.verifyUser, (req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish != null){
            for(var i = (dish.comments.length -1); i>=0 ;i--) {
                dish.comments.id(dish.comments[i]._id).remove(); //delete each of the comments one by one

            }
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish.comments);
            },(err) => next(err));
        }
        else {
            err = new Error('comment' + req.params.dishId + 'not found');
            err.status = 404; //not found
            return next(err);
        }
    },(err) => next(err))
    .catch((err) => next(err));
});

dishrouter.route('/:dishId/comments/:commentId')
.get((req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish != null && dish.comments.id(req.params.commentId) != null ){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json( dish.comments.id(req.params.commentId));
        }
        else if(dish == null){ //dish itself doesn't exist
            err = new Error('Dish' + req.params.dishId + 'not found');
            err.status = 404; //not found
            return next(err);
        }
        else { //comment doesn't exist
            err = new Error('comment' + req.params.commentId + 'not found');
            err.status = 404; //not found
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req,res,next)=>{
    res.end("not supported on /dishes/" + req.params.dishId + '/comments/' +req.params.commentId);
})
.put(authenticate.verifyUser, (req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish != null && dish.comments.id(req.params.commentId) != null ){
            if(req.body.rating) {
                dish.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if(req.body.comment){
                dish.comments.id(req.params.commentId).comment = req.body.comment;
            }
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish.comments);
            },(err) => next(err));
        }
        else if(dish == null){ //dish itself doesn't exist
            err = new Error('Dish' + req.params.dishId + 'not found');
            err.status = 404; //not found
            return next(err);
        }
        else { //comment doesn't exist
            err = new Error('Dish' + req.params.commentId + 'not found');
            err.status = 404; //not found
            return next(err);
        }
    }, (err) => next(err))  
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, (req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish != null && dish.comments.id(req.params.commentId) != null ){
                dish.comments.id(req.params.commentId).remove();
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish.comments);
            },(err) => next(err));
        }
        else if(dish == null){ //dish itself doesn't exist
            err = new Error('Dish' + req.params.dishId + 'not found');
            err.status = 404; //not found
            return next(err);
        }
        else { //comment doesn't exist
            err = new Error('comments' + req.params.commentId + 'not found');
            err.status = 404; //not found
            return next(err);
        }
    }, (err) => next(err))  
    .catch((err) => next(err));
});

module.exports = dishrouter;
