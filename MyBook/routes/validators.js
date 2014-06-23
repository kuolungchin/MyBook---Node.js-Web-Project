var User = require('../models/user');

exports.validatePassword = function(length){	
								return function( req, res, next){
									if(!req.body['password']){
										res.warn('Please enter your password.');
										return res.redirect('/reg');
									}								
									if(req.body['password'] != req.body['password-repeat']){
										res.warn('Your two password inputs are not consistent.');
										return res.redirect('/reg');

									}
									if(req.body['password'].length < length){
										res.warn('Your password is too short, and it should be more than 5 characters.');
										return res.redirect('/reg');
									}
									if(req.body['password'].length ==  req.body['username']){
										res.warn('Your password should not be the same as your username.');
										return res.redirect('/reg');
									}

									res.success('Password Validation Passed');
									next();								
								};
						};
