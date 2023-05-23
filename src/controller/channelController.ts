import { createError } from "../utils/errorHandler";
import Channel, { IChannelParam, IMUser } from "../model/channel";
import User from "../model/user";
import Mongoose from "mongoose";

export const getChannels = async (page = 1, per_page = 10, query = "") => {
  const queryRegex = `${query}`;

  const searchQuery = {
    $or: [
      { name: { $regex: queryRegex, $options: "i" } },
      { displayName: { $regex: queryRegex, $options: "i" } },
      { "creator.username": { $regex: queryRegex, $options: "i" } },
      { "creator.displayName": { $regex: queryRegex, $options: "i" } },
      { "creator.email": { $regex: queryRegex, $options: "i" } },
    ],
  };

  try {
    const channels = await Channel.find(searchQuery)
      .skip(per_page * (page - 1))
      .limit(per_page)
      .sort({ updatedAt: "asc" })
      .exec();
    return { list: channels, count: channels.length, per_page, page };
  } catch (error: any) {
    createError(error.name, 503);
    return { list: [], count: 0, per_page, page };
  }
};

export const getChannel = async (id: string) => {
  try {
    return await Channel.findById(id).exec();
  } catch (error: any) {
    createError(error.name, 503);
    return null;
  }
};

export const getChannelByName = async (name: string) => {
  try {
    return await Channel.find({ name }).exec();
  } catch (error: any) {
    createError(error.name, 503);
    return null;
  }
};

export const createChannel = async (user_id: string, data: IChannelParam) => {
  console.log("user_id" + user_id);
  try {
    const creator = await User.findById(user_id).exec();
    if (!creator) return createError("no user found", 404);

    const channel = await Channel.create({ creator, ...data, members: [] });
    return await addMember(channel._id, user_id);
  } catch (error: any) {
    console.log(error);
    createError(error.name, 503);
    return null;
  }
};

export const addMember = async (
  channel_id: Mongoose.Types.ObjectId,
  user_id: string,
) => {
  try {
    const channel = await Channel.findById(channel_id).exec();
    if (!channel) return createError("no channel found", 404);

    const user = await User.findById(user_id).exec();
    if (!user) return createError("no user found", 404);

    user.channels.push({ _id: channel._id });
    await user.save();

    const members: IMUser[] = [];
    if (channel?.members) {
      channel.members.forEach((member) => {
        members.push(member);
      });
    }
    members.push({
      _id: new Mongoose.Types.ObjectId(user_id),
      avatar: user?.avatar,
      displayName: user.displayName,
    });
    channel.members = members;
    return await channel.save();
  } catch (error: any) {
    console.log(error);
    createError(error.name, 503);
    return null;
  }
};

export const updateChannel = async (
  channel_id: string,
  data: Partial<IChannelParam>,
) => {
  try {
    return Channel.updateOne({ _id: channel_id }, { $set: { ...data } });
  } catch (error: any) {
    createError(error.name, 503);
    return null;
  }
};

export const deleteChannel = async (id: string) => {
  try {
    const channel = await getChannel(id);
    if (channel?.members) {
      for (const item of channel.members) {
        const user = await User.findById(item._id);
        if (!user) continue;
        user.channels =
          user?.channels?.filter((item) => item?._id !== channel?._id) || [];
        await user.save();
      }
    }
    return !!(await Channel.deleteOne({ _id: id }));
  } catch (error: any) {
    createError(error.name, 503);
    return null;
  }
};
