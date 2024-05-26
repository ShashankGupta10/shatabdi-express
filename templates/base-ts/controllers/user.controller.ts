// templates/typescript/controllers/userController.ts
import { Request, Response } from 'express';

export const login = (req: Request, res: Response): void => {
    res.json({ message: "Get all users" });
};

export const signup = (req: Request, res: Response): void => {
    res.json({ message: "Create user" });
};
