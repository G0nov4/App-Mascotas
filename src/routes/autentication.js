const express = require("express");
const router = express.Router();
const passport = require("passport");
const { isLogged, isNotLogged } = require("../lib/auth");
const pool = require("../database");
const cloudinary = require("cloudinary");
const fs = require("fs-extra");
const tinify = require('tinify');

// Tinify
tinify.key = "wXlgtF85jgcBKBjvskhHrg6yK7qtJM2F";

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
  res.render("./profile.hbs", { pets });
});

router.get("/profile/reported", isLogged, (req, res) => {
  res.render("links/register/reported.hbs");
});

router.get("/profile/lost", isLogged, (req, res) => {
  res.render("links/register/lost.hbs");
});

router.get("/profile/found", isLogged, (req, res) => {
  res.render("links/register/found.hbs");
});

router.get('/profile/delete/:id', isLogged, async (req, res)=>{
  const { id } = req.params;
  const deletePet =await  pool.query('SELECT * FROM image_pet WHERE idpet = ?',[id]);
  await  pool.query('DELETE FROM image_pet WHERE idpet = ?',[id]);
  const result = await cloudinary.v2.uploader.destroy(deletePet[0].public_id).catch(err =>{
    res.send('<h2>Error al eliminar imagen/h2>')
  });
  res.redirect('/profile');
});
 
router.get('/profile/edit/:id', isLogged, async (req, res)=>{
  const { id } = req.params;
  const images = await pool.query('SELECT dir_image FROM image_pet WHERE idpet = ?',[id]);
  const pet = await pool.query('SELECT * FROM  pet WHERE idpet = ?',[id]);
  console.log(pet[0])

  res.render('links/edit/edit.hbs', {images, pet: pet[0]});
});

router.delete('/profile/edit/:id', isLogged, async (req, res)=>{
 res.send("holi")
})

router.post('/profile/edit/:id', isLogged, async (req, res)=>{
  const { id } = req.params;
  const Pet = await  pool.query('SELECT * FROM image_pet WHERE idpet = ?',[id]);
  const result = await cloudinary.v2.uploader.destroy(deletePet[0].public_id).catch(err =>{
    res.send('<h2>Error al eliminar imagen/h2>')
  });
  res.redirect('/profile');
})

router.post("/profile/lost", isLogged, async (req, res) => {
  const {
    name_pet,
    specie,
    size,
    sex,
    date,
    color,
    direction,
    observation,
    latitud,
    longitud
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
    status: "lost",
    direction,
    datePet: (new Date(date)).toLocaleDateString(),
    latitud,
    longitud
  };
  const result = await pool.query("Insert into pet set ?", [newPet]);

  const idPet = result.insertId;
  for (const file of files) {
    const { path } = file;
    console.log(path);
    console.log("Antes: ",file)
    // Compress file 
    const source = await tinify.fromFile(file.path);
    const copyrighted = await source.preserve("copyright", "creation");
    console.log("New path for cloudinary")
    const newPathImage = await copyrighted._url.then(data => data)

    console.log("Despues:", newPathImage);
    const newPath = await cloudinary.v2.uploader.upload(newPathImage).catch((err) => {
      console.error(err);
    }).then(
      console.log("Se subio la imagen :v")
    );
    const newImage = {
      idpet: idPet,
      dir_image: newPath.url,
      public_id: newPath.public_id
    };
    await pool.query("Insert into image_pet set ?", [newImage]);
    await fs.unlink(path);
  }
  res.redirect("/profile");
});

router.post("/profile/reported", isLogged, async (req, res) => {
  const {
    specie,
    size,
    sex,
    date,
    color,
    direction,
    observation,
    latitud,
    longitud
  } = req.body;
  const files = req.files;
  const newPet = {
    iduser: req.user.iduser,
    name: 'S/n',
    specie,
    size,
    sex,
    color,
    observation,
    status: "reported",
    direction,
    datePet: (new Date(date)).toLocaleDateString(),
    latitud,
    longitud
  };
  const result = await pool.query("Insert into pet set ?", [newPet]);

  const idPet = result.insertId;
  for (const file of files) {
    const { path } = file;
  
    console.log("Antes: ",file)
    // Compress file 
    const source = await tinify.fromFile(file.path);
    const copyrighted = await source.preserve("copyright", "creation");
    console.log("New path for cloudinary")
    const newPathImage = await copyrighted._url.then(data => data)

    console.log("Despues:", newPathImage);

    const newPath = await cloudinary.v2.uploader.upload(newPathImage).catch((err) => {
      console.error(err);
    });
    const newImage = {
      idpet: idPet,
      dir_image: newPath.url,
      public_id: newPath.public_id
    };
    
    await pool.query("Insert into image_pet set ?", [newImage]);

    // elimina la imagen temporal
    await fs.unlink(path);
  }
  res.redirect("/profile");
});


router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/signin");
});

//contact


module.exports = router;
