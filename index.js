const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Token validation middleware
app.use((req, res, next) => {
    const token = req.headers['authorization'];
    if (token !== process.env.API_TOKEN) {
        return res.status(403).json({ message: 'Forbidden: Invalid API Token' });
    }
    next();
});

// Database connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log('Database connection error:', err));

// Routes
const gameRoutes = require('./routes/games');
const authRoutes = require('./routes/auth');
app.use('/api', gameRoutes);
app.use('/api/auth', authRoutes);

// Basic route for testing
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
