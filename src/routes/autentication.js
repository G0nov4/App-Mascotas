const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const passport = require("passport");

//

// Signup - inscribirse
router.get("/signin", (req, res) => {
  res.render("auth/signin.hbs");
});

router.post("/signin", (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
});



// Signin . registrarse
router.get("/signup", (req, res) => {
  res.render("auth/signup.hbs");
});

router.post("/signup", (req, res) => {
  const { username, email, password } = req.body;
  console.log(username, email, password);
  res.send("This is your profile ", username);
});


//perfil
router.get("/profile", (req, res) => {
  const { username, email, password } = req.body;
  console.log(username, email, password);
});

module.exports = router;
