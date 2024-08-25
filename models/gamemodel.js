const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    imageUrl: String,
    url: String,
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
