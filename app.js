//app.js
const mongoose = require('mongoose');
require("./models/user.js");
const User = mongoose.model("User");
const Question = mongoose.model("Question");
const Presentation = mongoose.model("Presentation");

const express = require('express');
const passport = require('passport');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const app = express();

const configDB = require("./config/database.js");

//configuration
mongoose.connect(configDB.url);

//pass passport for configuration
require("./config/passport")(passport);

// body parser setup
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "hbs");

// required for passport
app.use(session({ secret: 'hackNYU' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

require("./routes/routes.js")(app, passport);

//SocketIO

const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

new Presentation({presentationID: 0 , questions: []}).save(function(err, data, count) {
  //some stuff
});

io.on('connect', (socket) => {
    console.log("A User Connected");

    socket.on("questionSubmit", (presentation, question) => {

      //find presentation
      Presentation.find( {presentationID : 0}, function(err, data, count) {
        data[0].questions.push({text: question.text, upvotes: 0});

        data[0].save(function (err) {
          if (!err) {
            console.log('Success!');
            console.log(data[0]);
          }
        });
      });

      io.emit("questionSubmit", question);
    });

    socket.on('disconneted', () => {
      console.log("A User Disconnected");
    });
});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening');
});
