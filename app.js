//app.js
const mongoose = require('mongoose');
require("./models/user.js");
const User = mongoose.model("User");
const Question = mongoose.model("Question");
const Presentation = mongoose.model("Presentation");
const ObjectId = require('mongodb').ObjectID;

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

io.on('connect', (socket) => {
    console.log("A User Connected");

    socket.on("questionSubmit", (presentationID, question) => {

      console.log("Handed presentationID: " + presentationID.trim());
      Presentation.find( {}, function(err, data, count) {
        console.log("All data: " + data);

        //find presentation
        Presentation.find( {"_id" : ObjectId(presentationID) }, function(err, data, count) {
          console.log(data);

          if(err !== null){
            console.log("Error: "  + err);
            return;
          }

          if(count > 1){
            console.log("Too many users found! Unique ID has failed");
            return;
          }

          if(count <= 0){
            console.log("No users found! Unique ID has failed");
            return;
          }

          data[0].questions.push({text: question.text, upvotes: 0});

          data[0].save(function (err) {
            if (!err) {
              console.log('Success!');
              console.log(data[0]);
            }
          });
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
