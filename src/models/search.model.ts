import { Schema, model } from "mongoose";

export interface ISearch<T = any> {
  key: string;
  data: T;
  createdAt: Date;
  expiresAt?: Date;
}

const searchSchema = new Schema<ISearch>(
  {
    key: { type: String, required: true },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
    expiresAt: {
      type: Date,
      index: { expires: 0 },
    },
  },
  { timestamps: true }
);

export const Search = model<ISearch>("search", searchSchema);
