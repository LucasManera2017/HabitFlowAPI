import mongoose, { Schema, Document } from "mongoose";

export interface IHabit extends Document {
  name: string;
  description?: string;
  frequency: "daily" | "weekly" | "custom";
  streak: number;
  createdAt: Date;
  updatedAt: Date;
}

const habitSchema: Schema = new Schema<IHabit>(
  {
    name: {
      type: String,
      required: [true, "O nome do hábito é obrigatório"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "custom"],
      default: "daily",
    },
    streak: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Habit = mongoose.model<IHabit>("Habit", habitSchema);

export default Habit;
