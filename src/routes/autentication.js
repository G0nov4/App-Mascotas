const express = require("express");
const router = express.Router();
const passport = require("passport");
const { isLogged, isNotLogged } = require("../lib/auth");



// Signin . registrarse
router.get("/signup", isNotLogged, (req, res) => {
  res.render("auth/signup.hbs");
});

router.post(
  "/signup",
  isNotLogged,
  passport.authenticate("local.signup", {
    successRedirect: "/profile",
    failureRedirect: "/signup",
    failureFlash: true,
  })
);

// Signup - inscribirse
router.get("/signin", isNotLogged, (req, res) => {
  res.render("auth/signin.hbs");
});

router.post("/signin", isNotLogged, (req, res, next) => {
  passport.authenticate("local.signin", {
    successRedirect: "/profile",
    failureRedirect: "/signin",
    failureFlash: true,
  })(req, res, next);
});



router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/signin");
});

//contact


module.exports = router;
