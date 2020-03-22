var db = require('./startmongo');

var User = require('./user');

// create a new user
var user = new User({
  username: 'testName',
  password: 'password' 
});

user.save(function(err) {
    if (err) {
       console.log("error"),err;
    } else {
       console.log("saved");
    }
});

User.find({}, function(err, users) {
  if (err) throw err;

  // object of all the users
  console.log(users);

  db.disconnect();

});