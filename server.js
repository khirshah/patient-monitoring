//---------------------- INIT ---------------------------------

//---------------------- mongo -----------------------------
const db = require('./src/mongo/startmongo');
const User = require('./src/mongo/user.js');

//---------------------- auth -----------------------------
const secret = 'mysecretsshhh';
const jwt = require('jsonwebtoken');
const withAuth = require('./middleware');

//---------------------- express -------------------------
const express = require('express');
const path = require('path');
const port = process.env.PORT || 2500;
const app = express();

//-------------------- cookie parser -----------------------
const cookieParser = require('cookie-parser');

//-------------------- body parser -----------------------
const bodyParser = require('body-parser');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// the __dirname is the current directory from where the script is running
app.use(express.static(path.join(__dirname, 'dist')));

// send the user to index html page inspite of the url
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.get('/secret', withAuth, function(req, res) {
  res.send('The password is potato');
});

// POST route to register a user
app.post('/register', function(req, res) {
  const { username, password } = req.body;
  const user = new User({ username, password });
  user.save(function(err) {
    if (err) {
      res.status(500)
        .send("Error registering new user please try again.");
    } else {
      res.status(200).send("Welcome to the club!");
    }
  });
});

app.post('/authenticate', function(req, res) {
  const { username, password } = req.body;
  User.findOne({ username }, function(err, user) {
    if (err) {
      console.error(err);
      res.status(500)
        .json({
        error: 'Internal error please try again'
      });
    } else if (!user) {
      res.status(401)
        .json({
          error: 'Incorrect username or password'
        });
    } else {
      user.isCorrectPassword(password, function(err, same) {
        if (err) {
          res.status(500)
            .json({
              error: 'Internal error please try again'
          });
        } else if (!same) {
          res.status(401)
            .json({
              error: 'Incorrect username or password'
          });
        } else {
          // Issue token
          const payload = { username };
          const token = jwt.sign(payload, secret, {
            expiresIn: '1h'
          });
          res.cookie('token', token, { httpOnly: true })
            .sendStatus(200);
        }
      });
    }
  });
});

app.get('/checkToken', withAuth, function(req, res) {
  res.sendStatus(200);
}

app.listen(port, () => console.log(`App is listening on port ${port}`));
