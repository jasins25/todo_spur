var mysql = require("mysql");
var q = require("q");

var pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "todo_list",
    port: 3306,
    connectionLimit: 4
});

function Lists_Tasks(id, list_id, task_name, due_date, priority, points, assigned_to) {
    this.id = id;
    this.list_id = list_id;
    this.task_name = task_name;
    this.due_date = due_date;
    this.priority = priority;
    this.points = points;
    this.assigned_to = assigned_to;
}

const GETLISTNOOFTASKSNUSERS = "SELECT lists.id, lists.name, COUNT(DISTINCT lists_tasks.id) AS 'NoOfTasks', " +
                                "COUNT(DISTINCT lists_users.user_id) AS 'NoOfUsers' FROM lists " +
                                "JOIN lists_tasks ON (lists.id = lists_tasks.list_id) " +
                                "JOIN lists_users ON (lists.id = lists_users.list_id) WHERE lists.group_id = ? GROUP BY lists.id;";
const GETTASKSNASSIGNEDUSER = "SELECT lists_tasks.id, lists_tasks.task_name, lists_tasks.due_date, lists_tasks.priority, " +
                                "lists_tasks.points, lists_tasks.assigned_to, list_task_assignees.user_id, users.first_name, users.last_name, " +
                                "users.photo, users.pic_url, list_task_assignees.fulfilled, list_task_assignees.fulfilled_date " +
                                "FROM ((lists_tasks JOIN list_task_assignees ON lists_tasks.id = list_task_assignees.lists_tasks_id) " +
                                "JOIN users ON list_task_assignees.user_id = users.id ) WHERE lists_tasks.list_id = ?";
const SAVENEWTASKONEUSERSQL = "BEGIN; " +
                            "INSERT INTO lists_tasks (list_id, task_name, due_date, priority, points, assigned_to) " +
                            "VALUES (?, ?, ?, ?, ?, ?); " +
                            "INSERT INTO list_task_assignees (lists_tasks_id, user_id) VALUES(LAST_INSERT_ID(), ?); " +
                            "COMMIT;";
const SAVENEWTASK = "INSERT INTO lists_tasks (list_id, task_name, due_date, priority, points, assigned_to) " +
                    "VALUES (?, ?, ?, ?, ?, ?)";
const SAVEASSIGNEDUSERSSQL = "INSERT INTO list_task_assignees (lists_tasks_id, user_id) VALUES(?, ?)";
const CHANGETASKSCOMPLETED = "UPDATE list_task_assignees SET fulfilled='Y' WHERE lists_tasks_id=?";

var makeQuery = function (sql, pool) {
    return function (args) {

        var defer = q.defer();

        pool.getConnection(function (err, connection) {
            if (err) {
                return defer.reject(err);
            }
            //console.log("args:"+args);
            connection.query(sql, args || [], function (err, result) {
                connection.release();
                if (err) {
                    // database error
                    return defer.reject(err);
                }
                defer.resolve(result);
            })
        });

        return defer.promise;
    };
};

Lists_Tasks.getListsNoOfTasksNUsers = makeQuery(GETLISTNOOFTASKSNUSERS, pool);
Lists_Tasks.getTasksNAssignedUser = makeQuery(GETTASKSNASSIGNEDUSER, pool);
Lists_Tasks.prototype.saveNewTask = makeQuery(SAVENEWTASK, pool);
Lists_Tasks.prototype.saveNewTaskOneUser = makeQuery(SAVENEWTASKONEUSERSQL, pool);
Lists_Tasks.prototype.saveAssignedUsers = makeQuery(SAVEASSIGNEDUSERSSQL, pool);
Lists_Tasks.changeTaskCompleted = makeQuery(CHANGETASKSCOMPLETED, pool);
module.exports = Lists_Tasks;