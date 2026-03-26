import pool from "../db/pool.js";
import db from "../db/queries.js";

async function viewItemDetailsGet(req, res) {
  const itemID = req.params.id;
  const items = await db.getItemDetails(itemID);
  res.render("itemPage", {
    title: `${items.item_name}`,
    items: items,
  });
}

export { viewItemDetailsGet };
