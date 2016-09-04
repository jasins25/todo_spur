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
        .run(function(editableOptions) {
        editableOptions.theme = 'bs3';
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
        $scope.$on("event:auth-loginRequired", function () {
            $state.go("login");
        });

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
    function CreateGroupCtrl(dbService) {
        var vm = this;

        vm.name = "";
        vm.email = "";
        vm.emailList =[];

        vm.addEmailToList = function () {
            vm.emailList.push(vm.email);
            vm.email = "";
            console.info("emailList :", vm.emailList);
        };

        vm.createGroup = function () {
            console.info("<-- Executing createGroup function -->");
            dbService.createGroup(vm.group)
                .then(function (result) {
                    
                })
                .catch(function (err) {
                    console.log(err);
                })
        };
    }

    CreateGroupCtrl.inject = ["dbService"];
})();

(function () {
    angular.module("TodoApp", ["ui.router", "http-auth-interceptor", "ngFileUpload", "xeditable"]);
})();

(function () {
    angular
        .module("TodoApp")
        .config(TodoConfig);
    
    function TodoConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state("home", {
                url: "/",
                templateUrl: "/views/home.html"
            })
            .state("login", {
                url: "/login",
                templateUrl: "/views/login.html",
                controller: "LoginCtrl as ctrl"
            })
            .state("signUp", {
                url: "/signUp",
                templateUrl: "/views/signUp.html",
                controller: "SignUpCtrl as ctrl"
            })
            .state("p_home", {
                url: "/p_home",
                templateUrl: "/protected/p_home.html",
                controller: "TodoCtrl as ctrl"
            })
            .state("p_home.p_scoreboard", {
                url:"/p_scoreboard",
                templateUrl: "/protected/p_scoreboard.html",
                controller: "ScoreBoardCtrl as ctrl"
            })
            .state("p_home.p_createdGroups", {
                url:"/p_createdGroups",
                templateUrl: "/protected/p_createdGroups.html",
                controller: "CreatedGroupsCtrl as ctrl"
            })
            .state("p_home.p_groupsIamIn", {
                url:"/p_groupsIamIn",
                templateUrl: "/protected/p_groupsIamIn.html",
                controller: "GroupsIamInCtrl as ctrl"
            })
            .state("p_home.p_completedTasks", {
                url:"/p_completedTasks",
                templateUrl: "/protected/p_completedTasks.html",
                controller: "CompletedTasksCtrl as ctrl"
            })
            .state("confirmReg", {
                url: "/confirmReg",
                templateUrl: "/views/confirmReg.html"
            })
            .state("p_profile", {
                url: "/p_profile",
                templateUrl: "/protected/p_profile.html",
                controller: "ProfileCtrl as ctrl"
            })
            .state("settings", {
                url: "/settings",
                templateUrl: "/views/settings.html",
                controller: "SettingsCtrl as ctrl"
            })
            .state("createGroup", {
                url: "/createGroup",
                templateUrl: "/views/createGroup.html",
                controller: "CreateGroupCtrl as ctrl"
            })
            .state("logout", {
                url: "/logout",
                templateUrl: "/views/logout.html",
                controller: "LogoutCtrl as ctrl"
            });
        $urlRouterProvider.otherwise("/");
    }
    
    TodoConfig.$inject = ["$stateProvider", "$urlRouterProvider"];
})();

(function () {
    angular
        .module("TodoApp")
        .service("dbService", dbService);

    function dbService($http, $q, Upload) {
        var service = this;
        service.currentUser = {};
        service.newUser = function () {
            var user = {};
            user.id = "";
            user.email = "";
            user.password = "";
            user.firstName = "";
            user.lastName = "";
            user.gender = "";
            user.country = "";
            user.dateOfBirth = "";
            user.imgFile = null;
            return user;
        };

        service.signUp = function (new_user) {
            var defer = $q.defer();
            Upload.upload({
                url: "/api/signUp",
                data: new_user
            })
                .then(function (result) {
                    defer.resolve(result);
                })
                .catch(function (err) {
                    defer.reject(err);
                });

            return defer.promise;
        };
        
        service.getUserInfo = function () {
            var defer = $q.defer();
            $http.get("/protected/api/login/user")
                .then(function (result) {
                    service.currentUser = result.data;
                    defer.resolve(result.data);

                })
                .catch(function (err) {
                    console.info("Cannot load user details");
                    defer.reject(err);
                });

            return defer.promise;
        };
        
        service.editUser = function (user) {
            console.info(user);
            var defer = $q.defer();
            Upload.upload({
                url: "/protected/api/user/edit",
                data: user
            }).then(function (result) {
                    defer.resolve(result);
                })
                .catch(function (err) {
                    console.info("Cannot save edited user details");
                    defer.reject(err);
                });

            return defer.promise;
        };

        service.delete = function () {
            var defer = $q.defer();
            $http.get("/protected/api/user/delete")
                .then(function (result) {
                    service.currentUser = result;
                    defer.resolve(result);

                })
                .catch(function (err) {
                    console.info("Cannot load user details");
                    defer.reject(err);
                });

            return defer.promise;
        };
        
        service.createGroup = function (group) {
            console.info("group:"+group);
            var defer = $q.defer();
            $http.post("/protected/api/group/create", group)
                .then(function (result) {
                    service.currentUser = result;
                    defer.resolve(result);

                })
                .catch(function (err) {
                    console.info("Cannot load user details");
                    defer.reject(err);
                });

            return defer.promise;
        };
    }

    dbService.$inject = ["$http", "$q", "Upload"];
})();
