const express = require('express');
const router = express.Router();

// database
const pool = require('../database')

router.get('/', (req, res)=> {
    res.render('links/register.hbs')
});



router.post('/', async (req, res) =>{
    const {
        name,
        lastname,
        email,
        phone,
        name_pet,
        specie,
        size,
        sex,
        age,
        date,
        observation
    } = req.body;

    const pet = {
        idPropietario: 1,
        Nombre:name_pet, 
        Especie: specie, 
        Tamanio:size, 
        Color: 'Back',
        Estado:0,
        Observacion:observation
    }
    const fullname = name+' '+lastname;
    const people = {
        fullname,
        email,
        fecha_created: date,
        facebook: 'Facebook',
        rol: 'user'    
    }
    console.log('Pet: ', pet, '/n', 'People: ', people);

    await pool.query('INSERT INTO user set ?',[people])

    await pool.query('INSERT INTO mascota set ?',[pet]);

    res.redirect('/');
});


module.exports = router;