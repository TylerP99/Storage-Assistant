const { urlencoded } = require("express");
const express = require("express");

const app = express();

// App Constants
const PORT = process.env.PORT || 3000;

// EJS - View Engine
app.set("view engine", "ejs");
app.use(express.json()); // Parses JSON requests and puts the data in body
app.use(express.urlencoded({ extended:true})); // Parses incoming url options and puts the data in the body
app.use(express.static("public")); // Allows router to easily grab from public folder (mainly used for js and css on client side)


// Root Router
app.use("/", require("./routes/index.js"));

// Api Router
app.use("/api", require("./routes/api.js"));

app.listen(PORT, () =>{
    console.log(`Listening on ${PORT}`);
})