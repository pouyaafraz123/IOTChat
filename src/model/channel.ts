import mongoose from "mongoose";
import Mongoose, { Model } from "mongoose";
import { IUser } from "./user";

export interface IMUser {
  displayName: string;
  avatar?: string;
  _id?: Mongoose.Types.ObjectId;
}

export interface IChannel {
  _id: Mongoose.Types.ObjectId;
  name: string;
  creator: IUser;
  description?: string;
  members: IMUser[];
  displayName: string;
  image: string;
  messages: {
    _id: Mongoose.Types.ObjectId;
  }[];
}

export interface IChannelParam {
  name: string;
  description?: string;
  displayName: string;
  image: string;
}

const channelSchema = new mongoose.Schema<IChannel, Model<IChannel>>(
  {
    name: { type: String, required: true, unique: true },
    displayName: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    creator: {
      _id: { type: Mongoose.Types.ObjectId },
      username: {
        type: String,
        required: true,
        unique: false,
      },
      email: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      avatar: {
        type: String,
      },
      firstname: {
        type: String,
        required: true,
      },
      lastname: {
        type: String,
        required: true,
      },
      displayName: {
        type: String,
        required: true,
      },
      age: {
        type: Number,
        required: true,
      },
      bio: { type: String },
      phone: { type: String },
      type: {
        type: String,
        required: true,
        enum: ["super", "admin", "user"],
      },
    },
    members: [
      {
        _id: { type: Mongoose.Types.ObjectId, ref: "User" },
        avatar: {
          type: String,
        },
        displayName: {
          type: String,
          required: true,
        },
      },
    ],
    messages: [{ _id: { type: Mongoose.Types.ObjectId, ref: "Message" } }],
  },
  { timestamps: true },
);

export default mongoose.model<IChannel, Model<IChannel>>(
  "Channel",
  channelSchema,
);
