const express = require("express");
const router = express.Router();
const passport = require("passport");
const { isLogged, isNotLogged } = require("../lib/auth");

const pool = require("../database");
const cloudinary = require("cloudinary");
const fs = require("fs-extra");

// Cloudinary
cloudinary.config({
  cloud_name: "dchkhw7or",
  api_key: 799394818649236,
  api_secret: "YCBcHm_c70foHewvSPPzh6eOnQQ",
});

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

//profile - perfil
router.get("/profile", isLogged, async (req, res) => {
  const pets = await pool.query(
    "select p.idpet, p.name,p.sex, p.specie, p.status, max(i.dir_image)url from pet p, image_pet i where p.idpet = i.idpet and p.iduser = ? group by p.idpet",
    [req.user.iduser]
  );
  console.log(pets);
  res.render("./profile.hbs", { pets });
});

router.get("/profile/reported", isLogged, (req, res) => {
  res.render("links/register/reported.hbs");
});

router.get("/profile/public", isLogged, (req, res) => {
  res.render("links/register/public.hbs");
});

router.get("/profile/found", isLogged, (req, res) => {
  res.render("links/register/found.hbs");
});

router.post("/profile/reported", isLogged, async (req, res) => {
  const {
    name_pet,
    specie,
    size,
    sex,
    date,
    color,
    direction,
    observation,
  } = req.body;
  const files = req.files;
  const newPet = {
    iduser: req.user.iduser,
    name: name_pet,
    specie,
    size,
    sex,
    color,
    observation,
    status: "reported",
    direction,
    datePet: date,
    map: "ttt",
  };
  const result = await pool.query("Insert into pet set ?", [newPet]);

  const idPet = result.insertId;
  for (const file of files) {
    const { path } = file;

    const newPath = await cloudinary.v2.uploader.upload(path).catch((err) => {
      console.error(err);
    });
    const newImage = {
      idpet: idPet,
      dir_image: newPath.url,
    };
    await pool.query("Insert into image_pet set ?", [newImage]);
    await fs.unlink(path);
  }
  res.redirect("/profile");
});

router.post("/profile/public", isLogged, async (req, res) => {
  const {
    name_pet,
    specie,
    size,
    sex,
    date,
    color,
    direction,
    observation,
  } = req.body;
  const files = req.files;
  const newPet = {
    iduser: req.user.iduser,
    name: name_pet,
    specie,
    size,
    sex,
    color,
    observation,
    status: "reported",
    direction,
    datePet: date,
    map: "ttt",
  };
  const result = await pool.query("Insert into pet set ?", [newPet]);

  const idPet = result.insertId;
  for (const file of files) {
    const { path } = file;

    const newPath = await cloudinary.v2.uploader.upload(path).catch((err) => {
      console.error(err);
    });
    const newImage = {
      idpet: idPet,
      dir_image: newPath.url,
    };
    await pool.query("Insert into image_pet set ?", [newImage]);
  }
  res.redirect("/profile");
});

router.post("/profile/found", isLogged, async (req, res) => {
  const {
    name_pet,
    specie,
    size,
    sex,
    date,
    color,
    direction,
    observation,
  } = req.body;
  const files = req.files;
  const newPet = {
    iduser: req.user.iduser,
    name: name_pet,
    specie,
    size,
    sex,
    color,
    observation,
    status: "reported",
    direction,
    datePet: date,
    map: "ttt",
  };
  const result = await pool.query("Insert into pet set ?", [newPet]);

  const idPet = result.insertId;
  for (const file of files) {
    const { path } = file;

    const newPath = await cloudinary.v2.uploader.upload(path).catch((err) => {
      console.error(err);
    });
    const newImage = {
      idpet: idPet,
      dir_image: newPath.url,
    };
    await pool.query("Insert into image_pet set ?", [newImage]);
  }
  res.redirect("/profile");
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/signin");
});

//contact


module.exports = router;
