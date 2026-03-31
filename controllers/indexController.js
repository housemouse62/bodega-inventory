import pool from "../db/pool.js";
import db from "../db/queries.js";
import bcrypt from "bcrypt";

async function viewAllCategoriesGet(req, res) {
  const categories = await db.getAllCategories();
  res.render("index", {
    title: "All Categories",
    categories: categories,
    currentPath: req.baseUrl + req.path,
  });
}

async function loginGet(req, res) {
  res.render("login");
}

async function loginPost(req, res) {
  const userName = req.body.username;
  const password = req.body.password;

  const pwCorrect = await bcrypt.compare(
    password,
    process.env.ADMIN_PASSWORD_HASH,
  );

  if (!pwCorrect) {
    const passwordErrors = "Invalid Password";
    return res.status(400).render("login", {
      userName: userName,
      passwordErrors: passwordErrors,
      from: req.query.from || "/",
    });
  } else {
    req.session.isAdmin = true;
    req.session.userName = userName;
    res.redirect(req.query.from || "/");
  }
}

async function logoutPost(req, res) {
  req.session.destroy((error) => {
    if (error) {
      console.error(error);
    } else {
      res.redirect(req.query.from || "/");
    }
  });
}

export { viewAllCategoriesGet, loginGet, loginPost, logoutPost };
