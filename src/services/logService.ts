import { Types } from "mongoose";
import Log, { type ILog } from "../models/logModel.ts";
import Habit, { type IHabit } from '../models/habitModel.ts'
import { error } from "console";

const logServices = {
    markAsCompletedHabit: async (habitId: string) => {
        const objectId = new Types.ObjectId(habitId)
        const habit = await Habit.findById(objectId)

        if (!habit) {
            throw new Error("Habit not found")
        }

        const frequency = habit.frequency
        const date = new Date()
        // Data mínima: 00:00:00.000
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        // Data máxima: 23:59:59.999
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));

        //Weekly
        const sixDayAgo = new Date(date);
        sixDayAgo.setDate(date.getDate() - 6)
        const startOfWeek = new Date(sixDayAgo.setHours(0, 0, 0, 0))

        //Hourly
        const hourFreq = habit.hourFrequency ?? 1;
        const dailyFrequencyPerHour = 24 / hourFreq;

        switch (frequency) {
            case "daily":
                const logsDay = await Log.find(
                    {
                        habitId: objectId, createdAt: { $lte: endOfDay, $gte: startOfDay },
                    })
                console.log(logsDay)

                if (logsDay.length >= 1) {
                    return false
                }
                console.log('Chegou aqui')
                await Log.create({ habitId: objectId })
                return true
                break;
            case "weekly":
                const logsWeek = await Log.find({
                    habitId: objectId,
                    createdAt: { $gte: startOfWeek, $lte: endOfDay }
                })
                if (logsWeek.length >= 1) {
                    return false
                }
                console.log('Chegou no week')
                await Log.create({ habitId: objectId })
                return true
            case "hourly":
                const logsToday = await Log.find({
                    habitId: objectId,
                    createdAt: { $gte: startOfDay, $lte: endOfDay },
                });

                if (logsToday.length >= dailyFrequencyPerHour) {
                    return false
                }

                await Log.create({ habitId: objectId })
                return true
            default:
                break;
        }
    }
}

export default logServices