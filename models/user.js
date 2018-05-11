const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");

//presentations
const QuestionSchema = new mongoose.Schema({
  text: String,
  upvotes : Number
});

const PresentationSchema = new mongoose.Schema({

  name: String,
  caption: String,
  fileName: String,
  //creator: userSchema,
  //people with access
  questions: [QuestionSchema]
});

// define the schema for our user model
const userSchema = new mongoose.Schema({

    local            : {
        email        : String,
        password     : String
    },
    createdPresentations : [String], //stores the IDs
    joinedPresentations : [String], //stores the IDs
});


// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model("User", userSchema);
mongoose.model("Question", QuestionSchema);
mongoose.model("Presentation", PresentationSchema);

/////
