import "express";

declare global {
  namespace Express {
    interface User {
      id: number;
      role: "contributor" | "maintainer";
      email?: string;
    }
    interface Request {
      user?: User;
    }
  }
}
