// setup express api
import express from "express";
import dotenv from "dotenv"
import { connectDB } from "./config/db.js";
import { router as noteRoutes } from "./routes/noteRoutes.js"

dotenv.config()
connectDB();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/notes", noteRoutes);



//listen on port 3000
app.listen(PORT, () =>{
console.log(`App running on port ${PORT}`)
})

// set middleware connection
