import { Types } from "mongoose";
import Log, { type ILog } from "../models/logModel.ts";
import Habit, { type IHabit } from "../models/habitModel.ts";
import { diff } from "util";

const logServices = {
  markAsCompletedHabit: async (habitId: string): Promise<boolean> => {
    if (!Types.ObjectId.isValid(habitId)) {
      throw new Error("Invalid habit ID");
    }

    const objectId = new Types.ObjectId(habitId);
    const habit = await Habit.findById(objectId);

    if (!habit) {
      throw new Error("Habit not found");
    }

    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    // Start of week (6 days ago)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 6);
    startOfWeek.setHours(0, 0, 0, 0);

    const hourFreq = habit.hourFrequency ?? 1;
    const dailyFrequencyPerHour = 24 / hourFreq;

    switch (habit.frequency) {
      case "daily": {
        const logsDay = await Log.find({
          habitId: objectId,
          createdAt: { $gte: startOfDay, $lte: endOfDay },
        });

        if (logsDay.length >= 1) return false;

        await Log.create({ habitId: objectId });

        const penultimLog = await Log.findOne({
          habitId: objectId,
        })
          .sort({ createdAt: -1 })
          .skip(1);

        const lastlog = await Log.findOne({
          habitId: objectId,
        }).sort({ createdAt: -1 });

        if (penultimLog && lastlog) {
          const penultimLogDate = new Date(penultimLog?.createdAt);
          penultimLogDate.setHours(0, 0, 0, 0);
          const lastLogDate = new Date(lastlog?.createdAt);
          lastLogDate.setHours(0, 0, 0, 0);

          const diffDays =
            (lastLogDate.getTime() - penultimLogDate.getTime()) /
            (1000 * 60 * 60 * 24);

          if (diffDays === 1) {
            habit.streak++;
            await habit.save();
          } else if (diffDays > 1) {
            habit.streak = 0; // opcional: reset streak se passou mais de 1 dia
            await habit.save();
            throw new Error("You lost your daily Streak!");
          }
        }
        habit.streak++;
        await habit.save();
        return true;
      }

      case "weekly": {
        const logsWeek = await Log.find({
          habitId: objectId,
          createdAt: { $gte: startOfWeek, $lte: endOfDay },
        });

        if (logsWeek.length >= 1) return false;

        await Log.create({ habitId: objectId });
        return true;
      }

      case "hourly": {
        const logsToday = await Log.find({
          habitId: objectId,
          createdAt: { $gte: startOfDay, $lte: endOfDay },
        });

        if (logsToday.length >= dailyFrequencyPerHour) return false;

        await Log.create({ habitId: objectId });
        return true;
      }

      default:
        throw new Error("Unknown frequency type");
    }
  },

  getAllLogs: async (habitId: string) => {
    if (!Types.ObjectId.isValid(habitId)) {
      throw new Error("Invalid habit ID");
    }

    const objectId = new Types.ObjectId(habitId);
    const habit = await Habit.findById(objectId);
    const logs = await Log.find({ habitId: objectId }).sort({ createdAt: -1 }); // logs mais recentes primeiro

    if (!habit) throw new Error("Habit not found");

    return { habit, logs };
  },
};

export default logServices;
