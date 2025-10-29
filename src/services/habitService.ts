import type { Request, Response } from "express";
import Habit, { type IHabit } from "../models/habitModel.ts";

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
  }
};
