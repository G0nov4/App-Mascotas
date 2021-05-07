const express = require('express');
const router = express.Router();

const pool = require('../database');

router.get('/', async (req, res)=> {
    const pets = await pool.query('SELECT * FROM pet WHERE status = "reported"');
    //console.log(pets);
    res.render('links/list_reportados', {pets});
});


// Router - Enrutador



module.exports = router;