var q = require('q');
var mysql = require("mysql");
var pool = mysql.createPool({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "todo_list",
    connectionLimit: 4
});

function Lists_Users(list_id, user_id) {
    this.list_id = list_id;
    this.user_id = user_id;
}

const GETLISTUSERS = "select lists_users.user_id, users.first_name, users.last_name from lists_users join users " +
                        "on lists_users.user_id = users.id where lists_users.list_id = ?";
const SAVELISTUSERS = "INSERT INTO lists_users (lists_users.list_id, lists_users.user_id) VALUES (?,?)";
var makeQuery = function (sql, pool) {
    return function (args) {

        var defer = q.defer();

        pool.getConnection(function (err, connection) {
            if (err) {
                return defer.reject(err);
            }
            connection.query(sql, args || [], function (err, result) {
                connection.release();
                if (err) {
                    return defer.reject(err);
                }
                defer.resolve(result);
            })
        });

        return defer.promise;
    };
};

Lists_Users.getListUsers = makeQuery(GETLISTUSERS, pool);
Lists_Users.saveListUsers = makeQuery(SAVELISTUSERS, pool);

module.exports = Lists_Users;
