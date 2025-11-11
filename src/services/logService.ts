import { Types } from "mongoose";
import Log, { type ILog } from "../models/logModel.ts";
import Habit, { type IHabit } from "../models/habitModel.ts";

const logServices = {
    markAsCompletedHabit: async (
        habitId: string
    ): Promise<{ success: boolean; message: string }> => {
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

        switch (habit.frequency) {
            case "daily": {
                const logsDay = await Log.find(
                    {
                        habitId: objectId,
                        createdAt: { $gte: startOfDay, $lte: endOfDay },
                    },
                    {
                        hourFrequency: 0
                    }
                );

                if (logsDay.length >= 1)
                    return { success: false, message: "Already completed today" };

                await Log.create({ habitId: objectId });

                const penultimLog = await Log.findOne({ habitId: objectId })
                    .sort({ createdAt: -1 })
                    .skip(1);

                const lastlog = await Log.findOne({ habitId: objectId }).sort({
                    createdAt: -1,
                });

                if (penultimLog && lastlog) {
                    const penultimLogDate = new Date(penultimLog.createdAt);
                    penultimLogDate.setHours(0, 0, 0, 0);
                    const lastLogDate = new Date(lastlog.createdAt);
                    lastLogDate.setHours(0, 0, 0, 0);

                    const diffDays = Math.floor(
                        (lastLogDate.getTime() - penultimLogDate.getTime()) /
                        (1000 * 60 * 60 * 24)
                    );

                    if (diffDays === 1) {
                        habit.streak++;
                        await habit.save();
                        return { success: true, message: "Daily streak increased!" };
                    } else if (diffDays > 1) {
                        habit.streak = 1;
                        await habit.save();
                        return { success: false, message: "You lost your daily streak!" };
                    }
                }

                habit.streak = 1;
                await habit.save();
                return { success: true, message: "First log created!" };
            }

            case "weekly": {
                const logsWeek = await Log.find({
                    habitId: objectId,
                    createdAt: { $gte: startOfWeek, $lte: endOfDay },
                });

                if (logsWeek.length >= 1)
                    return { success: false, message: "Already completed this week" };

                await Log.create({ habitId: objectId });

                const penultimLog = await Log.findOne({ habitId: objectId })
                    .sort({ createdAt: -1 })
                    .skip(1);

                const lastlog = await Log.findOne({ habitId: objectId }).sort({
                    createdAt: -1,
                });

                if (penultimLog && lastlog) {
                    const penultimLogDate = new Date(penultimLog.createdAt);
                    penultimLogDate.setHours(0, 0, 0, 0);
                    const lastLogDate = new Date(lastlog.createdAt);
                    lastLogDate.setHours(0, 0, 0, 0);

                    const diffDays = Math.floor(
                        (lastLogDate.getTime() - penultimLogDate.getTime()) /
                        (1000 * 60 * 60 * 24)
                    );

                    if (diffDays <= 14) {
                        habit.streak++;
                        await habit.save();
                        return { success: true, message: "Weekly streak increased!" };
                    } else {
                        habit.streak = 1;
                        await habit.save();
                        return { success: false, message: "You lost your weekly streak!" };
                    }
                }

                habit.streak = 1;
                await habit.save();
                return { success: true, message: "First log created!" };
            }

            case "hourly": {

                const logsToday = await Log.find({
                    habitId: objectId,
                    createdAt: { $gte: startOfDay, $lte: endOfDay },
                });

                const dailyFrequencyPerHour = 24 / (habit.hourFrequency ?? 1); // Ex: 4 horas -> 6 logs

                if (logsToday.length >= dailyFrequencyPerHour) {
                    return {
                        success: false,
                        message: "Already completed all logs for today",
                    };
                }

                // --- Reset Streak (Based on yesterday Streak) ---
                const yesterday = new Date(now);
                yesterday.setDate(yesterday.getDate() - 1);

                const startOfYesterday = new Date(yesterday);
                startOfYesterday.setUTCHours(0, 0, 0, 0);

                const endOfYesterday = new Date(yesterday);
                endOfYesterday.setUTCHours(23, 59, 59, 999);

                const logsYesterday = await Log.find({
                    habitId: objectId,
                    createdAt: { $gte: startOfYesterday, $lte: endOfYesterday },
                });

                if (logsYesterday.length < dailyFrequencyPerHour) {
                    habit.streak = 0;
                    await habit.save();
                }

                // --- Creating new Log
                await Log.create({ habitId: objectId });

                // 4. Count the new Log
                const updatedLogsToday = await Log.find({
                    habitId: objectId,
                    createdAt: { $gte: startOfDay, $lte: endOfDay },
                });

                // 5. If all logs completed, increase the streak
                if (updatedLogsToday.length === dailyFrequencyPerHour) {
                    habit.streak++;
                    await habit.save();
                    return { success: true, message: "Daily streak increased!" };
                }

                // 6. Log createad, but the day was not finished
                return { success: true, message: "Log created!" };
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
        const logs = await Log.find({ habitId: objectId }).sort({ createdAt: -1 });

        if (!habit) throw new Error("Habit not found");

        return { habit, logs };
    },

    getStreak: async (habitId: string) => {
      const objectId = new Types.ObjectId(habitId);
      const habit = await Habit.findById(objectId)

      if (!habit) throw new Error("habit not found");

      return habit
    }
};

export default logServices;
