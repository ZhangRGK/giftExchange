
/**
 * Module dependencies.
 */

var express = require('express');
var wish = require('./routes/wish');
var login = require('./routes/login');
var person = require('./routes/person');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('MerryChristmas'));
app.use(express.session({"secret":"MerryChristmas"}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
//view
app.get("/", wish.view);
app.get("/login",login.view);
app.get("/register",login.register);
app.post("/checkPerson", person.checkPerson);
app.post("/checkPassCode", person.checkPassCode);
app.post("/addPerson",person.addPerson);
app.get("/wishes", wish.view);
app.get("/getPassCode",wish.getPassCode);
app.post("/wishes/achieve",wish.achieve);
app.post("/wishes/first",wish.addFirst);

http.createServer(app).listen(app.get('port'),'127.0.0.1', function(){
  console.log('Express server listening on port ' + app.get('port'));
});
