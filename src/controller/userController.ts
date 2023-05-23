import User, { IUserParam } from "../model/user";
import { createError } from "../utils/errorHandler";
import Channel, { IChannel } from "../model/channel";
import { HydratedDocument } from "mongoose";
import { deleteChannel } from "./channelController";

export const getUsers = async (page = 1, per_page = 10, query = "") => {
  const queryRegex = `${query}`;

  const searchQuery = {
    $or: [
      { username: { $regex: queryRegex, $options: "i" } },
      { displayName: { $regex: queryRegex, $options: "i" } },
      { email: { $regex: queryRegex, $options: "i" } },
    ],
  };

  try {
    const users = await User.find(searchQuery)
      .skip(per_page * (page - 1))
      .limit(per_page)
      .sort({ updatedAt: "asc" })
      .exec();
    return { list: users, count: users.length, per_page, page };
  } catch (error: any) {
    createError(error.name, 503);
    return { list: [], count: 0, per_page, page };
  }
};

export const getUser = async (id: string) => {
  try {
    return await User.findById(id).exec();
  } catch (error: any) {
    createError(error.name, 503);
    return null;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    return await User.findOne({ email: email }).exec();
  } catch (error: any) {
    createError(error.name, 503);
    return null;
  }
};

export const getUserByUsername = async (username: string) => {
  try {
    return await User.findOne({ username: username }).exec();
  } catch (error: any) {
    createError(error.name, 503);
    return null;
  }
};

export const createUser = async (data: IUserParam) => {
  try {
    return await User.create({
      ...data,
      type: data.type || "user",
      channels: [],
    });
  } catch (error: any) {
    createError(error.name, 422);
    return null;
  }
};

export const checkUsernameExist = async (username: string) => {
  const user = await getUserByUsername(username);
  return !!user;
};

export const checkEmailExist = async (email: string) => {
  const user = await getUserByEmail(email);
  return !!user;
};

export const updateUser = async (id: string, data: IUserParam) => {
  try {
    return await User.updateOne({ _id: id }, { $set: { ...data } }).exec();
  } catch (error: any) {
    createError(error.name, 503);
    return null;
  }
};

export const deleteUser = async (id: string) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      createError("user not found", 404);
      return false;
    }

    for (const ch of user.channels) {
      const channel = await Channel.findById(ch._id);
      if (!channel) continue;
      await deleteChannel(channel._id?.toHexString());
    }

    return !!(await User.deleteOne({ _id: id }));
  } catch (error: any) {
    createError(error.name, 503);
    return null;
  }
};

export const getUserChannels = async (id: string) => {
  try {
    const data = await User.findById(id).populate("channels._id").exec();
    return data?.channels?.map(
      (id) => id._id as unknown as HydratedDocument<IChannel>,
    );
  } catch (error: any) {
    createError(error.name, 503);
    return null;
  }
};
