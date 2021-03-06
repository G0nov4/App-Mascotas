require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const multer = require('multer');
const exphbs = require('express-handlebars')
const path = require('path');
const flash = require('connect-flash'); 
const session = require('express-session');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const { database } = require('./keys');
const MySQLStore = require('express-mysql-session');
const passport = require('passport');



// variables

const port = process.env.PORT || 3005;

// Inicio de la express (Aplicacion)
const  app = express();
require('./lib/passport')


// Configuraciones
app.set('port', port);
app.set('views', path.join(__dirname,'views'));

app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'),'layout'),
    partialsDir: path.join(app.get('views'),'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars.js')
}));


app.set('view engine', '.hbs');


// Middlewares (Aplicaciones externas)

app.use(session({
    secret: 'pet_secret',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));

app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

const storage = multer.diskStorage({
    destination:path.join(__dirname, 'public/uploads'),
    filename: (req, file, cb)=>{
        cb(null, new Date().getTime() + path.extname(file.originalname));
    }
});
app.use(multer({storage}).array('image'));



// Global variables
app.use((req, res, next) =>{
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    if(req.user != undefined){
        (req.user.type ==='administrator')?
        app.locals.administrator = req.user:
        app.locals.user = req.user
    }else{
        app.locals.administrator = req.user
        app.locals.user = req.user
    }

    next();
});

// Routes - Rutas
app.use(require('./routes'));
app.use(require('./routes/autentication'));

//--------agregar
app.use('/', require('./routes/links'));
app.use('/profile', require('./routes/profile'));

// Public
app.use(express.static(path.join(__dirname, 'public')));


// Iniciando el servidor
app.listen(app.get('port'), ()=>{
    console.log('Server Connected on PORT:', app.get('port'));
});

