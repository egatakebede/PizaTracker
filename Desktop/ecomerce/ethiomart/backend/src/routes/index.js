const express = require('express');
const router = express.Router();

// Placeholder route files
// e.g. router.use('/auth', require('./auth.routes'));

router.get('/', (req, res) => res.json({ message: 'ethiomart backend API' }));

module.exports = () => router;
