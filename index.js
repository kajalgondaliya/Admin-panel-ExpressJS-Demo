const express = require('express');
var expressBusboy = require('express-busboy');
const app = express();
const db = require('./models');
var  fs = require ( 'fs' );
const cookieParser = require('cookie-parser');
const path = require('path');
const expressLayout = require('express-ejs-layouts');
const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 4001;

//WEB AUTH MIDDLEWARES
const auth = require('./middlewares/auth');
const guest = require('./middlewares/guest');

//USE MIDDLEWARE
expressBusboy.extend(app,{
    upload:true
});

//SYNCING DB
db.sequelize.sync().then(()=>{
    console.log("All Model Syncing!");
}).catch((err)=>{
    console.log(err);
});

//WEB ROUTES
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const profileRoutes = require('./routes/profile');
// const usersRoutes = require('./routes/users');


//USE EXPRESS MIDDLEWARES
app.use(cookieParser());
app.set('view engine','ejs');
app.use(expressLayout);
app.set('layout',__dirname+"/views/layout");
app.set('views',__dirname+"/views/admin");

app.use(express.static(path.join(__dirname,"public")));
app.use('/storage/images/', express.static(process.cwd() + '/storage/images/'))

//USE ADMIN PANEL MIDDLEWARES
app.use('/',authRoutes);
app.use('/admin',auth,dashboardRoutes);
app.use('/admin',auth,profileRoutes);

//Set different layout for login and not default
app.set("layout login", false);

//Call login page
app.get('/',guest,(req,res)=>{
    res.render('login',{layout:'login'});
});

//Starting server
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}` );
});