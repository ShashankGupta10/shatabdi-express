import { Router } from 'express';
import { signup, login } from './../controllers/user.controller';

const router = Router();

// Routes for user signup and login
router.post('/signup', signup);
router.post('/login', login);

export default router;
