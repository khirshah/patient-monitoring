var db = require('./startmongo');

var User = require('./user');

// create a new user
var user = new User({
  username: 'sevilayha',
  password: 'password' 
});

//chris.save();

User.find({}, function(err, users) {
  if (err) throw err;

  // object of all the users
  console.log(users);

  db.disconnect();

});