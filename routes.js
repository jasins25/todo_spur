var express = require("express");
var Group = require("./groups.js");
var User = require("./user.js");
var Groups_Users = require("./groups_users.js");
var Group_Lists = require("./groups_lists.js");
var Lists_Tasks = require("./lists_tasks.js");
var Lists_Users = require("./lists_users");
var watch = require("connect-ensure-login");
var multer = require("multer");

var multipart = multer();

module.exports = function(app) {
    app.use("/protected", watch.ensureLoggedIn("/status/401"));

    app.get("/protected/api/login/user", function (req, res) {
        res.status(202).json(req.user);
    });

    app.post("/protected/api/user/edit", multipart.single("imgFile"), function (req, res) {
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

    app.get("/protected/api/user/delete", function (req, res) {
        User.deleteuser([req.user.id])
            .then(function (result) {
                console.log("deleted user from DB");
                res.status(202).json(result);
            })
            .catch(function (err) {
                console.log("Error Occurred", err);
                res.status(500).end();
            })
    });

    app.post("/protected/api/group/create", function (req, res) {
        console.log("<-- Executing group-create api -->");
        var emails = [];
        emails = req.body.emails;
        var userIds = [];
        console.log('>> body: ',req.body);
        
        var group = new Group(
            req.body.id,
            req.body.name,
            req.user.id
        );

        //Insert new group in groups table.
        group.saveNewGroup([
            req.body.name,
            req.user.id
        ]).then(function (result) {
            console.log(">> new group insert result: ", result);
            group.id = result.insertId;
            //Find the users' id of the emails from users table and Insert the user_id and group_id into groups_users table.
            for(i=0; i<emails.length; i++){
                // create a new group
                // find
                User.findUserId([emails[i]])
                    .then(function (result) {
                        if(result){
                            console.log(result);
                            userIds.push(result[0].id);
                            Groups_Users.saveNewGroupUsers([group.id, result[0].id])
                                .then(function (result) {
                                    console.log("groups_users inserted", result);
                                    if(i==(emails.length-1)){
                                        res.status(202).json(result);
                                    }
                                })
                                .catch(function (err) {
                                    console.log("Error inserting group-users ",err);
                                    res.status(500).end();
                                })
                        }
                    })
                    .catch(function (err) {
                        console.log("Error finding user id for emails ",err);
                        res.status(500).end();
                    });
            }
        }).catch(function (err) {
            console.log("Error Occurred inserting group name: ", err);
            res.status(500).end();
        });

        res.status(202);
    });

    //No. of lists in all group created by user
    app.get("/protected/api/createdGroups/NoOfLists/NoOfUsers",function (req, res) {
        Group_Lists.ListsInAGroups([req.user.id])
            .then(function (result) {
                if(result) {
                    console.log("No. of lists in all group created by user ", result);
                    res.status(202).json(result);
                }else{
                    Group_Lists.createdGroups([req.user.id])
                        .then(function (results) {
                            res.status(202).json(results);
                        })
                        .catch(function (err) {
                            console.log("Error Occurred", err);
                            res.status(500).end();
                        });
                }
            })
            .catch(function (err) {
                console.log("Error Occurred", err);
                res.status(500).end();
            });
    });

    app.get("/protected/api/groupsImIn/NoOflists", function (req, res) {
        Group_Lists.ListsInAGroupImIn([req.user.id, req.user.id])
            .then(function (result) {
                res.status(202).json(result);
            })
            .catch(function (err) {
                console.log("Error Occurred", err);
                res.status(500).end();
            });
    });

    app.get("/protected/api/lists/NoOfTasks/NoOfUsers/:groupId", function (req, res) {
        console.log(">> groupId: ", req.params.groupId);
        Lists_Tasks.getListsNoOfTasksNUsers([req.params.groupId])
            .then(function (result) {
                //console.log("No. of tasks in all lists of the group ",result);
                res.status(202).json(result);
            })
            .catch(function (err) {
                console.log("Error Occurred", err);
                res.status(500).end();
            });
    });

    app.get("/protected/api/Tasks/assigedUsers/:listId", function (req, res) {
        Lists_Tasks.getTasksNAssignedUser([req.params.listId])
            .then(function (result) {
                //console.log("No. of tasks in all lists of the group ",result);
                res.status(202).json(result);
            })
            .catch(function (err) {
                console.log("Error Occurred", err);
                res.status(500).end();
            });
    });

    app.get("/protected/api/List/assigedUsers/:listId", function (req, res) {
        Lists_Users.getListUsers([req.params.listId])
            .then(function (result) {
                res.status(202).json(result);
            })
            .catch(function (err) {
                console.log("Error Occurred", err);
                res.status(500).end();
            });
    });

    app.post("/protected/api/todos/changeCompleted/:taskId", function (req, res) {
        Lists_Tasks.changeTaskCompleted([req.params.taskId])
            .then(function (result) {
                res.status(202).json(result);
            })
            .catch(function (err) {
                console.log("Error Occurred", err);
                res.status(500).end();
            });
    });

    app.post("/protected/api/task/save/oneuser", function (req, res) {
        var dueDate = req.body.dueDate.substring(0, req.body.dueDate.indexOf('T'));
        var lists_tasks = new Lists_Tasks(
            req.body.id,
            req.body.listId,
            req.body.taskName,
            dueDate,
            req.body.priority,
            req.body.points,
            req.body.assignedToID
        );
        lists_tasks.saveNewTaskOneUser([
            req.body.listId,
            req.body.taskName,
            dueDate,
            req.body.priority,
            req.body.points,
            'ONE',
            req.body.assignedToID
        ])
            .then(function (result) {
                lists_tasks.id = result.insertId;
                res.status(202).json(lists_tasks);
            })
            .catch(function (err) {
                console.log("Error Occurred", err);
                res.status(500).end();
            });
    });

    app.post("/protected/api/task/save/anyone", function (req, res) {
        var dueDate = req.body.params.dueDate.substring(0, req.body.params.dueDate.indexOf('T'));
        var lists_tasks = new Lists_Tasks(
            req.body.params.id,
            req.body.params.listId,
            req.body.params.taskName,
            dueDate,
            req.body.params.priority,
            req.body.params.points,
            req.body.params.assignedToID
        );
        lists_tasks.saveNewTask([
            req.body.params.listId,
            req.body.params.taskName,
            dueDate,
            req.body.params.priority,
            req.body.params.points,
            'ANYONE'
        ])
            .then(function (results) {
                lists_tasks.id = results.insertId;
                for(i=0; i<req.body.params.userIds.length; i++){
                    lists_tasks.saveAssignedUsers([
                        results.insertId, req.body.params.userIds[i]
                    ])
                        .then(function (result) {
                            
                        })
                        .catch(function (err) {
                            console.log("Error Occurred", err);
                            res.status(500).end();
                        });
                }
                res.status(202).json(result);
            })
            .catch(function (err) {
                console.log("Error Occurred", err);
                res.status(500).end();
            });
        
    });
    
    app.get("/protected/api/group/assigedUsers/:groupId", function (req, res) {
        Groups_Users.getGroupUsers([req.params.groupId])
            .then(function (result) {
                res.status(202).json(result);
            })
            .catch(function (err) {
                console.log("Error Occurred", err);
                res.status(500).end();
            });
    });

    app.post("/protected/api/list/save/users", function (req, res) {
        var listName = req.body.params.listName;
        var listUserId = req.body.params.listUserId;
        var groupId = req.body.params.groupId;

        Group_Lists.saveNewList([groupId, listName])
            .then(function (result) {
                for(i = 0; i < listUserId.length; i++){
                    Lists_Users.saveListUsers([result.insertId, listUserId[i]])
                        .then(function (results) {
                            var final = results[listUserId.length - 1]
                        })
                        .catch(function (err) {
                            console.log("Error Occurred", err);
                            res.status(500).end();
                        });
                }
                res.status(202).json(final);

            })
            .catch(function (err) {
                console.log("Error Occurred", err);
                res.status(500).end();
            })
    });

    app.use(express.static(__dirname + "/public"));
    app.use("/bower_components", express.static(__dirname + "/bower_components"));

};