const express = require('express');
const { query } = require('../database');
const router = express.Router();

const pool = require('../database');


router.get('/', (req, res)=> {

    res.render('links/reported.hbs');
});


router.post('/', async (req, res)=> {
    console.log(req.body);
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
    
});


module.exports = router;