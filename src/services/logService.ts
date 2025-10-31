import { Types } from "mongoose";
import Log, { type ILog } from "../models/logModel.ts";
import Habit, { type IHabit } from '../models/habitModel.ts'
import { error } from "console";

const logServices = {
    markCompletedHabit: async (habitId: string) => {
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


        switch (frequency) {
            case "daily":
                const logs = await Log.find(
                    {
                        habitId: objectId, createdAt: { $lte: endOfDay, $gte: startOfDay },
                    })
                    console.log(logs)

                if (logs.length >= 1) {
                    return false
                }
                console.log('Chegou aqui')
                await Log.create({ habitId: objectId })
                return true
                break;
            default:
                break;
        }
    }
}

export default logServices