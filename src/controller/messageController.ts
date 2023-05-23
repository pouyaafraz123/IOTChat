import { HydratedDocument } from "mongoose";
import Channel from "../model/channel";
import { createError } from "../utils/errorHandler";
import Message, { IMessage, ISendMessage } from "../model/message";
import { getUserResolver } from "../graphql/resolver/userResolver";
import { getChannel } from "./channelController";
import socket from "../socket";

export const getChannelMessages = async (id: string) => {
  try {
    const data = await Channel.findById(id).populate("messages._id").exec();
    return data?.messages?.map(
      (id) => id._id as unknown as HydratedDocument<IMessage>,
    );
  } catch (error: any) {
    createError(error.name, 503);
    return null;
  }
};

export const sendMessage = async (
  senderId: string,
  { message, receiver }: ISendMessage,
) => {
  try {
    const sender = await getUserResolver({ id: senderId });
    const m = await Message.create({
      message,
      receiver_id: receiver.id,
      sender: {
        _id: sender?._id,
        avatar: sender?.avatar,
        displayName: sender?.displayName,
      },
      receiver_type: receiver?.type,
    });
    const channel = await getChannel(receiver.id);
    const messages = [];
    if (channel?.messages) {
      for (const item of channel.messages) {
        messages.push(item);
      }
      messages.push({ _id: m._id });
    }
    if (channel) channel.messages = messages;
    await channel?.save();
    const io = socket.getIo();

    io.emit("message", {
      action: "create",
      data: m,
    });

    return m;
  } catch (error: any) {
    createError(error.name, 503);
    return null;
  }
};
