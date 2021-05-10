const express = require('express');
const { query } = require('../database');
const router = express.Router();

const pool = require('../database');
const cloudinary = require('cloudinary');
const fs = require('fs-extra');

// Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

router.get('/', (req, res)=> {

    res.render('links/reported.hbs');
});


router.post('/', async (req, res)=> {
    const { name_pet, specie, size, sex, date, color, direction, observation} = req.body;
    const {image1,image2,image3,image4,image5 } = req.body;
    const result = await cloudinary.v2.uploader.upload(req.file.path);
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
  
  // console.log(result.url);
    res.send('Aqui irá las mascotas perdidas...');
    
});


module.exports = router;