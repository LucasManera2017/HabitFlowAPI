import type { Request, Response } from "express";
import Habit, { type IHabit } from "../models/habitModel.ts";

export const habitService = {
  createHabit: async (data: Partial<IHabit>): Promise<IHabit> => {
    const habit = await Habit.create(data);
    return habit;
  },
};
