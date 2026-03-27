import pool from "../db/pool.js";
import db from "../db/queries.js";

async function viewAllCategoryItemsGet(req, res) {
  const sortBy = req.query.sort;
  const categoryID = req.params.id;
  const items = await db.getAllCategoryItems(categoryID, sortBy);
  res.render("categoryPage", {
    title: `All ${items.category_name}Items`,
    items: items,
    categoryID: categoryID,
  });
}

export { viewAllCategoryItemsGet };
