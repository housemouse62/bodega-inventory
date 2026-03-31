function checkAuth(req, res, next) {
  req.session.isAdmin === true ? next() : res.redirect("/login");
}

export default checkAuth;
