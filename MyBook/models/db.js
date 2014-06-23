var db_settings = require('../settings');

var mongoose = require('mongoose');

mongoose.connect('mongodb://' + db_settings.host + ':27017/' + db_settings.db);
exports.connection = mongoose.connections[0];
//exports.db = mongoose.connection;
exports.mongoose = mongoose;