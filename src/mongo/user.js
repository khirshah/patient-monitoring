const db = require('./startmongo');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const Schema = db.Schema;

// create a schema
const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  created_at: Date,
  updated_at: Date
});

// on every save, add the date
userSchema.pre('save', async function(next) {
  // get the current date
  const currentDate = new Date();

  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;
  // Check if document is new or a new password has been set
  if (this.isNew || this.isModified('password')) {
    // Saving reference to this because of changing scopes
    const newPw = await encrypt(this.password);
    this.password = newPw;
    next();
  } else {
    next();
  }
});

const encrypt = (passw) => {
  return bcrypt.hash(passw, saltRounds);
}

// the schema is useless so far
// we need to create a model using it
const User = db.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;