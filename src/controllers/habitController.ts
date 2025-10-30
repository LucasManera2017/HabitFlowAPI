import type { Request, Response } from "express";
import { habitService } from "../services/habitService.ts";

export const habitController = {
  createHabit: async (req: Request, res: Response) => {
    try {
      const habit = await habitService.createHabit(req.body);
      res.status(201).json({
        message: "habit created sucessfully!",
        data: habit,
      });
    } catch (err) {
      res.status(500).json({
        message: "Error creating habit",
        err,
      });
    }
  },

  getAllHabits: async (req: Request, res: Response) => {
    try {
      const habits = await habitService.getAllHabits();
      res.status(200).json({
        length: habits.length,
        message: "success",
        data: habits,
      });
    } catch (err) {
      res.status(404).json({
        message: "No habits were found",
        err,
      });
    }
  },

  getHabitById: async (req: Request, res: Response) => {
    try {
      const habit = await habitService.getHabitByID(req.params.id);
      res.status(200).json({
        message: "success",
        data: habit,
      });
    } catch (err) {
      res.status(404).json({
        message: "Habit not found",
        err,
      });
    }
  },

  updateHabit: async (req: Request, res: Response) => {
    try {
      const updatedHabit = await habitService.updateHabit(
        req.params.id,
        req.body
      );

      res.status(200).json({
        message: "success",
        data: updatedHabit,
      });
    } catch (err) {
      res.status(404).json({
        message: "Habit not found",
        err,
      });
    }
  },

  deleteHabit: async (req: Request, res: Response) => {
    try {
      const deletedHabit = await habitService.deletedHabit(
        req.params.id
      );

      res.status(200).json({
        message: "Habit deleted successfully",
      });
    } catch (err) {
      res.status(404).json({
        message: "Habit not found",
        err,
      });
    }
  },
};
