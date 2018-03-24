//app.js
const mongoose = require('mongoose');
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
app.listen(process.env.PORT || 3000);
//app.listen(3000);
