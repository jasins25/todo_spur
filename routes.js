var express = require("express");
var Groups = require("./groups.js");
var User = require("./user.js");
var Groups_Users = require("./groups_users.js");
var watch = require("connect-ensure-login");

module.exports = function(app) {
    app.use("/protected", watch.ensureLoggedIn("/status/401"));

    app.get("/api/login/user", function (req, res) {
        res.status(202).json(req.user);
    });

    app.post("/api/group/create", function (req, res) {
        var users = [];
        console.log(req.body.group);
        gName = req.body.group.name;
        users = req.body.group.users;
        
        var group = new Group(
            req.body.group.id,
            req.body.group.name,
            req.user
        );
        console.log("New Group:"+ group);
        group.saveNewGroup([
            req.body.group.name,
            req.user
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