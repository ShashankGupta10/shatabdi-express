const generateUserController = (language, orm) => {
    if (language === 'TypeScript') {
        if (orm === 'Prisma') {
            return `import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Register a new user
export const signup = async (req: Request, res: Response) => {
    try {
        const { email, password, name } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: { email, password: hashedPassword, name },
        });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
};

// Login user
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
};
            `;
        } else if (orm === 'Mongoose') {
            return `import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Router, Request, Response } from 'express';
import User from '../models/User'; // Assuming you have a Mongoose User model

const router = Router();

// Register a new user
export const signup = async (req: Request, res: Response) => {
    try {
        const { email, password, name } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            email,
            password: hashedPassword,
            name,
        });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) { 
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
};

// Login user
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
};
            `;
        }
    } else {
        if (orm === 'Prisma') {
            return `const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Register a new user
const signup = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: { email, password: hashedPassword, name },
        });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    signup,
    login
};
            `;
        } else if (orm === 'Mongoose') {
            return `const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register a new user
const signup = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            email,
            password: hashedPassword,
            name,
        });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    signup,
    login
};
            `;
        }
    }
    return '';
}

module.exports = {
    generateUserController
}
