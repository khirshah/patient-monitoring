const db = require('./startmongo');

const User = require('./user');

const createUSer({username,password}) {
  const newUser = new User({
    username: username,
    password: password 
  });
  return newUser;
}

const saveUser = (user) => {
  user.save()
  .then(() => {
    User.find({}, function(err, users) {
      if (err) throw err;
      console.log("Successful save!");
      // object of all the users
      console.log(users);
      db.disconnect();
    });
  }); 
}

export default {createUSer,saveUser};