//app.js

//requires
const path = require("path");
const express = require("express");

//app
const app = express();
//serve static files in public
app.use(express.static(path.join(__dirname, "public")));
//set view engine to handlebars
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

//routes
require("./routes/places.js")(app);

//set environment variable to the correct port number
app.listen(process.env.PORT || 3000);
