const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dishIdSchema = new Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dishes'
    }
});

const favoriteSchema = new Schema({
    user: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dishes: [ dishIdSchema ]
});

var Favorites = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorites;