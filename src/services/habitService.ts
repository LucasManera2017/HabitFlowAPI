import type { Request, Response } from "express";
import Habit, { type IHabit } from "../models/habitModel.ts";
import { Types } from "mongoose";

export const habitService = {
  createHabit: async (data: Partial<IHabit>): Promise<IHabit> => {
    const habit = await Habit.create(data);
    return habit;
  },
  getAllHabits: async (): Promise<IHabit[]> => {
    return await Habit.find()
  },
  getHabitByID: async (data: string | undefined): Promise<IHabit | null> => {
    const habit = await Habit.findById(data)
    return habit
  },
  updateHabit: async (id: string | undefined,data: Partial<IHabit>): Promise<IHabit | null> => {
    const objectId = new Types.ObjectId(id)
    const updatedHabit = await Habit.findOneAndUpdate(objectId, data, {new: true, runValidators: true})
    return updatedHabit
  },
  deletedHabit: async (id: string | undefined): Promise<IHabit | null> => {
    const ObjectId = new Types.ObjectId(id)
    return await Habit.findOneAndDelete(ObjectId)
  }
};
