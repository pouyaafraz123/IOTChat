import { NewRequest } from "../middleware/Auth";
import { createError } from "../utils/errorHandler";

export const validateUser = (req: NewRequest) => {
  if (!req?.user) {
    createError("Un Authenticated", 401);
  }
};

export const belongToUser = (req: NewRequest, user_id: string) => {
  if (req.user && req.user?._id?.toHexString() === user_id) {
    return true;
  } else {
    createError("Access Denied", 403);
    return false;
  }
};
