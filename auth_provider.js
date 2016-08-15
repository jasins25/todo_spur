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

function Auth_Provider(id, provider_id, user_id, provider_type) {
    this.id = id;
    this.provider_id = provider_id;
    this.user_id = user_id;
    this.provider_type = provider_type;
}

const SAVEUSERSQL = "INSERT INTO authentication_provider (provider_id, user_id, provider_type) VALUES (?,?,?)";

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

Auth_Provider.saveUserSocialProfile = makeQuery(SAVEUSERSQL, pool);

module.exports = Auth_Provider;