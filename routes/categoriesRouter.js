import { Router } from "express";
const categoriesRouter = Router();

categoriesRouter.get("/:id", viewCategoryDetails); //view all items in category

export default categoriesRouter;
