import { IIdentifier } from "../../types";
import { getChannel } from "../../controller/channelController";
import { getChannelMessages, sendMessage } from "../../controller/messageController";
import { ISendMessage } from "../../model/message";
import { NewRequest } from "../../middleware/Auth";
import { getChannelResolver } from "./channelResolver";

export const getChannelMessagesResolver = async ({ id }: IIdentifier) => {
  await getChannel(id);
  return await getChannelMessages(id);
};

export const sendMessageResolver = async (
  { message, receiver }: ISendMessage,
  req: NewRequest,
) => {
  await getChannelResolver({ id: receiver?.id });
  return await sendMessage(req.user?.id, { message, receiver });
};
