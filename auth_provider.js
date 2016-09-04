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

function Auth_Provider(id, provider_id, user_id, email, first_name, last_name, gender, photo, access_token, provider) {
    this.id = id;
    this.provider_id = provider_id;
    this.user_id = user_id;
    this.email = email;
    this.first_name = first_name;
    this.last_name = last_name;
    this.gender = gender;
    this.photo = photo;
    this.access_token = access_token;
    this.provider = provider;
}

const SAVEUSERSQL = "INSERT INTO authentication_provider (provider_id, email, first_name, last_name, gender, photo, access_token, provider) VALUES (?,?,?,?,?,?,?,?)";
const FINDUSERSQL = "SELECT id, user_id FROM authentication_provider WHERE email = ?";
const UPDATEUSERID = "UPDATE authentication_provider SET user_id = ? WHERE id = ?";
const READUSERSQL = "SELECT id, email, first_name, last_name, gender FROM authentication_provider WHERE id = ?";

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
Auth_Provider.findUserSocialProfile = makeQuery(FINDUSERSQL, pool);
Auth_Provider.updateUserId = makeQuery(UPDATEUSERID, pool);
Auth_Provider.readUserSocialProfile = makeQuery(READUSERSQL, pool);
module.exports = Auth_Provider;