const passport = require('passport');
const Localstrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('./helpers');




passport.use('local.signup', new Localstrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done)=>{
    const { name, lastname, phone } = req.body;
    const newUser = {
        name,
        lastname,
        phone,
        email,
        password,
        date_created: new Date().toLocaleString(),
        type:'user'
    };

    newUser.password = await helpers.encryptPassword(password);
    const result = await pool.query('INSERT INTO user SET ?',[newUser])
    newUser.iduser = result.insertId;
    return done(null, newUser);
}));


passport.use('local.signin', new Localstrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, email, password, done)=>{
    const rows = await pool.query('SELECT * FROM user WHERE email = ?',[email]);
    if(rows.length > 0){
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        if(validPassword){
            administrator = rows[0];
            user.type === 'user'?
            done(null, user, 'Bienvenido'):
            done(null, administrator, 'Bienvenido')
        }else{
            done(null, false, req.flash('message', 'Incorrect password'))
        }
    }else{
        return done(null, false, req.flash('message', 'El correo no existe'))
    }
}));

passport.serializeUser((user, done)=>{
    console.log(user);
    done(null, user.iduser);
});

passport.deserializeUser(async (id, done)=>{
    const rows = await pool.query('SELECT * FROM user WHERE iduser = ?',[id]);
    done(null, rows[0]);
});
