const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isLogged, isNotLogged } = require('../lib/auth')

const consultQuery = (state) => "select p.idpet,p.observation,  p.name,p.datepet, p.specie, p.status, max(i.dir_image)url from pet p, image_pet i where p.idpet = i.idpet and p.status = "+state+" group by p.idpet";

router.get('/', (req, res)=>{
    res.render('main.hbs')
})

router.get('/list/report',async (req, res)=>{
    const pets = await pool.query(consultQuery("'reported'"));
    
    res.render('links/list/reported', {pets});
});

router.get('/list/lost',async (req, res)=>{
    const pets = await pool.query(consultQuery("'lost'"));
    res.render('links/list/lost', {pets});
});

router.get('/list/found',async (req, res)=>{
    const pets = await pool.query(consultQuery("'found'"));
    res.render('links/list/found', {pets});
});

router.get('/list/:id', async (req, res)=>{
    const images = await pool.query('SELECT dir_image FROM image_pet WHERE idpet = ?',[req.params.id]);
   
    const pet = await pool.query('SELECT u.name, u.email, p.name pet_name,p.specie, p.size, p.datepet,p.sex,p.map, p.observation FROM user u, pet p WHERE p.iduser = u.iduser and p.idpet = ?',[req.params.id]);
   
    const d = new Date(pet[0].datepet);
    pet[0].datepet = d.toLocaleDateString();
    res.render('links/list/pet', {images, pet: pet[0]});
});


module.exports = router;