import { NextFunction, Request, Response } from "express";
import path from "path";
import * as fs from "fs/promises";
import * as jwt from "jsonwebtoken";
import { getUserResolver } from "../graphql/resolver/userResolver";
import { HydratedDocument } from "mongoose";
import { IUser } from "../model/user";

export interface NewRequest extends Request {
  user?: HydratedDocument<IUser>;
}

const auth = async (req: NewRequest, res: Response, next: NextFunction) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    return next();
  }
  const token = authHeader.split(" ")[1];
  const key = await fs.readFile(
    path.join(__dirname, "../../", "jwt_token.key"),
  );
  try {
    const data = jwt.verify(token, key);
    if (typeof data === "string") return next();
    if (data && data?.userId) {
      const user = await getUserResolver({ id: data.userId });
      if (user) req.user = user;
    }
  } catch (e) {
    return next();
  }

  next();
};

export default auth;
