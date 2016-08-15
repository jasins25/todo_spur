(function () {
    angular
        .module("TodoApp")
        .config(TodoConfig);
    
    function TodoConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state("home", {
                url: "/",
                templateUrl: "/views/home.html",
                controller: "TodoCtrl as ctrl"
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
            .state("confirmReg", {
                url: "/confirmReg",
                templateUrl: "/views/confirmReg.html"
            })
            .state("profile", {
                url: "/profile",
                templateUrl: "/views/profile.html",
                controller: "ProfileCtrl as ctrl"
            })
            .state("settings", {
                url: "/settings",
                templateUrl: "/views/settings.html",
                controller: "SettingsCtrl as ctrl"
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
