const express = require('express');
const pool = require('../database');
const router = express.Router();

const consultQuery = (state) => "select p.color, p.idpet,p.observation,  p.name,p.datepet, p.specie, p.status, max(i.dir_image)url from pet p, image_pet i where p.idpet = i.idpet and p.status = "+state+" group by p.idpet";

router.get('/listpets', async (req, res)=>{
    const allPetsLost = await pool.query(consultQuery("'lost'"));
    const allPetsReport = await pool.query(consultQuery("'report'"));
    console.log(allPetsLost, allPetsReport)
    res.render('links/list/pets.hbs',{lost: allPetsLost, report: allPetsReport});
})


router.get('/delete/:iduser', async( req, res)=>{

    let { iduser } = req.params;
    iduser = parseInt(iduser,10);
    console.log(typeof(iduser))
    await pool.query('DELETE im.* FROM image_pet im, pet p WHERE p.iduser = ?',[iduser])
    await pool.query('DELETE  FROM pet WHERE iduser = ?',[iduser])
    await pool.query('DELETE FROM user WHERE iduser = ?',[iduser])

    res.redirect('/profile')
});

module.exports = router;