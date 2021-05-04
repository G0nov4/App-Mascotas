const express = require("express");
const router = express.Router();
const passport = require("passport");
const { isLogged, isNotLogged } = require('../lib/auth')


const pool = require('../database')

// Signin . registrarse
router.get("/signup", isNotLogged ,(req, res) => {
    res.render("auth/signup.hbs");
  });
  
router.post("/signup", isNotLogged, passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));

  
// Signup - inscribirse
router.get("/signin",isNotLogged, (req, res) => {
  res.render("auth/signin.hbs");
 });

router.post("/signin", isNotLogged, (req, res, next)=>{
  passport.authenticate('local.signin',{
      successRedirect: '/profile',
      failureRedirect: '/signin',
      failureFlash: true
  })(req,res, next);
});



//profile - perfil
router.get('/profile',isLogged, (req, res) => {
  res.render('./profile.hbs');
});

router.get('/profile/reported',isLogged, (req, res) => {
  res.render('links/reported.hbs');
});

router.get('/profile/public',isLogged, (req, res) => {
  res.render('links/public.hbs');
});

router.get('/profile/Encontrado',isLogged, (req, res) => {
  res.render('links/Encontrado.hbs');
});



router.post('/profile/reported', isLogged, async (req, res)=> {

  const { name_pet, specie, size, sex,  age, date, color, direction, observation} = req.body;
  const statuss = 'reported';
  const mapp = 'maaap1';
  const newPet = {
      iduser : 1,
      name:name_pet, 
      specie, 
      size, 
      sex, 
      color, 
      observation,
      status: 'reported',
      direction,
      datePet:date,
      map: 'ttt' 
  };
  await pool.query('Insert into pet set ?', [newPet]);
 console.log(newPet) 
  res.send('Aqui irá las mascotas perdidas...');
}
);

router.get('/logout', (req, res)=>{
  req.logout();
  res.redirect('/signin');
});

module.exports = router;
