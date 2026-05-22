import { Router } from "express";
import auth from "../../middleware/auth.middleware";
import { issuesController } from "./issues.controller";

const router = Router();

router.post("/", auth("contributor", "maintainer"), issuesController.createIssue);
router.get("/", issuesController.getAllIssues);
router.get("/:id", issuesController.getSingleIssue);


export const issuesRouter = router;
