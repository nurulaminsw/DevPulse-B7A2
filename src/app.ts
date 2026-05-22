import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { authRouter } from "./modules/auth/auth.router";
import { issuesRouter } from "./modules/issues/issues.router";

const app: Application = express();

app.use(express.json());
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: " express server are runing",
    author: "Nurul Amin",
  });
});

app.use("/api/auth", authRouter);
app.use("/api/issues" , issuesRouter);

export default app;
