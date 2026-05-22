import { Router } from "express";
import auth from "../../middleware/auth.middleware";
import { issuesController } from "./issues.controller";

const router = Router();

router.post("/", auth("contributor"), issuesController.createIssue);
router.get("/", issuesController.getAllIssues);

export const issuesRouter = router;
