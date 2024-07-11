import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

  
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
  
  