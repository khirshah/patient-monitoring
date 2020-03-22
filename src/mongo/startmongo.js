// grab the things we need
var db = require('mongoose');
//console.log(db)

db.connect('mongodb://127.0.0.1:27017/test',{ useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex: true, });

module.exports = db;