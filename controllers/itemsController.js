import pool from "../db/pool.js";
import db from "../db/queries.js";
import { body, matchedData, validationResult } from "express-validator";

const validateItem = [
  body("name")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage(`Name must be between 1 and 50 characters`),
  body("size")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage(`Name must be between 1 and 50 characters`),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number")
    .matches(/^\d+\.\d{2}$/)
    .withMessage("Price must have exactly 2 decimal places (e.g., 9.99)"),
  body("stock")
    .trim()
    .isInt({ min: 0 })
    .withMessage(
      "Stock must be an whole number, 0 or greater. Never round up.",
    ),
  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isInt()
    .withMessage("Invalid category"),
];

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

const addItem = [
  validateItem,
  async (req, res) => {
    const errors = validationResult(req);
    console.log(errors.array());
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .render("newItemForm", { errors: errors.array(), formData: req.body });
    }
    const { name, size, price, stock, image_url, category } = matchedData(req);
    await db.addItem(name, size, price, stock, image_url, category);
    res.redirect(req.query.redirect || "/");
  },
];

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
