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
    .withMessage(`Size must be between 1 and 50 characters`),
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
  const editID = req.query.edit;
  const editItem = editID ? items : null;

  const itemPath = `/items/${itemID}`;
  const from = req.query.from || "";
  const fromName = req.query.fromName || "";
  const fullItemUrl = from
    ? `${itemPath}?from=${from}&fromName=${fromName}`
    : itemPath;

  res.render("itemPage", {
    title: `${items[0].item_name}`,
    items: items,
    from: from || "/",
    fromName: fromName,
    editItem: editItem ? editItem[0] : null,
    currentPath: itemPath,
    loginFrom: encodeURIComponent(fullItemUrl),
  });
}

async function viewAllItemsGet(req, res) {
  const sort = req.query.sort;
  const order = req.query.order;

  const editID = req.query.edit;
  const editItem = editID ? await db.getItemDetails(editID) : null;

  const items = await db.getAllItems(sort, order);

  res.render("allItemsPage", {
    title: "All items",
    items: items,
    currentPath: req.baseUrl + req.path,
    editItem: editItem ? editItem[0] : null,
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
    currentPath: req.baseUrl + req.path,
  });
}

async function deleteItem(req, res) {
  const itemID = req.params.id;
  const item = await db.getItemDetails(itemID);
  await db.deleteItem(item[0].item_id);
  res.render("itemDeleted", {
    title: `${item[0].item_name}`,
    item: item,
    from: req.query.from || "/",
    categoryName: req.query.categoryName || "",
    currentPath: req.baseUrl + req.path,
  });
}

const addItem = [
  validateItem,
  async (req, res) => {
    const formErrors = validationResult(req);
    if (!formErrors.isEmpty()) {
      const formErrorPayload = {
        formErrors: formErrors.array(),
        formData: req.body,
      };
      const from = req.body.from || "/";

      if (from.startsWith("/category/")) {
        const categoryID = from.split("/")[2];
        const items = await db.getAllCategoryItems(categoryID);
        const categoryName = items[0].category_name;
        return res.status(400).render("categoryPage", {
          ...formErrorPayload,
          title: `All ${categoryName} Items`,
          items,
          categoryID,
          categoryName,
          fromName: categoryName,
          currentPath: from,
        });
      }

      const categories = await db.getAllCategories();
      return res.status(400).render("index", {
        ...formErrorPayload,
        title: "All Categories",
        categories,
        currentPath: from,
      });
    }
    const { name, size, price, stock, image_url, category } = matchedData(req);
    await db.addItem(name, size, price, stock, image_url, category);
    res.redirect(req.body.from || "/");
  },
];

const updateItem = [
  validateItem,
  async (req, res) => {
    const itemID = req.params.id;
    const formErrors = validationResult(req);
    if (!formErrors.isEmpty()) {
      const editItem = await db.getItemDetails(itemID);
      const from = req.body.from || "/";
      const errorPayload = {
        formErrors: formErrors.array(),
        formData: req.body,
        editItem: editItem[0],
        currentPath: from,
      };

      if (from.startsWith("/category/")) {
        const categoryID = from.split("/")[2];
        const items = await db.getAllCategoryItems(categoryID);
        const categoryName = items[0].category_name;
        return res.status(400).render("categoryPage", {
          ...errorPayload,
          title: `All ${categoryName} Items`,
          items,
          categoryID,
          categoryName,
          fromName: categoryName,
        });
      }

      if (from.startsWith("/items/")) {
        const items = await db.getItemDetails(itemID);
        const fromName = req.body.fromName || "";
        return res.status(400).render("itemPage", {
          ...errorPayload,
          title: editItem[0].item_name,
          items,
          from: req.body.fromFrom || "/",
          fromName,
          loginFrom: encodeURIComponent(from),
        });
      }

      const items = await db.getAllItems();
      return res.status(400).render("allItemsPage", {
        ...errorPayload,
        title: "All Items",
        items,
      });
    }

    const { name, size, price, stock, image_url, category } = matchedData(req);
    await db.updateItem(itemID, name, size, price, stock, image_url, category);
    res.redirect(req.body.from || "/");
  },
];

export {
  viewItemDetailsGet,
  viewAllItemsGet,
  deleteItem,
  addItem,
  confirmDeleteItem,
  updateItem,
};
