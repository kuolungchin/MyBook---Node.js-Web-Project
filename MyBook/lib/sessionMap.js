var express = require('express');
var res = express.response;

res.attribute = function(key, val){
	
	var sess = this.req.session;
	sess.attributes = sess.attributes || {};
    var mapKey = key || 'info';
    sess.attributes[mapKey] = val;
    if( mapKey == 'warn'){
    	delete sess.attributes['success'];
    }
    if( mapKey == 'success'){
    	delete sess.attributes['warn'];
    }
};

res.warn = function(val){
	return this.attribute('warn', val);
};
res.success = function(val){
	return this.attribute('success', val);
};

res.addAttribute = function (key, val){
	return this.attribute(key, val);
}


module.exports = function(req, res, next){
	// export res object, which contains express.response's attributes 
	res.locals.sess_attributes = req.session.attributes || {};
	res.locals.removeSessionAttributes = function(){
		req.session.attributes = {};
		
	};
	next();
}
