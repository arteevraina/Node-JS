const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Favourites = require('../models/favorite');

const favouriteRouter = express.Router();

favouriteRouter.use(bodyParser.json());

favouriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
.get(authenticate.verifyUser, (req, res, next) => {
    Favourites.find({})
    .populate('dishes')
    .populate('user')
    .then((favourites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favourites);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favourites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favourites.remove({})
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));
});

favouriteRouter.route(':/dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
.get(cors.cors, (req, res, next) => {
    Favourites.findById(req.params.dishId)
        .populate('dishes')
        .populate('user')
        .then((favourite) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(favourite);
        }, (err) => next(err))
        .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favourites/' + req.params.dishId);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favourites.findByIdAndRemove(req.params.dishId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = favouriteRouter;