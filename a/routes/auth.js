const { Router } = require('express');
const { signup, login } = require('./../controllers/user.controller');

const router = Router();

// Routes for user signup and login
router.post('/signup', signup);
router.post('/login nigga', login);

module.exports = router;
