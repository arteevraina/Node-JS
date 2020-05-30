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
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        if (favorite == null) {
            Favorites.create()
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    for (const i in req.body) {
                        favorite.dishes.push(req.body[i]);
                    }
                    favorite.save()
                    res.json(favorite);
                }, (err) => next(err));
        } else {
            for (const i in req.body) {
                Favorites.findOne({user: newFavorite.user})
                    .then((oldFavorite) => {
                        if (oldFavorite == null) {
                            favorite.dishes.push(req.body[i]);
                        }
                    });
            }
            favorite.save();
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json')
            res.json(favorite);
        }
    })
    .catch((err) => next(err));
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

favouriteRouter.route('/:dishId')
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
    Favourites.findById(req.body.dishId)
    .then((favourite) => {
        req.body.user = req.user._id;
        if(favourite === null) {
            Favourites.create(req.body.dishId)
                .then((favourite) => {
                    console.log('Favourite Created ', favourite);
                    favourite.dishes.push(req.body);
                    favourite.save()
                    .then((favourite) => {
                        Favourites.findById(favourite._id)
                            .populate('user')
                            .populate('dishes')
                            .then((favorite) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favourite);
                            })
                    }, (err) => next(err));
                }, (err) => next(err))
                .catch((err) => next(err));
                } 
        else {
            err = new Error('Dish ' + req.params.dishId + ' already exist');
            err.status = 404;
            return next(err);
        }
    })
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