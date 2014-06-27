
var express = require('express');
var routes = require('./routes');
var error = require('./routes/errorHandle');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var MongoStore = require('connect-mongo')(express);
var mongooseDB = require('./models/db');
var settings = require('./settings');
var session_attributes = require('./lib/sessionMap');
var flash = require('connect-flash');
var fs = require('fs');
var requestLogFile = fs.createWriteStream('request.log', {flags:'a'});
var cookieParser = express.cookieParser(settings.cookieSecret);
var sessionStore = new MongoStore(
	  {
	    db: mongooseDB.connection.db
	  });

var app = express();
var parseSignedCookie = require('connect').utils.parseSignedCookie;
var server;
var io;
var socketMgr = require('./routes/controllers').addUserSocket;
var deleteSocket = require('./routes/controllers').deleteUserSocket;
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('view options', {layout: false});
app.use(express.favicon());
app.use(express.logger({stream: requestLogFile }));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.bodyParser());  // New 
app.use(express.methodOverride());
app.use(cookieParser);
app.use(express.session({
    secret: settings.cookieSecret,
    store: sessionStore 
}));
app.use(session_attributes);
app.use(flash());
app.use(app.router);

app.use(express.static(path.join(__dirname, 'public')));
app.use(error.notfound);
app.use(error.errorAction);

  // development only
if ('development' == app.get('env')) {
  console.log('Now it is using development environment');
  app.use(express.errorHandler());
}

routes(app);

server = app.listen(app.get('port'));
io = require('socket.io')(server);
console.log("Express server listening on port:" + app.get('port'));

setTimeout(  function(){
io.set('authorization', function (handshake, accept) {
	  cookieParser(handshake, {}, function(err) {
	    if (err) {
	      accept(err, false);
	    } else {
	       
	      if(!sessionStore){
	     	 console.log('Session Store is not ready yet.');
	      }
	      
	      sessionStore.get(handshake.signedCookies['connect.sid'], function(err, session) {
	       
	 	  if (err || session.user == null || typeof session.user === "undefined" ){ 
	         console.log('Session user not found or Error!');
	         accept('Session error', false);
	       } else {
	         console.log('Authorization: Session Found');
	         handshake.session = session;
	         accept(null, true);
	       }
	      });
	     }
	   });
	 });


	 io.on('connection', function (socket) {
	   
	 

	   var handshake = socket.handshake;
	   
	   
	   cookieParser(handshake, {}, function(err) {
	    if (err) {
	      return;
	    } else {
	       
	      if(!sessionStore){
	     	 console.log('Session Store is not ready yet.');
	      }
	      
	      sessionStore.get(handshake.signedCookies['connect.sid'], function(err, session) {
	       
	 	  if (err || session.user == null || typeof session.user === "undefined" ){ 
	         console.log('Session user not found or Error!');
	         return;
	       } else {
	         console.log('Session Found');
	         handshake.session = session;
	         
	         socketMgr(session.user['username'], socket);
	         
	         socket.on('client_received', function (data) {
				console.log(data);
			 });
	         
			
	        socket.on('disconnect', function () {
	        	console.log(session.user['username'] +  ' is disconnected');
	        	deleteSocket(session.user['username'])
			});
	       }
	      });
	     }
	   });
	   
	 });
}, 1000);
