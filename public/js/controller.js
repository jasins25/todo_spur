(function () {
    angular.module("TodoApp")
        .controller("LoginCtrl", LoginCtrl)
        .controller("SignUpCtrl", SignUpCtrl)
        .controller("TodoCtrl", TodoCtrl)
        .controller("NavigationCtrl", NavigationCtrl)
        .controller("LogoutCtrl", LogoutCtrl)
        .controller("ProfileCtrl", ProfileCtrl)
        .controller("SettingsCtrl", SettingsCtrl)
        .run(function(editableOptions) {
        editableOptions.theme = 'bs3';
    });

    function LoginCtrl($http, authService, $state) {
        var vm = this;
        vm.login = function () {
            $http.post("/login", vm.user)

                .then(function () {
                console.info("log in ok");
                $state.go("home");
                authService.loginConfirmed();
            }).catch(function(err) {
                console.info(">> %s", JSON.stringify(err));
            });
        }
    }

    LoginCtrl.$inject = ["$http", "authService", "$state"];

    function SignUpCtrl($http, $state, dbService) {
        var vm = this;
        vm.newUser = dbService.newUser();

        vm.signUp = function () {
            
            dbService.signUp(vm.newUser)
                .then(function () {
                    $state.go("login");
                    // authService.loginConfirmed();
                })
                .catch(function (err) {
                    vm.message = "Sign Up not successful";
                });
        }
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

    function LogoutCtrl($state, $rootScope) {
        var vm = this;
        vm.logout = function () {
            //$rootScope.isLoggedin = false;
            $state.go("home");
            //return $rootScope.isLoggedin;
        }
    }

    LogoutCtrl.$inject = ["$state", "$rootScope"];

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
            dbService.editUser(vm.user)
                .then(function (result) {
                    dbService.currentUser = vm.user;
                })
                .catch(function (err) {
                    console.info("err")
                });
        }
    }

    ProfileCtrl.$inject = ["$http", "dbService"];
    
    function SettingsCtrl($http, dbService, $state) {
        var vm = this;
        vm.delete = function () {
            dbService.delete()
                .then(function (result) {

                })
                .catch(function (err) {
                    console.log(err);
                });
        }
        
    }

    SettingsCtrl.$inject = ["$http", "dbService", "$state"];
})();
