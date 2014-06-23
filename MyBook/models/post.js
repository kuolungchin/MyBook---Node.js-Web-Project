var mongoose = require('./db').mongoose;

var schema = new mongoose.Schema(
	{
		username: String,
		comment: String,
		date: Date,
		replies: []
	}
);

module.exports = mongoose.model('Post',schema);