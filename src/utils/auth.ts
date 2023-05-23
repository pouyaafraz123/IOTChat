import { createError } from "./errorHandler";
import * as bcrypt from "bcryptjs";
import path from "path";
import { promises as fs } from "fs";
import * as jwt from "jsonwebtoken";

export const checkPassword = async (password: string, userPassword: string) => {
  const isEqual = await bcrypt.compare(password, userPassword);
  if (!isEqual) {
    createError("Password incorrect!", 401);
  }
};

export const createToken = async (user_id: string) => {
  const p = path.join(__dirname, "../../", "jwt_token.key");
  const key = await fs.readFile(p);
  return jwt.sign({
    userId: user_id,
  }, key, { expiresIn: "1h" });
};
