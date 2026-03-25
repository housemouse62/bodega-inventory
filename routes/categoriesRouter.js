import { Router } from "express";
const categoriesRouter = Router();
import { viewAllCategoryItemsGet } from "../controllers/categoriesController.js";

categoriesRouter.get("/:id", viewAllCategoryItemsGet); //view all items in category

export default categoriesRouter;
