const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");

const users = require("./routers/users.js");
const config = require("./config/database.js");
const blogs = require("./routers/products");
const port = 2344;
const app = express();

mongoose.connect(config.database);
mongoose.connection.on("connected", () => {
    console.log("Database conected");
});
mongoose.connection.on("error", (err) => {
    console.log("Database not connected " + err);
});

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '/public')));
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);
app.use('/api', blogs);

app.get('/', (req, res) => {
    //res.send("Index page");
});

app.listen(port, () => {
    console.log("Server started at 2344" + __dirname);
});