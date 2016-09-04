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

function Group(id, name, creator) {
    this.id = id;
    this.name = name;
    this.creator_id = creator;
}

const SAVENEWGROUPSQL = "INSERT INTO groups (name, creator_id) VALUES (?,?)";

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

Group.prototype.saveNewGroup = makeQuery(SAVENEWGROUPSQL, pool);

module.exports = Group;