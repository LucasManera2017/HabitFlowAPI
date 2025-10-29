import { app } from "./app.ts"
import "dotenv/config"

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server working on port http://localhost:${PORT}`)
})
