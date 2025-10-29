import { app } from "../app.ts";
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
            message: "Error creating habit", err
        })
    }
  },
  getAllHabits: (req: Request, res: Response) => {
    res.status(200).send("getAllHabits");
  },
  getHabitById: (req: Request, res: Response) => {
    res.status(200).send("getHabitById");
  },
  updateHabit: (req: Request, res: Response) => {
    res.status(200).send("updateHabit");
  },
  deleteHabit: (req: Request, res: Response) => {
    res.status(200).send("deleteHabit");
  },
};
