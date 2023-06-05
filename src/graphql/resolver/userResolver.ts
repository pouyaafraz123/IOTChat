import { IIdentifier, IPaginationParam, ISearchParam, Params } from "../../types";
import {
  createUser,
  deleteUser,
  getUser,
  getUserByEmail,
  getUserByUsername,
  getUserChannels,
  getUsers,
  updateUser,
} from "../../controller/userController";
import { IUser, IUserParam } from "../../model/user";
import { createError } from "../../utils/errorHandler";
import { checkPassword, createToken } from "../../utils/auth";
import { NewRequest } from "../../middleware/Auth";
import { belongToUser, validateUser, validateUserdata } from "../../validator";

export const getUsersResolver = async (
  { page, per_page, query }: IPaginationParam & ISearchParam,
  req: NewRequest,
) => {
  validateUser(req);
  return await getUsers(page, per_page, query);
};

export const getUserResolver = async ({ id }: IIdentifier) => {
  const user = await getUser(id);

  if (!!user) {
    return user;
  }
  createError("User Not Found!", 404);
};

export const getUserByUsernameResolver = async (
  { username }: Partial<IUser>,
  req: NewRequest,
) => {
  validateUser(req);
  const user = await getUserByUsername(username || "");

  if (!!user) {
    return user;
  }
  createError("User Not Found!", 404);
};

export const getUserByEmailResolver = async (
  { email }: Partial<IUser>,
  req: NewRequest,
) => {
  validateUser(req);
  const user = await getUserByEmail(email || "");
  if (!!user) {
    return user;
  }
  createError("User Not Found!", 404);
};

export const createUserResolver = async ({ data }: Params<IUserParam>) => {
  return await createUser(await validateUserdata({ ...data }));
};

export const signupResolver = async ({ data }: Params<IUserParam>) => {
  return await createUser(await validateUserdata({ ...data, type: "user" }));
};

export const loginResolver = async ({ data }: Params<Partial<IUserParam>>) => {
  const { username, password } = data;

  const user = await getUserByUsername(username || "");
  if (!user) {
    createError("User with this username does not exist", 404);
  }
  await checkPassword(password || "", user?.password || "");

  const token = createToken(user?.id);

  return { user, token };
};

export const getCurrentUserResolver = ({}, req: NewRequest) => {
  validateUser(req);
  return req.user;
};

export const updateUserResolver = async (
  { data, id }: Params<IUserParam> & IIdentifier,
  req: NewRequest,
) => {
  validateUser(req);
  belongToUser(req, id);
  return await updateUser(id, await validateUserdata({ ...data }));
};

export const deleteUserResolver = async (
  { id }: IIdentifier,
  req: NewRequest,
) => {
  validateUser(req);
  belongToUser(req, id);
  return deleteUser(id);
};

export const getUserChannelsResolver = async (
  { id }: IIdentifier,
  req: NewRequest,
) => {
  validateUser(req);
  return await getUserChannels(id);
};
