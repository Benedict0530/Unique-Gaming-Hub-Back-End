const express = require('express');
const Game = require('../models/gamemodel');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Middleware to validate input data
const validateGame = [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('imageUrl').optional().isURL().withMessage('Invalid Image URL'),
    body('url').optional().isURL().withMessage('Invalid URL'),
];

// Create a new game
router.post('/games', validateGame, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, imageUrl, url } = req.body;
    try {
        const game = new Game({ title, description, imageUrl, url });
        await game.save();
        res.status(201).json(game);
    } catch (err) {
        console.error('Error creating game:', err.message);
        res.status(500).json({ error: 'Server error: Unable to create game' });
    }
});


// Get all games
router.get('/games', async (req, res) => {
    try {
        const games = await Game.find();
        res.status(200).json(games);
    } catch (err) {
        console.error('Error fetching games:', err.message);
        res.status(400).json({ error: err.message });
    }
});

// Get a game by ID
router.get('/games/:id', async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if (!game) {
            return res.status(404).json({ error: 'Game not found' });
        }
        res.status(200).json(game);
    } catch (err) {
        console.error('Fetch game error:', err.message);
        res.status(400).json({ error: err.message });
    }
});

// Update a game
router.put('/games/:id', validateGame, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const game = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!game) {
            return res.status(404).json({ error: 'Game not found' });
        }
        res.status(200).json(game);
    } catch (err) {
        console.error('Error updating game:', err.message);
        res.status(400).json({ error: err.message });
    }
});

// Delete a game
router.delete('/games/:id', async (req, res) => {
    try {
        const result = await Game.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ error: 'Game not found' });
        }
        res.status(200).json({ message: 'Game deleted' });
    } catch (err) {
        console.error('Error deleting game:', err.message);
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
