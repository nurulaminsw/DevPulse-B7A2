import type { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { issueService } from "./issues.service";

const createIssue = async (req: Request, res: Response) => {
  try {
    const { title, description, type } = req.body;

    if (!req.user?.id) {
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Unauthorized",
      });
    }

    const reporterId = req.user.id;

    const issue = await issueService.createIssueIntoDB({
      title,
      description,
      type,
      reporter_id: reporterId,
    });

    return sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Issue created successfully",
      data: issue,
    });
  } catch (err: any) {
    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Issue creation failed",
      error: err.message,
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
      message: "Issues retrived successfully",
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
const getSingleIssue = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Invalid issue id",
      });
    }

    const issue = await issueService.getSingleIssueFromDB(id);

    if (!issue) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Issue not found",
      });
    }

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue retrived successfully",
      data: issue,
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

const updateIssue = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!id) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Invalid issue id",
      });
    }

    if (!userId || !userRole) {
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Unauthorized access",
      });
    }

    const updatedIssue = await issueService.updateIssueInDB(
      id,
      userId,
      userRole,
      req.body,
    );

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue updated successfully",
      data: updatedIssue,
    });
  } catch (error: any) {
    return sendResponse(res, {
      statusCode: error.statusCode || 500,
      success: false,
      message: error.message || "Failed to update issue",
      error: error.message,
    });
  }
};

const deleteIssue = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Invalid issue id",
      });
    }

    await issueService.deleteIssueFromDB(id);

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error: any) {
    return sendResponse(res, {
      statusCode: error.statusCode || 500,
      success: false,
      message: error.message || "Failed to delete issue",
      error: error.message,
    });
  }
};

export const issuesController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue,
};
