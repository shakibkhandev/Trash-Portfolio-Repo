import { NextFunction, Request, Response } from "express";

export const serverRunning = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    res.status(200).json({ success: true, message: "Server is running" });
  } catch (err) {
    next(err);
  }
};

export const healthCheck = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    res.status(200).json({ success: true, message: "Server is healthy" });
  } catch (err) {
    next(err);
  }
};