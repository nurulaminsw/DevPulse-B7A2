import type { Request, Response } from "express";
import { authService } from "./auth.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.createUserIntoDB(req.body);
    res.status(201).json({
      success: true,
      meassage: " User registered successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      meassage: " User  can not Created",
      error: error.detail,
    });
  }
};

export const authController = {
  createUser,
};
