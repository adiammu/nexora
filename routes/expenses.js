const express = require('express');
const Expense = require('../models/Expense');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};

// Add an expense
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { category, amount, date, description } = req.body;
        const expense = new Expense({ userId: req.user.id, category, amount, date, description });
        await expense.save();
        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ message: 'Error adding expense', error });
    }
});

// Get all expenses
router.get('/', authenticateToken, async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.user.id });
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching expenses', error });
    }
});

// Delete an expense
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) return res.status(404).json({ message: 'Expense not found' });

        if (expense.userId.toString() !== req.user.id)
            return res.status(403).json({ message: 'Unauthorized to delete this expense' });

        await expense.remove();
        res.status(200).json({ message: 'Expense deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting expense', error });
    }
});

module.exports = router;
