const express = require('express');
const router = express.Router();

const pool = require('../database');

router.get('/', async (req, res)=> {
    res.send('Aqui irá las mascotas perdidas...')
});


// Router - Enrutador



module.exports = router;