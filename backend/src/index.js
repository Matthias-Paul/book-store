import express from "express"
import dotenv from "dotenv"
import cors from "cors"

import connectDatabase from "./config/database.js"
import authRoute from "./routes/auth.route.js"
import bookRoute from "./routes/book.route.js"
import jobs from "./utils/cron.js"

dotenv.config()

jobs.start()
connectDatabase()
const PORT = process.env.PORT || 8000
const app = express()
app.use(express.json());    

app.use(         
  cors({        
    origin: "*",   
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
); 




app.get("/api/health", (req, res) => res.send("OK"));

app.use("/api", authRoute)
app.use("/api", bookRoute)







app.listen(PORT, ()=>{
    console.log(`App is running on port ${PORT}`)
})


