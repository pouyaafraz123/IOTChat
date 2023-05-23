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

export const createChannelResolver = async (
  { data }: Params<IChannelParam>,
  req: NewRequest,
) => {


  return await createChannel(req.user?.id, data);
};

export const getChannelsResolver = async ({
                                            page,
                                            per_page,
                                            query,
                                          }: IPaginationParam & ISearchParam) => {
  return await getChannels(page, per_page, query);
};

export const getChannelResolver = async ({ id }: IIdentifier) => {
  const channel = await getChannel(id);

  if (!!channel) {
    return channel;
  }
  createError("Channel Not Found!", 404);
};

export const getChannelByNameResolver = async ({
                                                 name,
                                               }: Partial<IChannelParam>) => {
  const channel = await getChannelByName(name || "");

  if (!!channel) {
    return channel;
  }
  createError("Channel Not Found!", 404);
};

export const addMemberResolver = async ({
                                          id,
                                          user_id,
                                        }: IIdentifier & IUserId) => {
  await getChannelResolver({ id });
  await getUserResolver({ id: user_id });
  return await addMember(new Mongoose.Types.ObjectId(id), user_id);
};

export const updateChannelResolver = async ({
                                              data,
                                              id,
                                            }: Params<Partial<IChannelParam>> & IIdentifier) => {
  await getChannelResolver({ id });
  return await updateChannel(id, data);
};

export const deleteChannelResolver = async ({ id }: IIdentifier) => {
  return await deleteChannel(id);
};
