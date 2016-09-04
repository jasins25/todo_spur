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
            .state("p_home.p_lists", {
                url:"/p_lists/:groupId/:groupName",
                templateUrl: "/protected/p_lists.html",
                controller: "ListsInGroupCtrl as ctrl"
            })
            .state("p_home.p_tasks", {
                url:"/p_tasks/:listId/:listName",
                templateUrl: "/protected/p_tasks.html",
                controller: "TasksInListCtrl as ctrl"
            })
            .state("confirmReg", {
                url: "/confirmReg",
                templateUrl: "/views/confirmReg.html"
            })
            .state("p_home.p_profile", {
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
