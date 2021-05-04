const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars')
const path = require('path');
const flash = require('connect-flash'); 
const session = require('express-session');

const {database} = require('./keys');
const MySQLStore = require('express-mysql-session');



// variables

const port = process.env.PORT || 3005;

// Inicio de la express (Aplicacion)
const  app = express();


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
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());


// Global variables


// Routes - Rutas
app.use(require('./routes'));
app.use(require('./routes/autentication'));
app.use('/reported', require('./routes/pets_reported'));

//
app.use('/links', require('./routes/links'));
app.use('/Register',require('./routes/register_encontradas'));
app.use('/reported', require('./routes/pets_reported'));

// Public
app.use(express.static(path.join(__dirname, 'public')));


// Iniciando el servidor
app.listen(app.get('port'), ()=>{
    console.log('Server Connected on PORT:', app.get('port'));
});

