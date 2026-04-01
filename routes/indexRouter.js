import { Router } from "express";
const indexRouter = Router();
import rateLimit from "express-rate-limit";
const deleteLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });
import {
  viewAllCategoriesGet,
  loginGet,
  loginPost,
  logoutPost,
} from "../controllers/indexController.js";

indexRouter.get("/", viewAllCategoriesGet); //view all categories in a grid
indexRouter.get("/login", loginGet);
indexRouter.post("/login", deleteLimiter, loginPost);
indexRouter.post("/", logoutPost);

export default indexRouter;
