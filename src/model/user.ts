import mongoose, { Model } from "mongoose";

export interface IUser {
  username: string;
  email: string;
  avatar: string;
  age: number;
  phone?: string;
  firstname: string;
  lastname: string;
  displayName?: string;
  bio?: string;
  status: "pending" | "inactive" | "active";
  online: boolean;
  password: string;
  type: "super" | "admin" | "pro" | "user";
}

const userSchema = new mongoose.Schema<IUser, Model<IUser>>({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  }, lastname: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
  },
  age: {
    type: Number,
    required: true,
  },
  bio: { type: String },
  online: { type: Boolean, required: true, default: false },
  phone: { type: String },
  status: { type: String, enum: ["pending", "inactive", "active"], default: "pending" },
  type: { type: String, required: true, enum: ["super", "admin", "pro", "user"] },
}, { timestamps: true });

export default mongoose.model<IUser, Model<IUser>>("User", userSchema);
