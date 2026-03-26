import { Router } from "express";
const itemsRouter = Router();
import {
  viewItemDetailsGet,
  viewAllItemsGet,
  deleteItem,
} from "../controllers/itemsController.js";

itemsRouter.get("/", viewAllItemsGet); // view list of all items? or grid?
itemsRouter.get("/:id", viewItemDetailsGet); //view individual item details
itemsRouter.delete("/:id", deleteItem);
export default itemsRouter;
