const mongoose = require('mongoose');
const User = require("../models/user.js");
const Question = mongoose.model("Question");
const Presentation = mongoose.model("Presentation");
const ObjectId = require('mongodb').ObjectID;

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
        const createdPresentationsIDsToDisplay = data[0].createdPresentations.slice(0, Math.min(data[0].createdPresentations.length, 3));
        const joinedPresentationsIDsToDisplay = data[0].joinedPresentations.slice(0, Math.min(data[0].joinedPresentations.length, 3));

        console.log(createdPresentationsIDsToDisplay);
        console.log(joinedPresentationsIDsToDisplay);

        const extractData = function(IDs, onComplete){
          const allData = [];
          let promiseCounter = IDs.length;

          if(promiseCounter <= 0){
            onComplete([]);
          }

          console.log(promiseCounter);
          for(let i = 0; i < IDs.length; i++){
            Presentation.find( {"_id" : ObjectId(IDs[i]) }, function(err, internalData, count) {
              console.log("Internal data: " + internalData);
              promiseCounter--;
              console.log(promiseCounter);
              if(!err){
                allData.push(internalData);
                if(promiseCounter <= 0){
                  onComplete(allData);
                }
              } else {
                console.log("Error: " + err);
              }
            });
          }
        }

        const allCreatedData = extractData(createdPresentationsIDsToDisplay, function(data) {
          if(data.length >= 0){

              res.render('profile.hbs', {
                  username : req.user.local.email, // get the user out of session and pass to template
                  createdPresentations : data,
                //yourPresentations : allJoinedData,
              });
          } else {
            res.render('profile.hbs', {
                username : req.user.local.email, // get the user out of session and pass to template
                fillWhenEmpty : "<h6> No created presentations</h6>"
              //yourPresentations : allJoinedData,
            });
          }

        });
      //  const allJoinedData = extractData(joinedPresentationsIDsToDisplay);
      } );

    });

    app.get('/create', isLoggedIn, function(req, res) {
        res.render('create.hbs');
    });

    app.post('/create', isLoggedIn, function(req, res) {

      //Creates a new presentation and adds to the database
      //TODO: creates new with file
      var mongoose = require('mongoose');
      var slides = mongoose.model('Slides');
      var User = mongoose.model('User');
      if (!req.files)
        res.redirect('/profile');
     
      // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
      let sampleFile = req.files.sampleFile;
      const pres = new Presentation({name: "Default Name",fileName: req.files.sampleFile.name, caption: "Fill me in daddy", questions: []});

      pres.save(pres, function(err, data, count){
        sampleFile.mv('public/assets/'+req.files.sampleFile.name, function(err) {
            if (err){
              return res.status(500).send(err);
            }
            else{
              user[0].save(function(err){
              req.user.createdPresentations.push(data._id);
              req.user.save();

              res.redirect(url.format({
                pathname:'/presentation',
                query: {
                  presentationID: data._id + '',
                }
              }));  
              });
            }
          });
      });
    });

    app.get('/presentation', isLoggedIn, function(req, res){

      const presentationID = req.url.replace("/presentation?presentationID=", "").trim();

      console.log("presentation ID: " + presentationID);

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
