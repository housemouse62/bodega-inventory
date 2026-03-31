import pool from "./pool.js";

async function getAllCategories() {
  const { rows } = await pool.query("SELECT * FROM categories");
  return rows;
}

async function getAllCategoryItems(id, sortBy, orderBy) {
  const allowedSorts = ["item_name", "item_price", "item_stock"];
  const column = allowedSorts.includes(sortBy) ? sortBy : "item_name";
  const order = orderBy ? orderBy : "ASC";
  const { rows } = await pool.query(
    `SELECT categories.id AS category_id, categories.name AS category_name, items.id AS item_id, items.image_url AS item_url, items.name AS item_name, items.size AS item_size, items.price AS item_price, items.stock AS item_stock, items.sku AS item_sku FROM categories JOIN item_categories ON categories.id = item_categories.category_id JOIN items ON item_categories.item_id = items.id WHERE categories.id = $1 ORDER BY ${column} ${order}`,
    [id],
  );
  return rows;
}

async function getItemDetails(id) {
  const { rows } = await pool.query(
    "SELECT categories.id AS category_id, categories.name AS category_name, items.id AS item_id, items.name AS item_name, items.size AS item_size, items.price AS item_price, items.stock AS item_stock, items.sku AS item_sku, items.image_url AS image_url FROM categories JOIN item_categories ON categories.id = item_categories.category_id JOIN items ON item_categories.item_id = items.id WHERE items.id = $1",
    [id],
  );
  return rows;
}

async function getAllItems(sortBy, orderBy) {
  const allowedSorts = ["name", "price", "stock"];
  const column = allowedSorts.includes(sortBy) ? sortBy : "name";
  const order = orderBy === "DESC" ? "DESC" : "ASC";
  const orderExpr = column === "name" ? "LOWER(name)" : column;
  const { rows } = await pool.query(
    `SELECT * FROM items ORDER BY ${orderExpr} ${order}`,
  );
  return rows;
}

async function deleteItem(id) {
  await pool.query("DELETE FROM item_categories WHERE item_id = $1", [id]);
  await pool.query("DELETE FROM items WHERE items.id = $1", [id]);
}

async function addItem(name, size, price, stock, image_url, category, itemID) {
  const result = await pool.query(
    "INSERT INTO items (name, size, price, stock, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING id",
    [name, size, price, stock, image_url],
  );
  const newItemID = result.rows[0].id;
  await pool.query(
    "INSERT INTO item_categories (item_id, category_id) VALUES ($1, $2)",
    [newItemID, category],
  );
}

async function updateItem(id, name, size, price, stock, image_url, category) {
  await pool.query(
    "UPDATE items SET name = $1, size = $2, price = $3, stock = $4, image_url = $5 WHERE id = $6",
    [name, size, price, stock, image_url, id],
  );
  await pool.query(
    "UPDATE item_categories SET category_id = $1 WHERE item_id = $2",
    [category, id],
  );
}

export default {
  getAllCategories,
  getAllCategoryItems,
  getItemDetails,
  getAllItems,
  deleteItem,
  addItem,
  updateItem,
};
