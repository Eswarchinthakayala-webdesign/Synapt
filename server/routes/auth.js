const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { generateToken } = require('../middlewares/auth');

// ───────────────────────────────────────────────────
// POST /api/auth/register
// ───────────────────────────────────────────────────
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters.' });
        }

        // Check existing user
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ 
                message: existingUser.email === email ? 'Email already registered.' : 'Username already taken.' 
            });
        }

        // Create user
        const user = await User.create({
            username,
            email,
            password,
            role: role === 'streamer' ? 'streamer' : 'viewer'
        });

        const token = generateToken(user);

        res.status(201).json({
            message: 'Account created successfully.',
            token,
            user: user.toJSON()
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: 'Server error during registration.' });
    }
});

// ───────────────────────────────────────────────────
// POST /api/auth/login
// ───────────────────────────────────────────────────
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        // Find user (include password for comparison)
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Check if blocked
        if (user.isBlocked) {
            return res.status(403).json({ message: 'Account is suspended.' });
        }

        const token = generateToken(user);

        res.json({
            message: 'Login successful.',
            token,
            user: user.toJSON()
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error during login.' });
    }
});

// ───────────────────────────────────────────────────
// GET /api/auth/me  (verify token & get user info)
// ───────────────────────────────────────────────────
const { auth } = require('../middlewares/auth');
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.json({ user: user.toJSON() });
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router;
