//contains the paths for the MVCs
const xp = require('express');
const bp = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = xp();
app.use(bp.urlencoded({extended: true}));
app.use(bp.json());

const SERVER_PORT = 3000

//setting up the path to access View from view folder
app.set('views', path.join(__dirname, 'views'));
app.set('viewEngine', 'ejs');

//defines the model
require('./model/userModel');
var MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://noyivasquez:NO8XUguFIa0ysOJm@cluster0.8dav7ml.mongodb.net/readIT?retryWrites=true&w=majority'
var DB_NAME = process.env.DB_NAME || 'readIT'


//defines connection to the database
mongoose.connect(`${MONGODB_URI}/${DB_NAME}`); 
/* {
    useNewUrlParser:true, 
    useUnifiedTopology:true}
    */
const db = mongoose.connection;
db.on('error', console.error.bind('Error connecting to the database.'));
db.once('open', function(){
    console.log('Successfully connected to the database.')
});

//sets up controller
const ctrl = require('./controller/userController');
const userModel = require('./model/userModel');

app.get('/', function(req, res){
    res.render('home.ejs');
});

app.get('/subscribe', function(req, res){
    res.render('subscribe.ejs');
});

app.post('/subscribe/add', ctrl.addUser);

app.get('/success', function(req, res){
    res.render('success.ejs');
});

app.get('/subscriber', function(req, res){
    res.render('search.ejs');
});

app.get('/subscriber/find', ctrl.findUser);

app.get('/unsubscribe', ctrl.unsubscribe);

app.post('/unsubscribe/confirm', ctrl.unsubscribeConfirm);

app.post('/subscriber/update', ctrl.updateInfo);

app.get('/magazines', function(req, res){
    res.render('magazines.ejs')
});

app.get('/contact', function(req, res){
    res.render('contact.ejs')
});

app.listen(process.env.PORT || SERVER_PORT);