import { Router } from "express";
import { authController } from "./auth.controller";
import auth from "../../middleware/auth.middleware";

const router = Router();

router.post("/signup", auth(), authController.createUser);
router.post("/login", authController.loginUser);

export const authRouter = router;
