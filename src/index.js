const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars')
const path = require('path');
const flash = require('connect-flash'); 
const session = require('express-session');

const {database} = require('./keys');
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

// Global variables
app.use((req, res, next) =>{
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});

// Routes - Rutas
app.use(require('./routes'));
app.use(require('./routes/autentication'));

//--------agregar
app.use('/links', require('./routes/links'));
app.use('/Register',require('./routes/register_encontradas'));
app.use('/reported', require('./routes/pets_reported'));
//---------vistas
app.use('/list_perdidos', require('./routes/list_perdidos'));
app.use('/list_reportados', require('./routes/list_reportados'));
app.use('/list_encontrados', require('./routes/list_encontrados'));

// Public
app.use(express.static(path.join(__dirname, 'public')));


// Iniciando el servidor
app.listen(app.get('port'), ()=>{
    console.log('Server Connected on PORT:', app.get('port'));
});

