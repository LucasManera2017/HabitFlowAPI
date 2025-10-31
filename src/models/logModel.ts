import mongoose, { Schema, Document, Types } from "mongoose";

export interface ILog extends Document {
  habitId: Types.ObjectId;
  createdAt: Date;
}

const logSchema: Schema = new Schema<ILog>(
  {
    habitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Habit",
      required: [true, "Required ID"],
    },
    createdAt: {
      type: Date,
      required: [true, "Required Log Date"],
      default: Date.now,
    },
  }
);

const Log = mongoose.model<ILog>("Log", logSchema);

export default Log;
