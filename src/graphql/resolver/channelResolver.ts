import { IIdentifier, IPaginationParam, ISearchParam, IUserId, Params } from "../../types";
import { IChannelParam } from "../../model/channel";
import { NewRequest } from "../../middleware/Auth";
import {
  addMember,
  createChannel,
  deleteChannel,
  getChannel,
  getChannelByName,
  getChannels,
  updateChannel,
} from "../../controller/channelController";
import { createError } from "../../utils/errorHandler";
import Mongoose from "mongoose";
import { getUserResolver } from "./userResolver";
import { belongToUser, validateUser } from "../../validator";

export const createChannelResolver = async (
  { data }: Params<IChannelParam>,
  req: NewRequest,
) => {
  validateUser(req);
  return await createChannel(req.user?.id, data);
};

export const getChannelsResolver = async (
  { page, per_page, query }: IPaginationParam & ISearchParam,
  req: NewRequest,
) => {
  validateUser(req);
  return await getChannels(page, per_page, query);
};

export const getChannelResolver = async (
  { id }: IIdentifier,
  req: NewRequest,
) => {
  validateUser(req);
  const channel = await getChannel(id);

  if (!!channel) {
    return channel;
  }
  createError("Channel Not Found!", 404);
};

export const getChannelByNameResolver = async (
  { name }: Partial<IChannelParam>,
  req: NewRequest,
) => {
  validateUser(req);
  const channel = await getChannelByName(name || "");

  if (!!channel) {
    return channel;
  }
  createError("Channel Not Found!", 404);
};

export const addMemberResolver = async (
  { id, user_id }: IIdentifier & IUserId,
  req: NewRequest,
) => {
  validateUser(req);

  const channel = await getChannelResolver({ id }, req);
  await getUserResolver({ id: user_id });
  belongToUser(req, channel?.creator?._id?.toHexString() || "");
  return await addMember(new Mongoose.Types.ObjectId(id), user_id);
};

export const updateChannelResolver = async (
  { data, id }: Params<Partial<IChannelParam>> & IIdentifier,
  req: NewRequest,
) => {
  validateUser(req);
  const channel = await getChannelResolver({ id }, req);
  belongToUser(req, channel?.creator?._id?.toHexString() || "");
  return await updateChannel(id, data);
};

export const deleteChannelResolver = async (
  { id }: IIdentifier,
  req: NewRequest,
) => {
  validateUser(req);
  const channel = await getChannelResolver({ id }, req);
  belongToUser(req, channel?.creator?._id?.toHexString() || "");
  return await deleteChannel(id);
};
