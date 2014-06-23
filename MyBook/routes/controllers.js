var crypto = require('crypto');
var events = require('events');
var socketEmitterMediator = new events.EventEmitter();
var User = require('../models/user');
var Post = require('../models/post');
var Util = require('../lib/utilities.js');
var userSockets = [];

socketEmitterMediator.on('sendSocketResponse', function(usernames, post, reply, replier){
	
		var unique = {};
		var uniqueArray = [];
		var i;
		var socketMsg = {};
		socketMsg.username = usernames[0];
		socketMsg.post = post.comment;
		socketMsg.newReply = reply;
		socketMsg.replier = replier;
		socketMsg.poster = post.username;
		socketMsg.dateString =  Util.getDateFormat(post.date);
		
		for( i = 0; i < usernames.length; i++ ){
			unique[usernames[i]] = usernames[i];
		};
		for(var username in unique){
			
			if(userSockets[username] && username != replier ){
				userSockets[username].emit('new_reply', JSON.stringify(socketMsg) );
			}			
		} 
	}
);




exports.loginGET = function(req, res){
						if(res.locals.sess_attributes['lastPage'] && res.locals.sess_attributes['lastPage'] != '/index'){
							delete req.session.attributes['success'];
							delete req.session.attributes['warn'];
						}
						res.addAttribute('lastPage','/index');
						
						res.render('login', {
							title: 'User Login',
							user: res.locals.user,
							sess_attributes: res.locals.sess_attributes
						
						});
					};

exports.loginPOST =	function(req, res){

						var md5 = crypto.createHash('md5');
						var md5Password = md5.update(req.body['password']).digest('base64');
						
						User.findOne({ username: req.body['username'] }, function(err, user){
						      
							  if(err) return next(err);
							  
							  if(!user){
								  res.warn('This accout does not exist, please double check your account name again.');
								  
						    	  return res.redirect('/login'); 
							  }
							  
							  if(user.password != md5Password ){
								  res.warn('Password is not correct, please enter the right password.');
								  
								  return res.redirect('/login');
							  }
							  
							  req.session.user = user;
							  
							  res.success('You have successfully logged in.');
							  
							  res.redirect('/');
							  
							}
						);
						
					};
					
					
exports.indexGET = function(req, res){	
						


						
						Post.find( {},null, {sort: {date: -1 }}, function(err, posts){  
							
							if(err) posts = null;
							if(req.session.user){
								res.locals.user = req.session.user['username'];
							}
							
							posts.forEach(function(post){ 
								post.replyLength = post.replies.length;
								
								post.dateString =  Util.getDateFormat(post.date);
								
								
								if(post.replies.length > 2){								
									post.replies = post.replies.slice(-2);
								}
								post.replies.forEach( function(reply){
										reply.dateString = Util.getDateFormat(reply.date);
								});
							});

						
							res.render('index', {
										title: 'Home',
										user: res.locals.user,
										sess_attributes: res.locals.sess_attributes,
										posts: posts
									}
							);
								
						});
						
					};
					
exports.registrationGET = function(req, res){
							if(req.session.user){
								res.locals.user = req.session.user['username'];
							}
							if(res.locals.sess_attributes['lastPage'] && res.locals.sess_attributes['lastPage'] != '/reg'){
								delete req.session.attributes['success'];
								delete req.session.attributes['warn'];
							}
							res.addAttribute('lastPage','/reg');							
							res.render('reg', {
									title: 'User Registration',
									user: res.locals.user,
									sess_attributes: res.locals.sess_attributes
								}
							);
						  };

						  
exports.registrationPOST = function(req, res){								
									var md5 = crypto.createHash('md5');
									var md5Password = md5.update(req.body['password']).digest('base64');
								
									User.findOne({ username: req.body['username'] }, function(err, user){			      
										if(err) return next(err);										
										if(user){											  
											  //console.log("The user has been found.\n We will not create this new user account");
											  res.warn('The username exists, please use another username.');
											  
											  return res.redirect('/reg');
											  
										}else{
											  //console.log("The user cannot be found.\n We will create this new user account.");
											  var newUser = {
														username: req.body['username'],
														password: md5Password
												      };
											  
												User.create(newUser, function(err) {														    	  	
														    	  if (err) return next(err);														    	  	
														    	  req.session.user = newUser;
														    	  res.success('Registration Successful.');
														    	  
														    	  res.redirect('/');														    	  
														      });
												}
										});	
								};
								
								
