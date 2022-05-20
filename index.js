import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";
import path from "path";
import { fileURLToPath } from "url";

// initialize app
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// mount postRoutes to posts.
// postRoutes itself is a router-level middleware that mounts too.
app.use("/posts", postRoutes);

app.use("/user", userRoutes);
// online cloud database by mongoDB

const PORT = process.env.PORT || 4000;

// serving the build folder.
app.get("/", (req, res) => {
  res.send("APP IS RUNNING.");
});
mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => console.log(`server running on port: ${PORT}`))
  )
  .catch((error) => console.log(error.message));
