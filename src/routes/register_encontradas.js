const express = require('express');
const router = express.Router();

// database
const pool = require('../database')

router.get('/', (req, res)=> {
    res.render('links/register.hbs')
});




module.exports = router;