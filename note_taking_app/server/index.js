// setup express api
import express from "express";
import dotenv from "dotenv"
import { connectDB } from "./config/db.js";

dotenv.config()

connectDB();

const app = express();

const PORT = process.env.PORT || 3000;

//listen on port 3000
app.listen(PORT, () =>{
console.log(`App running on port ${PORT}`)
})

// set middleware connection
