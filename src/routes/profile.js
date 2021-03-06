const express = require("express");
const router = express.Router();
const { isLogged, isNotLogged } = require("../lib/auth");
const pool = require("../database");
const cloudinary = require("cloudinary");
const fs = require("fs-extra");
const tinify = require("tinify");

// Tinify
tinify.key = process.env.TINIFY_KEY;

// Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//profile - perfil
router.get("/", isLogged, async (req, res) => {
  console.log(req.user);
  if (req.user.type === "administrator") {
    const users = await pool.query("SELECT * FROM user WHERE type like 'user'");
    res.render("./profile-admin.hbs",{users});
  } else {
    const pets = await pool.query(
      "select p.idpet, p.name,p.sex, p.specie, p.status, max(i.dir_image)url from pet p, image_pet i where p.idpet = i.idpet and p.iduser = ? group by p.idpet",[req.user.iduser]
    );
    res.render("./profile.hbs", { pets });
  }
});

router.get("/reported", isLogged, (req, res) => {
  res.render("links/register/reported.hbs");
});

router.get("/lost", isLogged, (req, res) => {
  res.render("links/register/lost.hbs");
});

router.get("/found", isLogged, (req, res) => {
  res.render("links/register/found.hbs");
});

router.get("/delete/:id", isLogged, async (req, res) => {
  const { id } = req.params;
  const deletePet = await pool.query(
    "SELECT * FROM image_pet WHERE idpet = ?",
    [id]
  );
  await pool.query("DELETE FROM image_pet WHERE idpet = ?", [id]);
  const result = await cloudinary.v2.uploader
    .destroy(deletePet[0].public_id)
    .catch((err) => {
      res.send("<h2>Error al eliminar imagen/h2>");
    });
  res.redirect("/profile");
});

router.get("/edit/:id", isLogged, async (req, res) => {
  const { id } = req.params;
  
  const pet = await pool.query("SELECT * FROM  pet WHERE idpet = ?", [id]);
  res.render("links/edit/edit.hbs", { pet: pet[0] , id});
});

router.post("/edit/:id", isLogged, async (req, res) => {
  const { id } = req.params;
  const { name_pet, specie, size, sex, date, color, direction, observation } =
  req.body
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
  datePet: new Date(date).toLocaleDateString(),
};
console.log(newPet, id)
await pool.query('UPDATE pet set ? WHERE idpet = ?',[newPet, id])
  res.redirect("/profile");
});

router.post("/lost", isLogged, async (req, res) => {
  const { name_pet, specie, size, sex, date, color, direction, observation , latitud, longitud} =
    req.body;
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
    datePet: new Date(date).toLocaleDateString(),
    latitud,
    longitud
  };
  const result = await pool.query("Insert into pet set ?", [newPet]);

  const idPet = result.insertId;
  for (const file of files) {
    const { path } = file;

    // Compress file
    const source = await tinify.fromFile(file.path);
    const copyrighted = await source.preserve("copyright", "creation");

    const newPathImage = await copyrighted._url.then((data) => data);

    const newPath = await cloudinary.v2.uploader
      .upload(newPathImage)
      .catch((err) => {
        console.error(err);
      })
      .then(console.log("Se subio la imagen :v"));
      console.log(newPath, path)
    const newImage = {
      idpet: idPet,
      dir_image: newPath.url,
      public_id: newPath.public_id,
    };
    await fs.unlink(path);
    await pool.query("Insert into image_pet set ?", [newImage]);
    
  }
  res.redirect("/profile");
});

router.post("/reported", isLogged, async (req, res) => {
  const { specie, size, sex, date, color, direction, observation, latitud, longitud } = req.body;
  const files = req.files;
  const newPet = {
    iduser: req.user.iduser,
    name: "S/n",
    specie,
    size,
    sex,
    color,
    observation,
    status: "reported",
    direction,
    datePet: new Date(date).toLocaleDateString(),
    latitud,
    longitud
  };
  const result = await pool.query("Insert into pet set ?", [newPet]);

  const idPet = result.insertId;
  for (const file of files) {
    const { path } = file;

    const source = await tinify.fromFile(file.path);
    const copyrighted = await source.preserve("copyright", "creation");

    const newPathImage = await copyrighted._url.then((data) => data);

    const newPath = await cloudinary.v2.uploader
      .upload(newPathImage)
      .catch((err) => {
        console.error(err);
      });
    const newImage = {
      idpet: idPet,
      dir_image: newPath.url,
      public_id: newPath.public_id,
    };

    await pool.query("Insert into image_pet set ?", [newImage]);

    // elimina la imagen temporal
    await fs.unlink(path);
  }
  res.redirect("/profile");
});

module.exports = router;
