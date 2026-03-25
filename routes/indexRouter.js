import { Router } from "express";
const indexRouter = Router();

indexRouter.get("/", viewAllCategoriesGet); //view all categories in a grid

export default indexRouter;
