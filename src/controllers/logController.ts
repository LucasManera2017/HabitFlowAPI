import type { Request, Response } from "express";
import logServices from "../services/logService.ts";

const logController = {
  markAsCompletedHabit: async (req: Request, res: Response) => {
    try {
      const habitId = req.params.id;

      if (!habitId) {
        return res.status(400).json({
          success: false,
          message: "Missing param habitId",
        });
      }

      const result = await logServices.markAsCompletedHabit(habitId);

      // result agora retorna { success: boolean, message: string }
      if (result.success) {
        return res.status(200).json({
          success: true,
          message: result.message,
        });
      } else {
        // retorna 200 mesmo, pois a operação foi válida
        return res.status(200).json({
          success: false,
          message: result.message,
        });
      }
    } catch (err) {
      console.error("❌ Error marking habit as completed:", err);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: String(err),
      });
    }
  },

  getAllLogs: async (req: Request, res: Response) => {
    try {
      const habitId = req.params.id;

      if (!habitId) {
        return res.status(400).json({
          success: false,
          message: "Missing param habitId",
        });
      }

      const logs = await logServices.getAllLogs(habitId);

      return res.status(200).json({
        success: true,
        message: "Logs fetched successfully",
        length: logs.logs.length,
        habitName: logs.habit?.name,
        streak: logs.habit?.streak,
        habitStart: logs.habit?.createdAt,
        logs: logs.logs,
      });
    } catch (err) {
      console.error("❌ Error fetching logs:", err);
      return res.status(404).json({
        success: false,
        message: "Habit not found",
        error: String(err),
      });
    }
  },

  getStreak: async (req: Request, res: Response) => {
    const habitId = req.params.id;

    if (!habitId) {
      return res.status(404).json({
        success: false,
        message: "Missing param habitId",
      });
    }

    const habitStreak = await logServices.getStreak(habitId);

    return res.status(200).json({
      success: true,
      message: "Streak fetched successfully",
      habitName: habitStreak.name,
      streak: habitStreak.streak,
      habitStart: habitStreak.createdAt,
    });
  },
};

export default logController;
