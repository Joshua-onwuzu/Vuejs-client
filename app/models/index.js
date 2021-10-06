const dbConfig = require('../config/db.config.js');

const mongoose = require ('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose

db.url = dbConfig.url;

db.client = require('./client.js')(mongoose);

db.provider = require('./provider.js')(mongoose);

db.table = require('./table.js')(mongoose);


module.exports = db