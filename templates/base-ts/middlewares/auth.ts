import { Request, Response, NextFunction } from "express";
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const jwt_token = req.headers.authorization?.split(" ")[1]
    console.log(jwt_token);
}