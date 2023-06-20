import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface CustomRequest extends Request {
  user?: any;
}

export const verifyToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.headers.authorization;
    if (!token) return res.status(401).json({ error: "Access denied" });

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = verified;

    // Check if user is admin
    if (req.user.isAdmin) {
      // Admin user has unlimited numOfActions
      next();
    } else {
      // Check if user's numOfActions is zero
      if (req.user.numOfActions === 0) {
        return res.status(400).json({
          error: "You have exceeded your allowed actions for the day",
        });
      }

      // Decrease the user's numOfActions by 1
      req.user.numOfActions--;
      await req.user.save();

      next();
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
