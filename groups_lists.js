var mysql = require("mysql");
var q = require("q");

var pool = mysql.createPool({
    host: "localhost",
    user: "sindhu",
    password: "disha",
    database: "todo_list",
    port: 3306,
    connectionLimit: 4
});

function Group_Lists(group_id, group_name, list_name) {
    this.group_id = group_id;
    this.group_name = group_name;
    this.list_name = list_name;
}

//const GROUPLISTJOINSQL = "SELECT groups.id, groups.name, lists.name FROM groups JOIN lists " +
//                            "ON groups.id = lists.group_id WHERE groups.creator_id = ?;";
const LISTSINAGROUP = "SELECT groups.id, groups.name, COUNT(DISTINCT lists.id) AS 'NoOfLists', COUNT(DISTINCT groups_users.id) AS 'NoOfUsers' " +
                        "FROM groups JOIN lists ON (groups.id = lists.group_id) " +
                        "JOIN groups_users ON (groups.id = groups_users.group_id) " +
                        "WHERE groups.creator_id = ? GROUP BY groups.name;";
const LISTSINAGROUPIMIN = "select distinct groups_users.group_id, " +
                            "count(IF(lists_users.user_id != ?, NULL, lists.id)) as 'NoOfLists', " +
                                "groups.name " +
                            "from groups_users join lists on groups_users.group_id = lists.group_id " +
                            "join lists_users on lists.id = lists_users.list_id " +
                            "join groups on groups_users.group_id = groups.id " +
                            "where groups_users.user_id = ? group by group_id";
const CREATEDGROUPS = "select groups.id, groups.name, COUNT(DISTINCT groups_users.id) AS 'NoOfUsers' from groups, groups_users " +
                        "where groups.creator_id = ? AND  groups.id = groups_users.group_id GROUP BY groups.name;";
const SAVENEWLIST = "INSERT INTO lists (lists.group_id, lists.name) VALUES (?, ?)";

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

Group_Lists.ListsInAGroups = makeQuery(LISTSINAGROUP, pool);
Group_Lists.ListsInAGroupImIn = makeQuery(LISTSINAGROUPIMIN, pool);
Group_Lists.createdGroups = makeQuery(CREATEDGROUPS, pool);
Group_Lists.saveNewList = makeQuery(SAVENEWLIST, pool);
module.exports = Group_Lists;