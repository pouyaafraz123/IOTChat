import { IMUser } from "./channel";
import Mongoose, { Model } from "mongoose";

export type TReceiverType = "channel" | "user"

export interface IMessage {
  _id: Mongoose.Types.ObjectId;
  sender: IMUser;
  message: string;
  receiver_type: TReceiverType;
  receiver_id?: Mongoose.Types.ObjectId;
}

export interface ISendMessage {
  receiver: {
    id: string;
    type: TReceiverType
  },
  message: string
}

const messageSchema = new Mongoose.Schema<IMessage, Model<IMessage>>({
  sender: {
    _id: { type: Mongoose.Types.ObjectId, ref: "User" },
    avatar: {
      type: String,
    },
    displayName: {
      type: String,
      required: true,
    },
  },
  message: { type: String, required: true },
  receiver_type: { type: String, required: true, enum: ["channel", "user"] },
  receiver_id: {
    type: Mongoose.Types.ObjectId,
    index: true,
  },
});

messageSchema.virtual("receiver", {
  ref: function() {
    return this.receiverType === "channel" ? "Channel" : "User";
  },
  localField: "receiverId",
  foreignField: "_id",
  justOne: true,
});

export default Mongoose.model<IMessage, Model<IMessage>>(
  "Message",
  messageSchema,
);
