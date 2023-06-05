import { IIdentifier } from "../../types";
import { getChannel } from "../../controller/channelController";
import { getChannelMessages, sendMessage } from "../../controller/messageController";
import { ISendMessage } from "../../model/message";
import { NewRequest } from "../../middleware/Auth";
import { getChannelResolver } from "./channelResolver";
import { validateUser } from "../../validator";

export const getChannelMessagesResolver = async (
  { id }: IIdentifier,
  req: NewRequest,
) => {
  validateUser(req);
  await getChannel(id);
  return await getChannelMessages(id);
};

export const sendMessageResolver = async (
  { message, receiver }: ISendMessage,
  req: NewRequest,
) => {
  validateUser(req);
  await getChannelResolver({ id: receiver?.id }, req);
  return await sendMessage(req.user?.id, { message, receiver });
};
