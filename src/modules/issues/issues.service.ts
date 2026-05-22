import { pool } from "../../db";

type CreateIssuePayload = {
  title: string;
  description: string;
  type: "bug" | "feature_request";
  reporter_id: number;
};

const createIssueIntoDB = async (payload: CreateIssuePayload) => {
  const { title, description, type, reporter_id } = payload;

  const result = await pool.query(
    `
    INSERT INTO issues (title, description, type, status, reporter_id)
    VALUES ($1, $2, $3, 'open', $4)
    RETURNING id, title, description, type, status, reporter_id, created_at, updated_at
    `,
    [title, description, type, reporter_id],
  );

  return result.rows[0];
};

const getAllIssuesFromDB = async (query: {
  sort?: string;
  type?: string;
  status?: string;
}) => {
  const sort = query.sort || "newest";
  const type = query.type;
  const status = query.status;

  let sql = `
    SELECT id, title, description, type, status, reporter_id, created_at, updated_at
    FROM issues
  `;

  const values: any[] = [];
  const conditions: string[] = [];

  if (type) {
    values.push(type);
    conditions.push(`type = $${values.length}`);
  }

  if (status) {
    values.push(status);
    conditions.push(`status = $${values.length}`);
  }

  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(" AND ")}`;
  }

  sql +=
    sort === "oldest"
      ? ` ORDER BY created_at ASC`
      : ` ORDER BY created_at DESC`;

  const issuesRes = await pool.query(sql, values);
  const issues = issuesRes.rows;

  const reporterIds: number[] = [];
  for (const issue of issues) {
    if (!reporterIds.includes(issue.reporter_id)) {
      reporterIds.push(issue.reporter_id);
    }
  }

  let reporters: any[] = [];
  if (reporterIds.length > 0) {
    const reportersRes = await pool.query(
      `SELECT id, name, role FROM users WHERE id = ANY($1::int[])`,
      [reporterIds],
    );
    reporters = reportersRes.rows;
  }

  const data = issues.map((issue) => {
    const reporter = reporters.find((u) => u.id === issue.reporter_id) || null;

    return {
      id: issue.id,
      title: issue.title,
      description: issue.description,
      type: issue.type,
      status: issue.status,
      reporter,
      created_at: issue.created_at,
      updated_at: issue.updated_at,
    };
  });

  return data;
};

const getSingleIssueFromDB = async (id: number) => {
  const issueRes = await pool.query(
    `SELECT id, title, description, type, status, reporter_id, created_at, updated_at
     FROM issues
     WHERE id = $1`,
    [id],
  );

  const issue = issueRes.rows[0];
  if (!issue) return null;

  const reporterRes = await pool.query(
    `SELECT id, name, role FROM users WHERE id = $1`,
    [issue.reporter_id],
  );

  const reporter = reporterRes.rows[0] || null;
  return {
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter,
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  };
};

export const issueService = {
  createIssueIntoDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
};
