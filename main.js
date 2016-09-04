//Load express
var express = require("express");
//Create an instance of express application
var app = express();

var bodyParser = require("body-parser");
var session = require("express-session");
var passport = require("passport");
var fs = require("fs");
var path = require("path");
var multer = require("multer");
var sha1 = require("sha1");
//var AWS = require('aws-sdk');
//var _config = require('../config/config');

var multipart = multer();


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var User = require("./user.js");


// Initialize session
app.use(session({
    secret: "something-cryptic",
    resave: false,
    saveUninitialized: true
}));

//Initialize passport
app.use(passport.initialize());
app.use(passport.session());
require("./auth")(passport);
require("./routes")(app);

app.post("/login", passport.authenticate("local", {
    successRedirect: "/status/201",
    failureRedirect: "/status/403"
}));

app.get("/oauth/google", passport.authenticate("google", {
    scope: ["email", "profile"]
}));

app.get("/oauth/facebook", passport.authenticate("facebook", {
    scope: ["email", "public_profile"]
}));

app.get("/oauth/google/callback", passport.authenticate("google", {
    successRedirect: "/#/p_home",
    failureRedirect: "/signUp"
}));

app.get("/oauth/facebook/callback", passport.authenticate("facebook", {
    successRedirect: "/#/p_home",
    failureRedirect: "/signUp"
}));

app.post("/api/signUp/", multipart.single("imgFile"), function (req, res) {
    // save the user to db
    console.log(req.file.path);
    var password = sha1(req.body.password);
    console.log(password);
    var dateOfBirth = req.body.dateOfBirth.substring(0, req.body.dateOfBirth.indexOf('T'));
    var user = new User(
        req.body.id,
        req.body.email,
        password,
        req.body.password,
        req.body.firstName,
        req.body.lastName,
        req.body.gender,
        req.body.country,
        dateOfBirth,
        req.file.buffer
    );
    console.info("New User "+ user);

    user.saveNewUser([
        req.body.email,
        password,
        req.body.password,
        req.body.firstName,
        req.body.lastName,
        req.body.gender,
        req.body.country,
        dateOfBirth,
        req.file.buffer
    ]).then(function (result) {
        console.log("Saved new user in DB", result);
        user.id = result.insertId;
        res.status(202).json(user);
    }).catch(function (err) {
        console.log("Error Occurred", err);
        res.status(500).end();
    });

});

app.get("/status/:code", function (req, res) {
//console.log("Saved user------", req.user);
    var code = parseInt(req.params.code);
    res.status(code).end();
});

app.get("/logout", function (req, res) {
    console.log("Logging out");
    req.logout();             // clears the passport session
    req.session.destroy();    // destroys all session related data
    res.send(req.user).end();
});

app.use(express.static(__dirname + "/public"));
app.use("/bower_components", express.static(__dirname + "/bower_components"));

app.set("port", process.argv[2] || process.env.APP_PORT || 3000);

app.listen(app.get("port"), function(){
    console.info("Application started on port %d", app.get("port"));
});
