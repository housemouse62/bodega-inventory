import { Router } from "express";
const itemsRouter = Router();
import { viewItemDetailsGet } from "../controllers/itemsController.js";

// itemsRouter.get("/", viewAllItems); // view list of all items? or grid?
itemsRouter.get("/:id", viewItemDetailsGet); //view individual item details
export default itemsRouter;
