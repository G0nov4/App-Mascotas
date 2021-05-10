const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isLogged, isNotLogged } = require('../lib/auth')

router.get('/',isLogged, async (req, res)=> {
    const pets = await pool.query('SELECT * FROM pet WHERE status = "Perdido"');
    //console.log(pets);
    res.render('links/list_perdidos', {pets});
});


// Router - Enrutador



module.exports = router;