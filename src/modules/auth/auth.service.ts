import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";
import { pool } from "../../db";
import type { IUser } from "./auth.interface";

const createUserIntoDB = async (payload: IUser) => {
  const { name, email, password, role } = payload;

  const hashPassword = bcrypt.hashSync(password, 10);

  const result = await pool.query(
    `
    INSERT INTO users(name, email, password, role ) VALUES($1,$2,$3, COALESCE($4, 'contributor'))

    RETURNING *

    `,
    [name, email, hashPassword, role],
  );

  delete result.rows[0].password;
  return result;
};

const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  const { email, password } = payload;

  const userData = await pool.query(
    `
        SELECT * FROM users WHERE email = $1
        `,
    [email],
  );

  const user = userData.rows[0];

  if (!user) {
    throw new Error("Credential Invalid");
  }

  const matchPassword = await bcrypt.compare(password, user.password);
  if (!matchPassword) {
    throw new Error("Credential Invalid");
  }
  const jwtPayload = {
    id: user.id,
    name: user.name,
    role: user.role,
  };
  console.log(jwtPayload);
  const token = jwt.sign(jwtPayload, config.secret as string, {
    expiresIn: "1d",
  });

  const { password: userPassword, ...safeUser } = user;

  return { token, user: safeUser };
};

export const authService = {
  createUserIntoDB,
  loginUserIntoDB,
};
