const express = require("express");

const app = express();

// App Constants
const PORT = process.env.PORT || 3000;

// EJS - View Engine
app.set("view engine", "ejs");

// Logger
const logger = require("morgan");
app.use(logger("dev"));

// Express Middleware
app.use(express.json()); // Parses JSON requests and puts the data in body
app.use(express.urlencoded({ extended:true})); // Parses incoming url options and puts the data in the body
app.use(express.static("public")); // Allows router to easily grab from public folder (mainly used for js and css on client side)

require("dotenv").config();



// Mongoose Config
const mongoose = require("mongoose");
mongoose.set("debug", true);

const dbName = "StorageApp";
const dbConnectionString = process.env.MONGODB_CONNECTION_STRING;

mongoose.connect(
    dbConnectionString,
    //Options
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)
.then( _ => {
    console.log(`Connected to ${dbName} succesfully`);
})
.catch(e => {
    console.error(e);
});

// Express Session
const session = require("express-session");
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true
    })
);

// Passport
const passport = require("passport");
const init_passport_local = require("./config/passport-config.js");
init_passport_local(passport);
app.use(passport.initialize());
app.use(passport.session());



// Root Router
app.use("/", require("./routes/index.js"));

// Api Router
app.use("/api", require("./routes/api.js"));

app.listen(PORT, () =>{
    console.log(`Listening on ${PORT}`);
});