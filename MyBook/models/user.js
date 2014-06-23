var mongoose = require('./db').mongoose;

//db.on('error', console.error.bind(console, 'connection error:'));
//db.once('open', function callback () {
//  console.log('MongoDB is conneted' );
//});	

var schema = new mongoose.Schema(
	{
		username: String,
		password: String		
	}
);

module.exports = mongoose.model('User',schema);