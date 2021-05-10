const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary');
const fs = require('fs-extra');

router.get('/', (req, res)=>{
    res.render('main.hbs')
})
module.exports = router;