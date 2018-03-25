const mongoose = require('mongoose');
require("../models/user.js");
const User = mongoose.model("User");
const Question = mongoose.model("Question");
const Presentation = mongoose.model("Presentation");
const url = require('url');

// routes/routes.js
module.exports = function(app, passport) {

    // *********** PASSPORT BEGIN ***********
    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.redirect('/login')
    });
    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.hbs', { message: req.flash('loginMessage') });
    });
    // process the login form
    // app.post('/login', do all our passport stuff here);

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.hbs', { message: req.flash('signupMessage') });
    });
    // process the signup form
    // app.post('/signup', do all our passport stuff here);

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {

      User.find( { _id: req.user._id }, function(err, data, count) {
        if(err || data === undefined){
          console.log("User not found!");
          res.render('profile.hbs');
        }

        if(count > 1){
          console.log("Too many users found! Unique ID has failed");
          res.render('profile.hbs');
        }

        //get three of the user's presentations
        const createdPresentationsToDisplay = data[0].createdPresentations.slice(0, Math.max(data[0].createdPresentations.length, 3));
        const joinedPresentationsToDisplay = data[0].joinedPresentations.slice0, Math.max(data[0].joinedPresentations.length, 3));

        res.render('profile.hbs', {
            username : req.user.local.email, // get the user out of session and pass to template
            createdPresentations : createdPresentationsToDisplay,
            yourPresentations : joinedPresentationsToDisplay,
        });

      } );

    });

    app.get('/create', isLoggedIn, function(req, res) {
        res.render('create.hbs');
    });

    app.post('/create', isLoggedIn, function(req, res) {

      //Creates a new presentation and adds to the database
      //TODO: creates new with file
      req.user.createdPresentations.push(new Presentation({name: "Default Name", caption: "Fill me in daddy", questions: []}));

      req.user.createdPresentations.save(function(err, data, count) {
        if (!err) {
          console.log('Successfully added new presentation to the database');

          res.redirect(url.format({
            pathname:'/presentation',
            query: {
              presentationID: data._id,
            }
          }));
        }
      });
    });

    //Regex for any presentation url
    app.get('/^presentation?', function(req, res){

      const presentationID = req.url.replace("presentation", "");

      res.render('presentation.hbs');
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    // POST
    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    // *********** PASSPORT END ***********


    // CUSTOM ROUTES BEGIN
};



// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
