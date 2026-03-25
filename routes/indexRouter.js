import { Router } from "express";
const indexRouter = Router();
import { viewAllCategoriesGet } from "../controllers/indexController.js";

indexRouter.get("/", viewAllCategoriesGet); //view all categories in a grid

export default indexRouter;
