import mongoose from "mongoose";
import Mongoose, { Model } from "mongoose";

export interface IUser {
  _id?: Mongoose.Types.ObjectId;
  username: string;
  email: string;
  avatar?: string;
  age: number;
  phone?: string;
  firstname: string;
  lastname: string;
  displayName: string;
  bio?: string;
  password: string;
  type: "super" | "admin" | "user";
  channels: {
    _id: Mongoose.Types.ObjectId;
  }[];
}

export interface IUserParam {
  username: string;
  email: string;
  avatar?: string;
  age: number;
  phone?: string;
  firstname: string;
  lastname: string;
  displayName: string;
  bio?: string;
  password: string;
  type?: "super" | "admin" | "user";
}

const userSchema = new mongoose.Schema<IUser, Model<IUser>>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
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
    channels: [{ _id: { type: Mongoose.Types.ObjectId, ref: "Channel" } }],
  },
  { timestamps: true },
);

export default mongoose.model<IUser, Model<IUser>>("User", userSchema);
