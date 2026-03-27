import pool from "../db/pool.js";
import db from "../db/queries.js";

async function viewItemDetailsGet(req, res) {
  const itemID = req.params.id;
  const items = await db.getItemDetails(itemID);
  res.render("itemPage", {
    title: `${items.item_name}`,
    items: items,
    from: req.query.from || "/",
  });
}

async function viewAllItemsGet(req, res) {
  const sortBy = req.query.sort || "name";
  const items = await db.getAllItems(sortBy);
  res.render("allItemsPage", {
    title: "All items",
    items: items,
  });
}

async function deleteItem(req, res) {
  const itemID = req.params.id;
  await db.deleteItem(itemID);
  res.redirect(req.query.redirect || "/");
}

async function addItem(req, res) {
  const { name, size, price, stock, image_url, category } = req.body;
  await db.addItem(name, size, price, stock, image_url, category);
  res.redirect(req.query.redirect || "/");
}

async function addItemShowForm(req, res) {
  res.render("newItemForm");
}
export {
  viewItemDetailsGet,
  viewAllItemsGet,
  deleteItem,
  addItem,
  addItemShowForm,
};
