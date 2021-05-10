const express = require('express');
const router = express.Router();
const { isLogged, isNotLogged } = require('../lib/auth')
const pool = require('../database');

router.get('/',isLogged, async (req, res)=> {
    const pets = await pool.query('SELECT * FROM pet WHERE status = "Encontrado"');
    //console.log(pets);
    res.render('links/list_encontrados', {pets});
});


// Router - Enrutador



module.exports = router;