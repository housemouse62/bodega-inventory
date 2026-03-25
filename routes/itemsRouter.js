import { Router } from "express";
const itemsRouter = Router();

itemsRouter.get("/", viewAllItems); // view list of all items? or grid?
itemsRouter.get("/:id", viewItemDetails); //view individual item details
export default itemsRouter;
