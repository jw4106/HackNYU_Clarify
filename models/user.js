const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");

// define the schema for our user model
const userSchema = new mongoose.Schema({

    local            : {
        email        : String,
        password     : String
    }
});

//presentations
const QuestionSchema = new mongoose.Schema({
  text: String,
  upvotes : Number
});

const PresentationSchema = new mongoose.Schema({

  presentationID : Number,
  //creator: userSchema,
  //people with access
  questions: [QuestionSchema]
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
