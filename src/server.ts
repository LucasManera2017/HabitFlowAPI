import { app } from "./app.ts";
import "dotenv/config";
import { connectDB } from "./config/db.ts";

const PORT = process.env.PORT;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🌿 HabitFlow API is running on port http://localhost:${PORT}`);
  });
});
