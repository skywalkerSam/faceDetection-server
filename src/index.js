import express from "express";
import cors from "cors";
import { detectFace } from "./controllers/faceDetection.js";
import dotenv from "dotenv";
dotenv.config()

const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.json());
app.use(cors());


app.get('/', (req, res) => { res.json("Welcome to Face Detection API...") });
app.post('/detect', (req, res) => { detectFace(req, res) });


app.listen(PORT, () => {
  console.log(`\nServer running on http://localhost:${PORT} \n\nPress Ctrl+C to stop.`)
})
