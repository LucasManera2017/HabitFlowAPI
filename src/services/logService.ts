import { Types } from "mongoose";
import Log, {type ILog } from "../models/logModel.ts";

const logServices = {
    markCompletedHabit: async (habitId: string) : Promise<ILog | null> => {
        const objectId = new Types.ObjectId(habitId)
        const habitLog = await Log.findOne({habitId: objectId})
        return habitLog
    }
}

export default logServices