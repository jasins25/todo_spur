(function () {
    angular.module("TodoApp")
        .controller("LoginCtrl", LoginCtrl)
        .controller("SignUpCtrl", SignUpCtrl)
        .controller("TodoCtrl", TodoCtrl)
        .controller("NavigationCtrl", NavigationCtrl)
        .controller("LogoutCtrl", LogoutCtrl)
        .controller("ProfileCtrl", ProfileCtrl)
        .controller("SettingsCtrl", SettingsCtrl)
        .controller("CreateGroupCtrl", CreateGroupCtrl)
        .controller("CreatedGroupsCtrl", CreatedGroupsCtrl)
        .controller("ListsInGroupCtrl", ListsInGroupCtrl)
        .controller("TasksInListCtrl", TasksInListCtrl)
        .run(function(editableOptions) {
            editableOptions.theme = 'bs3';
        })
        .filter('unique', function() {
            return function(collection, keyname) {
                var output = [],
                    keys = [];

                angular.forEach(collection, function(item) {
                    var key = item[keyname];
                    if(keys.indexOf(key) === -1) {
                        keys.push(key);
                        output.push(item);
                    }
                });
                return output;
            };
        });

    function LoginCtrl($http, authService, $state) {
        var vm = this;
        vm.login = function () {
            console.info("<-- Executing Login function -->");
            $http.post("/login", vm.user)
                .then(function () {
                console.info("log in ok");
                $state.go("p_home");
                authService.loginConfirmed();
            }).catch(function(err) {
                console.info(">> %s", JSON.stringify(err));
            });
        };
        
    }

    LoginCtrl.$inject = ["$http", "authService", "$state"];

    function SignUpCtrl($http, $state, dbService) {
        var vm = this;
        vm.newUser = dbService.newUser();

        vm.signUp = function () {
            console.info("<-- Executing signUp function -->");
            dbService.signUp(vm.newUser)
                .then(function () {
                    $state.go("login");
                    // authService.loginConfirmed();
                })
                .catch(function (err) {
                    vm.message = "Sign Up not successful";
                });
        };
    }

    SignUpCtrl.$inject = ["$http", "$state", "dbService"];

    function TodoCtrl(dbService, $stateParams, $scope, $state) {
        var vm = this;


    }

    TodoCtrl.$inject = ["dbService", "$stateParams", "$scope", "$state"];


    function NavigationCtrl($scope, $rootScope, $log, dbService, $state) {
        var vm = this;
        // $scope.$on("event:auth-loginRequired", function () {
        //     $state.go("login");
        // });

        dbService.getUserInfo()
            .then(function (user) {
                $rootScope.isLoggedin = true;
                $rootScope.loggedInUser = user;
            })
            .catch(function (err) {
                console.info(err);
            });


        $scope.$on("event:auth-loginConfirmed", function (data) {
            console.log("Login Confirmed");
            $rootScope.isLoggedin = true;
            $log.log(data);
            dbService.getUserInfo()
                .then(function (user) {
                    $rootScope.loggedInUser = user;
                })
                .catch(function (err) {
                    console.info(err);
                });
        });

        $scope.$on("event:auth-forbidden", function () {
            console.log("Forbidden");
        });

        vm.isLoggedIn = function () {
            return $rootScope.isLoggedin;
        };
        
        vm.setFalse = function () {
            $rootScope.isLoggedin = false;
            return $rootScope.isLoggedin;
        };
        

    }

    NavigationCtrl.$inject = ["$scope", "$rootScope", "$log", "dbService", "$state"];

    function LogoutCtrl($state, $http) {
        var vm = this;
        vm.logout = function () {
            console.info("<-- Executing logout function -->");
            $http.get("/logout")
                .then(function () {
                    dbService.currentUser = "";
                    //$rootScope.isLoggedin = false;
                    $state.go("home");
                    //return $rootScope.isLoggedin;
                })
                .catch(function (err) {
                    console.log("Unable to logout");
                });
        };
    }

    LogoutCtrl.$inject = ["$state", "$http"];

    function ProfileCtrl($http, dbService) {
        console.info("dbService.currentUser", dbService.currentUser);
        var vm = this;
        vm.user = {};
        vm.user.id = dbService.currentUser.id;
        vm.user.email = dbService.currentUser.email;
        vm.user.firstName = dbService.currentUser.first_name;
        vm.user.lastName = dbService.currentUser.last_name;
        vm.user.gender = dbService.currentUser.gender;
        vm.user.dateOfBirth = dbService.currentUser.date_of_birth;
        vm.user.country = dbService.currentUser.country;
        

        vm.editUser = function () {
            console.info("<-- Executing editUser function -->");
            dbService.editUser(vm.user)
                .then(function (result) {
                    dbService.currentUser = vm.user;
                })
                .catch(function (err) {
                    console.info("err");
                });
        }
    }

    ProfileCtrl.$inject = ["$http", "dbService"];
    
    function SettingsCtrl($http, dbService, $state) {
        var vm = this;
        vm.delete = function () {
            console.info("<-- Executing delete function to delete the user account -->");
            dbService.delete()
                .then(function (result) {

                })
                .catch(function (err) {
                    console.log(err);
                });
        };
    }

    SettingsCtrl.$inject = ["$http", "dbService", "$state"];

    //Creates sa group and adds members to the group
    function CreateGroupCtrl(dbService, $state) {
        var vm = this;

        vm.name = "";
        vm.email = "";
        vm.emailList =[];
        vm.result = {};
        vm.addEmailToList = function () {
            vm.emailList.push(vm.email);
            vm.email = "";
        };

        vm.createGroup = function () {
            console.info("<-- Executing createGroup function -->");
            var group = {
                name: vm.name,
                emails: vm.emailList
            };
            console.info("group", group);
            dbService.createGroup(group)
                .then(function (result) {
                    vm.result = result;
                    vm.emailList =[];
                    $state.go("p_home.p_createdGroups");
                })
                .catch(function (err) {
                    console.log(err);
                })
        };
        vm.myFunction = function (){
            if(vm.result.insertId) {
                // Get the snackbar DIV
                var x = document.getElementById("snackbar");
            }else{
                var x = document.getElementById("snackbar1");
            }
                // Add the "show" class to DIV
                x.className = "show";

                // After 3 seconds, remove the show class from DIV
                setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);

        }
    }

    CreateGroupCtrl.inject = ["dbService", "$state"];

    function CreatedGroupsCtrl(dbService, $state) {
        var vm = this;
        vm.groups_lists1 = [];
        vm.groups_lists2 = [];
        vm.createdGroups = function () {
            dbService.createdGroups()
                .then(function (result) {
                    vm.groups_lists1 = result.data;
                    if(!vm.groups_lists1.NoOfLists){
                        vm.groups_lists1.NoOfLists = '0';
                    }
                })
                .catch(function (err) {
                    console.log(err);
                })
        };

        vm.createdGroups();
        
        vm.groupsImIn = function () {
            dbService.groupsImIn()
                .then(function (result) {
                    vm.groups_lists2 = result.data;
                })
                .catch(function (err) {
                    console.log(err);
                });
        };
        vm.groupsImIn();
    }

    CreatedGroupsCtrl.inject = ["dbService", "$state"];
    
    function ListsInGroupCtrl($stateParams, dbService) {
        var vm = this;
        
        vm.groupId = $stateParams.groupId;
        vm.groupName = $stateParams.groupName;
        vm.groupUsers = [];
        vm.listName = "";
        vm.listUsers = [];
        vm.listUsersId = [];
        for(i=0; i < vm.listUsers.length; i++){
            vm.listUsersId.push(vm.listUsers[i].user_id);
        }

        dbService.getLists($stateParams.groupId)
            .then(function (result) {
                vm.lists_tasks = result;
            })
            .catch(function (err) {
                console.log(err);
            });
        
        vm.getGroupUsers = function () {
            dbService.getGroupUsers($stateParams.groupId)
                .then(function (users) {
                    vm.groupUsers = users;
                })
                .catch(function (err) {
                    console.log(err);
                });
        };
        vm.getGroupUsers();
        
        vm.addList = function () {
            dbService.addList(vm.groupId,vm.listName,vm.listUsersId)
                .then(function (result) {
                    console.info("New list created");
                })
                .catch(function (err) {
                    console.info("Some Error Occured",err);
                });
        }
    }

    ListsInGroupCtrl.inject = ["$stateParams", "dbService"];

    function TasksInListCtrl($stateParams, dbService) {
        var vm = this;
        vm.listId =$stateParams.listId;
        vm.listName = $stateParams.listName;
        vm.tasklist = [];
        vm.listUsersDrop = ["ANYONE"];
        vm.listUsers = [];

        vm.getTasks = function () {
            dbService.getTasks($stateParams.listId)
                .then(function (result) {
                    vm.tasklist = result;
                })
                .catch(function (err) {
                    console.log(err);
                });
        };
        vm.getTasks();

        vm.getListUsers = function () {
            dbService.getListUsers($stateParams.listId)
                .then(function (result) {
                    vm.listUsers.push(result);
                    for(i=0; i < result.length; i++){
                        vm.listUsersDrop.push(result[i].first_name+' '+result[i].last_name);
                    }
                })
                .catch(function (err) {
                    console.log(err);
                });
        };
        vm.getListUsers();

        vm.newTodo = {};
        vm.newTodo.id = "";
        vm.newTodo.listId = vm.listId;
        vm.newTodo.taskName = "";
        vm.newTodo.dueDate = "";
        vm.newTodo.priority = "";
        vm.newTodo.points = "";
        vm.newTodo.assignedTo = "";
        vm.newTodo.completed = "N";
        vm.newTodo.assignedToID = "";
        vm.listUsersId = [];
        console.info("user ids: ", vm.listUsersId);
        if(vm.newTodo.assignedTo != "ANYONE"){
            console.info("user ids: ", vm.listUsersId);

            vm.listUsers.forEach(function (obj, index, array) {
                console.info(">> obj", obj);
                var name = obj.first_name+''+obj.last_name;
                if(name == vm.newTodo.assignedTo){
                    vm.newTodo.assignedToID = obj.id;
                }
            })
        }
        else{
            vm.listUsers.forEach(function (obj,index, array) {
                vm.listUsersId.push(obj.id);
            })
        }

        vm.addTodo = function () {
            if(vm.newTodo.assignedTo != "ANYONE"){
                dbService.addTodo1(vm.newTodo)
                    .then(function (result) {

                    }).catch(function (err) {
                        console.info(err);
                });
            }
            else{
                dbService.addTodo2(vm.newTodo, vm.listUsersId)
                    .then(function (result) {
                        
                    }).catch(function (err) {
                        console.info(err);
                });
            }

        };
        
        
        vm.changeCompleted = function (t) {
            t.fulfilled = t.done ? "Y": "N";
            dbService.changeCompleted(t.id)
                .then(function (result) {
                    return console.log(result);
                })
                .catch(function (err) {
                    return console.log(err);
                });
        }
    }

    TasksInListCtrl.inject = ["$stateParams", "dbService"]
    
})();