exports.logoutGET = function(req, res){			
					req.session.user = null;
					res.success('You have successfully logged out.');
					res.addAttribute('lastPage','/login');
					res.redirect('/login');
				};
				
exports.postCommentPOST = function(req, res){
			
			if(!req.body['post']){
				res.warn('No comment input, please input your comment and then post.');
				return res.redirect('/');
			}
			
			var commentUser = req.session.user;
			//console.log('Comment User', commentUser);
			 var newPost = {
						username: commentUser.username,
						comment:  req.body['post'],
						date: new Date()
				 };
			
			Post.create(newPost, function(err, newPost){
				if(err){
					console.log(err);
					res.warn(err);
				
					return res.redirect('/');
				}
				
				res.success('Your message has been posted.');
				//console.log('New Post ID: ' + newPost._id)
				res.redirect('/');
			});
		};

exports.replyPOST = function(req,res){

	//console.log( "postID", req.body['postID'] );
	//console.log( "message", req.body['message'] );
	//console.log( "username", req.session.user['username'] );
	
	var dt = new Date();
	Post.update({_id: req.body['postID'] },
				{$push: { replies :  {             
					username: req.session.user['username'],  
					message:  req.body['message'],
					date: dt
				}}}, {upsert:false}, 
				function(err){
					
					if(err){
						console.log(err);
						res.warn(err);  //
						return res.json(500, { error: 'An error occurs, Our system cannot add your reply at this moment.' });
					}
					Post.findOne( { _id: req.body['postID'] },
	         				       // {replies:{$slice:-2}},
							      function(err, post){
							    	 if(err){
										console.log(err);
										res.warn(err);  //
										return res.json(500, { error: 'An error occurs, Our system cannot provide the replies to you at this moment.' });
									 }
							    	 
									 var usernames = [];
									 usernames.push( post.username );
									 
									 
						    	 	 post.replies.forEach( function(reply){
						    	 		usernames.push( reply.username );
										reply.dateString = Util.getDateFormat(reply.date);
									 });
							    	 post.replyLength = post.replies.length;
							    	 
							    	 if(post.replies.length > 2){								
								    	post.replies = post.replies.slice(-2);
								     }								    	 
							    	 //console.log("post.username", post.username)
							    	 res.success('Your reply has been posted.');
							    	 res.json(200, { postID: post._id, postUsername: post.username , newReplies : post.replies, replyLength: post.replyLength,
							    	                 alertInfo: res.locals.sess_attributes['success']});
							    	 
							    	 setTimeout( function(){ socketEmitterMediator.emit('sendSocketResponse', usernames, post, req.body['message'], req.session.user['username']) }, 500 );

							      }
							  );
				});
};


exports.repliesPOST = function(req, res){
					   //console.log("at repliesGET postID: " + req.body['postID'] );
					   Post.findOne( { _id: req.body['postID'] },function(err, post){
							
							if(err) return res.json(500, { error: 'An error occurs, Our system cannot provide the replies to you at this moment.' });
							if(req.session.user){
								res.locals.user = req.session.user['username'];
							}							

							post.replyLength = post.replies.length;								
							post.dateString =  Util.getDateFormat(post.date);
							post.replies.forEach( function(reply){
										reply.dateString = Util.getDateFormat(reply.date);
							});
							res.json(200, { postID: post._id, postUsername: post.username , newReplies : post.replies, replyLength: post.replyLength });							
						});
};

		
exports.userGET = function(req, res){
			
			Post.find({ username: req.params.user }, function(err, posts){
				 //console.log('Username Parameter' + req.params.user);
				  if(err) return next(err);
				  
				  if(!posts){
					res.warn('The comments by ' + req.params.user + ' have been removed.');
					return redirect('/');
				  }
				  
				  if(req.session.user){
					  res.locals.user = req.session.user['username'];
				  }

				  res.render('user', {
						title: req.body['username'],
						user: res.locals.user,
						sess_attributes: res.locals.sess_attributes,
						
						posts: posts
					}
				);
				  	
			});
				
		};


exports.addUserSocket = function(username, socket){
	userSockets[username] = socket;
};

exports.deleteUserSocket = function(username){
	delete userSockets[username];
	console.log(username + ' has been deleted from socket array')
};