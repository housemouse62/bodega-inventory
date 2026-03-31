import { Router } from "express";
const indexRouter = Router();
import {
  viewAllCategoriesGet,
  loginGet,
  loginPost,
  logoutPost,
} from "../controllers/indexController.js";

indexRouter.get("/", viewAllCategoriesGet); //view all categories in a grid
indexRouter.get("/login", loginGet);
indexRouter.post("/login", loginPost);
indexRouter.post("/", logoutPost);

export default indexRouter;
