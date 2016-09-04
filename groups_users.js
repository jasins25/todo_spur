var q = require('q');
var mysql = require("mysql");
var pool = mysql.createPool({
    host: "localhost",
    port: 3306,
    user: "sindhu",
    password: "disha",
    database: "todo_list",
    connectionLimit: 4
});

function Groups_Users (id, group_id, user_id) {
    this.id = id;
    this.group_id = group_id;
    this.user_id = user_id;
}

const SAVENEWGROUPUSERSSQL = "INSERT INTO groups_users (group_id, user_id) VALUES (?,?)";
const GETGROUPUSERS = "select groups_users.user_id, users.first_name, users.last_name, users.pic_url from groups_users join users " +
                        "on groups_users.user_id=users.id where groups_users.group_id = ?";

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

Groups_Users.saveNewGroupUsers =makeQuery(SAVENEWGROUPUSERSSQL, pool);
Groups_Users.getGroupUsers = makeQuery(GETGROUPUSERS, pool);

module.exports = Groups_Users;