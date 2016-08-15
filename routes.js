var express = require("express");
var Groups = require("./groups.js");
var User = require("./user.js");
var Groups_Users = require("./groups_users.js");
var watch = require("connect-ensure-login");
var multer = require("multer");

var multipart = multer();

module.exports = function(app) {
    app.use("/protected", watch.ensureLoggedIn("/status/401"));

    app.get("/api/login/user", function (req, res) {
        res.status(202).json(req.user);
    });

    app.post("/api/user/edit", multipart.single("imgFile"), function (req, res) {
        console.log("Edit:", req.body);
        var dateOfBirth = req.body.dateOfBirth.substring(0, req.body.dateOfBirth.indexOf('T'));
        var args = [
            req.body.email,
            req.body.firstName,
            req.body.lastName,
            req.body.gender,
            dateOfBirth,
            req.body.country,
        //    req.file.buffer
            req.body.id
        ];
        User.saveEditUser(args)
            .then(function (result) {
                console.log("Updated user in DB");
                res.status(202).json(result);
            })
            .catch(function (err) {
                console.log("Error Occurred", err);
                res.status(500).end();
            })
    });

    app.get("/api/user/delete", function (req, res) {
        User.deleteuser([req.user.id])
            .then(function (result) {
                console.log("dELETED user from DB");
                res.status(202).json(result);
            })
            .catch(function (err) {
                console.log("Error Occurred", err);
                res.status(500).end();
            })
    });

    app.post("/api/group/create", function (req, res) {
        var users = [];
        console.log(req.body.group);
        gName = req.body.group.name;
        users = req.body.group.users;
        
        var group = new Group(
            req.body.group.id,
            req.body.group.name,
            req.user[0]
        );
        console.log("New Group:"+ group);
        group.saveNewGroup([
            req.body.group.name,
            req.user[0]
        ]).then(function (result) {
            console.log("Saved new group in Groups schema", result);
            group.id = result.insertId;
            res.status(202).json(group);
        }).catch(function (err) {
            console.log("Error Occurred", err);
            res.status(500).end();
        });
        
        for( i=0; i < users.length; i++){
            User.findUserId([users[i]])
                .then(function (result) {
                    var user_id = result.data.id;
                    Groups_Users.saveNewGroupUsers([group.id, user_id])
                        .then(function (result) {
                            console.log("Saved new group in Groups schema", result);
                            Groups_Users.id = result.insertId;
                            res.status(202).json(group);
                        }).catch(function (err) {
                            console.log("Error Occurred", err);
                            res.status(500).end();
                        });
                })
                .catch(function (err) {
                    console.log("Error Occurred", err);
                    res.status(500).end();
                });
        }
    });


    app.use(express.static(__dirname + "/public"));
    app.use("/bower_components", express.static(__dirname + "/bower_components"));

};