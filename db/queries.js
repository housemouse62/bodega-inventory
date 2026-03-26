import pool from "./pool.js";

async function getAllCategories() {
  const { rows } = await pool.query("SELECT * FROM categories");
  return rows;
}

async function getAllCategoryItems(id) {
  const { rows } = await pool.query(
    "SELECT categories.id AS category_id, categories.name AS category_name, items.id AS item_id, items.name AS item_name, items.size AS item_size, items.price AS item_price, items.stock AS item_stock, items.sku AS item_sku FROM categories JOIN item_categories ON categories.id = item_categories.category_id JOIN items ON item_categories.item_id = items.id WHERE categories.id = $1",
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

async function getAllItems() {
  const { rows } = await pool.query("SELECT * FROM items");
  return rows;
}

async function deleteItem(id) {
  await pool.query("DELETE FROM item_categories WHERE item_id = $1", [id]);
  await pool.query("DELETE FROM items WHERE items.id = $1", [id]);
}

async function addItem(name, size, price, stock, image_url, category, itemID) {
  const result = await pool.query(
    "INSERT INTO items (name, size, price, stock, image_url) VALUES ($1, $2, $3, $4, $5)",
    [name, size, price, stock, image_url],
  );
  const newItemID = result.rows[0].id;
  await pool.query("INSERT INTO item_categories ($1, $2)", [
    newItemID,
    category,
  ]);
}

export default {
  getAllCategories,
  getAllCategoryItems,
  getItemDetails,
  getAllItems,
  deleteItem,
  addItem,
};
