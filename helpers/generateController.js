const generateUserController = (language, orm) => {
    const imports = language === 'TypeScript'
        ? `import bcrypt from 'bcrypt';\nimport jwt from 'jsonwebtoken';\nimport { Request, Response } from 'express';\n${orm === 'Prisma' ? `import { PrismaClient } from '@prisma/client';` : `import User from './../models/User'; // Assuming you have a Mongoose User model`}\n`
        : `const bcrypt = require('bcrypt');\nconst jwt = require('jsonwebtoken');\n\n${orm === 'Prisma' ? `const { PrismaClient } = require('@prisma/client');` : `const User = require('../models/User');`}\n`;

    const prismaClient = orm === 'Prisma' ? 'const prisma = new PrismaClient();' : '';
    const userCreate = orm === 'Prisma'
        ? `const newUser = await prisma.user.create({
          data: { email, password: hashedPassword, name },
        });`
        : `const newUser = new User({
          email,
          password: hashedPassword,
          name,
        });
        await newUser.save();`;

    const userFind = orm === 'Prisma'
        ? `const user = await prisma.user.findUnique({ where: { email } });`
        : `const user = await User.findOne({ email });`;

    const userId = orm === 'Prisma' ? 'user.id' : 'user._id';
    return `${imports}
  
  ${prismaClient}
  
  // Register a new user
  ${language === "TypeScript" ? "export " : ""}const signup = async (req${language === 'TypeScript' ? ': Request' : ''}, res${language === 'TypeScript' ? ': Response' : ''}) => {
    try {
      const { email, password, name } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      ${userCreate}
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      ${language === 'TypeScript' ? `if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred' });
      }` : `res.status(500).json({ error: error.message });`}
    }
  };
  
  // Login user
  ${language === "TypeScript" ? "export " : ""}const login = async (req${language === 'TypeScript' ? ': Request' : ''}, res${language === 'TypeScript' ? ': Response' : ''}) => {
    try {
      const { email, password } = req.body;
      ${userFind}
      if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      const token = jwt.sign({ id: ${userId} }, process.env.JWT_SECRET${language === 'TypeScript' ? '!' : ''}, { expiresIn: '1h' });
      res.json({ token });
    } catch (error) {
      ${language === 'TypeScript' ? `if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred' });
      }` : `res.status(500).json({ error: error.message });`}
    }
  };
  
  ${language === 'JavaScript' ? `module.exports = { signup, login };` : ''}`;
};

module.exports = {
    generateUserController
};
