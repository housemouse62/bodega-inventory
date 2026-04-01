import { Router } from "express";
const itemsRouter = Router();
import rateLimit from "express-rate-limit";
const deleteLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });
import checkAuth from "../middleware/auth.js";

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
itemsRouter.post("/new", checkAuth, addItem);
itemsRouter.get("/:id/confirmDeleteItem", checkAuth, confirmDeleteItem); // popup for password to confirm item deletion
itemsRouter.post("/:id/deleteItem", checkAuth, deleteLimiter, deleteItem); // deletion confirmation message
itemsRouter.post("/:id/edit", checkAuth, updateItem);
itemsRouter.get("/:id", viewItemDetailsGet); //view individual item details
export default itemsRouter;
