const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const mongoose = require("mongoose");
const config = require("./config/database");

// Connect to database
mongoose.connect(config.database, { useMongoClient: true });
// On db connection
mongoose.connection.on("connected", () => {
    console.log("Connected to database " + config.database);
});
// On db error
mongoose.connection.on("error", (err) => {
    console.log("Database error: " + err);
});

const app = express();
const port = process.env.PORT || 8080;

// CORS Middleware
app.use(cors());

// Import other routes and paths
const users = require("./routes/users");
const email = require("./routes/email");

// Set static folder
app.use(express.static(path.join(__dirname, '/public')));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require("./config/passport")(passport);

// Use API routes
var router = express.Router();
app.use("/api", router);
require("./routes/api/user")(router);

app.use("/users", users);
app.use("/email", email);

app.get('***', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(port, () => {
    console.log("Server started on port " + port);
});
