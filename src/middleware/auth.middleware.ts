import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";
import sendResponse from "../utils/sendResponse";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        return sendResponse(res, {
          statusCode: 401,
          success: false,
          message: "Unauthorized",
        });
      }

      const decoded = jwt.verify(token, config.secret as string) as JwtPayload;

      const userData = await pool.query(
        `SELECT id, name, email, role FROM users WHERE id = $1`,
        [decoded.id],
      );

      if (userData.rows.length === 0) {
        return sendResponse(res, {
          statusCode: 404,
          success: false,
          message: "User Not found",
        });
      }

      const user = userData.rows[0];

      if (roles.length > 0 && !roles.includes(user.role)) {
        return sendResponse(res, {
          statusCode: 403,
          success: false,
          message: "Forbidden",
        });
      }

      req.user = user;

      next();
    } catch (e) {
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Invalid token",
      });
    }
  };
};

export default auth;
