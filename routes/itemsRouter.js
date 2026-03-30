import { Router } from "express";
const itemsRouter = Router();
import {
  viewItemDetailsGet,
  viewAllItemsGet,
  deleteItem,
  addItem,
  addItemShowForm,
  confirmDeleteItem,
  updateItem,
} from "../controllers/itemsController.js";

itemsRouter.get("/", viewAllItemsGet); // view list of all items? or grid?
itemsRouter.get("/new", addItemShowForm);
itemsRouter.post("/new", addItem);
itemsRouter.get("/:id/confirmDeleteItem", confirmDeleteItem); // popup for password to confirm item deletion
itemsRouter.post("/:id/deleteItem", deleteItem); // deletion confirmation message
itemsRouter.post("/:id/edit", updateItem);
itemsRouter.get("/:id", viewItemDetailsGet); //view individual item details
export default itemsRouter;
