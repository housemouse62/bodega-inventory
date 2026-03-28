import pool from "../db/pool.js";
import db from "../db/queries.js";

async function viewAllCategoriesGet(req, res) {
  const categories = await db.getAllCategories();
  res.render("index", { title: "All Categories", categories: categories });
  console.log(categories);
}

export { viewAllCategoriesGet };
