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
    const pet = await pool.query('SELECT dir_image FROM image_pet WHERE idpet = ?',[req.params.id]);
    console.log(pet)
    res.render('links/list/pet', {pet});
});

router.get('/contact', (req, res)=>{
    res.render('contact.hbs')
})


module.exports = router;