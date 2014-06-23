# MyBook Private Social Web Application
  This is my practice project of Node.js technologies.  The application includes the following functions:
  
  * Real-Time Socket Notification Service
  * Hand Shack Socket Security
  * Post Message
  * Reply to Post Message
  * User Registration Service and User Login
  * Web Security Filter
  * Use of Jade templates in View Layer
  * Use of Bootstrap CSS Library
  * Use of Session Attributes
  * Use of Mongoose for MongoDB Persistence
  * Use of Routers in Express Web Framework
  * Use of Express Logger

## About Real-Time Socket Notification Service Function:
  * Making Socket.IO Server with Express
  
  ```js
  var express = require('express');
  ...
  var app = express();
  ...
  server = app.listen(app.get('port'));
  io = require('socket.io')(server);
  console.log("Express server listening on port 3000");
  ```
  
  * Using the Listener of "authorization" event for Socket Security
  
  ```js
  io.set('authorization', function (handshake, accept) {
	  cookieParser(handshake, {}, function(err) {
	    if (err) {
	      accept(err, false);
	    } else {
	     .....
	     .....
	     }
	   });
	 });
  ```
  
  * About Socket Message:
 
      When a socket is connected, the server will add a socket to a socket array.
      socketEmitterMediator object (an Event Emitter object) will manage the task of
      sending socket messages by using socket array.
      And any new reply to a post will be handled by the controller of repliesPOST.
      The controller will use socketEmitterMediator to send new message to other 
      relevant "Online" users, who had replied or post to the same post thread
      , but not the sender of new reply.
 
  ```js
  setTimeout( 
    function(){ 
      socketEmitterMediator.emit('sendSocketResponse', 
                                  usernames, 
                                  post, 
                                  req.body['message'], 
                                  req.session.user['username']) 
  }, 500 );
  ```
## To run this application

First, start up MongoDB

And move to the project directory, and 
```sh
$ npm install
```
And
```sh
$ node app.js
```

On your web browser, navigate to: hostname:3000

## Libraries Used
  * Express 3
  * Connect
  * Socket.IO
  * Jade template
  * Mongoose
  * Bootstrap

## Database
  * MongoDB 

## Reference
  * Node.js in Action
  * Google 御用網頁語言 Node.js 第二版
