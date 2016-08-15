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
            $http.get("/api/login/user")
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
                url: "/api/user/edit",
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
            $http.get("/api/user/delete")
                .then(function (result) {
                    service.currentUser = result;
                    defer.resolve(result);

                })
                .catch(function (err) {
                    console.info("Cannot load user details");
                    defer.reject(err);
                });

            return defer.promise;
        }
    }

    dbService.$inject = ["$http", "$q", "Upload"];
})();
