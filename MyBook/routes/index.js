var controller = require('./controllers');
var validator = require('./validators');



module.exports = function(app){
	
	app.get('/login', checkNotLogin);
	app.get('/login', controller.loginGET);
	
	app.post('/login', checkNotLogin);
	app.post('/login', controller.loginPOST);
		
	
	app.get('/', checkLogin);
	app.get('/', controller.indexGET);
	
	app.get('/reg', checkNotLogin);
	app.get('/reg', controller.registrationGET	);
	
	app.post('/reg', checkNotLogin);
	app.post('/reg', validator.validatePassword(6), controller.registrationPOST);
	
	
	app.get('/logout', checkLogin);
	app.get('/logout', controller.logoutGET);
		
		
	app.post('/post', checkLogin);
	app.post('/post', controller.postCommentPOST);
			
	app.get('/u/:user', checkLogin);
	app.get('/u/:user', controller.userGET);
	
	app.post('/reply', checkLogin);
	app.post('/reply', controller.replyPOST);
	
	app.post('/replies', checkLogin);
	app.post('/replies', controller.repliesPOST);
		
	/* The route, /dev/error, is used to test the error log. 
	 
			app.get('/dev/error', function(req, res, next){
				var err = new Error('database connection failed');
				err.type = 'database';
				next(err);
			});
	*/
	function checkLogin(req, res, next){			 
		if(!req.session.user){				 
		  req.flash('error','The user have not logged in, please login.');
		  return res.redirect('/login');				 
		}		
		next();
	};
	
	
	function checkNotLogin(req, res, next){			 
		 if(req.session.user){				 
			 req.flash('error','The user has already logged in.');
			 return res.redirect('/');			 
		 }	
		 next();			 
	};

};