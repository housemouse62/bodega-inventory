import pool from "../db/pool.js";
import db from "../db/queries.js";

async function viewAllCategoryItemsGet(req, res) {
  const editID = req.query.edit;
  const editItem = editID ? await db.getItemDetails(editID) : null;

  const sortBy = req.query.sort;
  const orderBy = req.query.order;
  const categoryID = req.params.id;

  const items = await db.getAllCategoryItems(categoryID, sortBy, orderBy);
  const categoryName = items[0].category_name;

  res.render("categoryPage", {
    title: `All ${categoryName}Items`,
    items: items,
    categoryID: categoryID,
    fromName: categoryName,
    currentPath: req.baseUrl + req.path,
    editItem: editItem ? editItem[0] : null,
  });
}

export { viewAllCategoryItemsGet };
