import "dotenv/config";
console.log("DB_CONNECTION:", process.env.DB_CONNECTION);

import express from "express";
import indexRouter from "./routes/indexRouter.js";
import itemsRouter from "./routes/itemsRouter.js";
import categoriesRouter from "./routes/categoriesRouter.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);
app.use("/category", categoriesRouter);
// app.use("/items", itemsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Listening on port ${PORT}`);
});
