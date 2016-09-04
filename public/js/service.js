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
        
        service.createdGroups = function () {
            var defer = $q.defer();
            $http.get("/protected/api/createdGroups/NoOfLists/NoOfUsers")
                .then(function (result) {
                    defer.resolve(result);
                })
                .catch(function () {
                    defer.reject(err);
                });
            return defer.promise;
        };
        
        service.getGroupUsers = function (groupId) {
            var defer = $q.defer();
            $http.get("/protected/api/group/assigedUsers/" + groupId)
                .then(function (result) {
                    defer.resolve(result.data);
                })
                .catch(function (err) {
                    defer.reject(err);
                });
            return defer.promise;
        };
        
        service.groupsImIn = function () {
            var defer = $q.defer();
            $http.get("/protected/api/groupsImIn/NoOflists")
                .then(function (result) {
                    defer.resolve(result);
                })
                .catch(function () {
                    defer.reject(err);
                });
            return defer.promise;
        };
        
        service.getLists = function (groupId) {
            var defer = $q.defer();
            $http.get("/protected/api/lists/NoOfTasks/NoOfUsers/" + groupId)
                .then(function (result) {
                    defer.resolve(result.data);
                })
                .catch(function (err) {
                    defer.reject(err);
                });
            return defer.promise;
        };
        
        service.addList = function (groupId,listName,listUsers) {
            var defer = $q.defer();
            param = {
                groupId: groupId,
                listName: listName,
                listUser: listUser
            };
            $http.post("/protected/api/list/save/users", {
                params: param
            }).then(function (results) {
                console.log(results);
                defer.resolve(results.data);
            }).catch(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        };
        
        service.getTasks = function (listId) {
            var defer = $q.defer();
            $http.get("/protected/api/Tasks/assigedUsers/" + listId)
                .then(function (result) {
                    defer.resolve(result.data);
                })
                .catch(function (err) {
                    defer.reject(err);
                });
            return defer.promise;
        };
        
        service.getListUsers = function (listId) {
            var defer = $q.defer();
            $http.get("/protected/api/List/assigedUsers/" + listId)
                .then(function (result) {
                    defer.resolve(result.data);
                })
                .catch(function (err) {
                    defer.reject(err);
                });
            return defer.promise;
        };

        service.addTodo1 = function (newT) {
            var defer = $q.defer();
            $http.post("/protected/api/task/save/oneuser",newT)
                .then(function (result) {
                    defer.resolve(result);
                }).catch(function (err) {
                    defer.reject(err);
                });
            return defer.promise;
        };

        service.addTodo2 = function (newT, userIds) {
            var params = {
                newTodo : newT,
                userIds: userIds
            };
            var defer = $q.defer();
            $http.post("/protected/api/task/save/anyone",{params: params})
                .then(function (result) {
                    defer.resolve(result);
                }).catch(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        };
    }

    dbService.$inject = ["$http", "$q", "Upload"];
})();
var params = {
    newTodo : vm.newTodo,
    user_ids: vm.listUsers
};