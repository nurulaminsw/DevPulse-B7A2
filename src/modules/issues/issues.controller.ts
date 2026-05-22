import type { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { issueService } from "./issues.service";

const createIssue = async (req: Request, res: Response) => {
  try {
    const { title, description, type } = req.body;

    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const reporterId = req.user.id;

    const issue = await issueService.createIssueIntoDB({
      title,
      description,
      type,
      reporter_id: reporterId,
    });

    return res.status(201).json({
      success: true,
      message: "Issue created successfully",
      data: issue,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err?.message || "Something went wrong",
    });
  }
};

const getAllIssues = async (req: Request, res: Response) => {
  try {
    const data = await issueService.getAllIssuesFromDB({
      sort: req.query.sort as string,
      type: req.query.type as string,
      status: req.query.status as string,
    });

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      data,
    });
  } catch (error) {
    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

export const issuesController = {
  createIssue,
  getAllIssues,
};
