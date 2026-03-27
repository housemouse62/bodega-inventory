import pool from "../db/pool.js";
import db from "../db/queries.js";

async function viewItemDetailsGet(req, res) {
  const itemID = req.params.id;
  const items = await db.getItemDetails(itemID);
  res.render("itemPage", {
    title: `${items.item_name}`,
    items: items,
    from: req.query.from || "/",
    categoryName: req.query.categoryName,
  });
}

async function viewAllItemsGet(req, res) {
  const items = await db.getAllItems(req.query.sort);
  res.render("allItemsPage", {
    title: "All items",
    items: items,
  });
}

async function confirmDeleteItem(req, res) {
  const itemID = req.params.id;
  const item = await db.getItemDetails(itemID);
  res.render("confirmDelete", {
    title: `${item[0].item_name}`,
    item: item,
    from: req.query.from || "/",
    categoryName: req.query.categoryName,
  });
}

async function deleteItem(req, res) {
  const itemID = req.params.id;
  const item = await db.getItemDetails(itemID);
  const pwCorrect = req.body.password === process.env.ADMIN_PASSWORD;
  if (pwCorrect) {
    await db.deleteItem(item[0].item_id);
    res.render("itemDeleted", {
      title: `${item[0].item_name}`,
      item: item,
      from: req.query.from || "/",
      categoryName: req.query.categoryName || "",
    });
  } else {
    const errors = "Invalid Password";
    return res.status(400).render("confirmDelete", {
      title: `${item[0].item_name}`,
      item: item,
      errors: errors,
      from: req.query.from || "/",
      categoryName: req.query.categoryName,
    });
  }
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
  confirmDeleteItem,
};
