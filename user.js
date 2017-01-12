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

function User(id, email, password, password_original, firstName, lastName, gender, country, dateOfBirth, photo) {
    this.user_id = id;
    this.email = email;
    this.password = password;
    this.password_original = password_original;
    this.firstName = firstName;
    this.lastName = lastName;
    this.gender = gender;
    this.country = country;
    this.dateOfBirth = dateOfBirth;
    this.picture = photo;
}

const FINDUSERSQL = "select * from users where email = ? and password = ?";
const SAVENEWUSERSQL = "INSERT INTO users (email, password, password_original, first_name, last_name, gender, country, date_of_birth, photo) " +
                        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
const READUSERSQL = "SELECT id, email, first_name, last_name, gender, date_of_birth, country, photo, pic_url FROM users WHERE id = ?";
const FINDUSERIDSQL = "SELECT id FROM users WHERE email = ?";
const FINDUSERIDSSQL = "SELECT id FROM users WHERE email IN (?)";
const FINDUSERBYEMAILSQL = "SELECT id FROM users WHERE email = ?";
const SAVEUSERSOCIALPROFILESQL = "INSERT INTO users (email, first_name, last_name, gender) VALUES (?,?,?,?)";
const SAVEEDITUSERSQL = "UPDATE users SET email=?, first_name=?, last_name=?, gender=?, date_of_birth=?, country=? WHERE id = ?";
const DELETEUSERSQL = "UPDATE users SET disabled = 1 WHERE id = ?";
//const UPLOADIMGSQL = "UPDATE users SET picture = ? WHERE user_id = ?";

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

User.findUser = makeQuery(FINDUSERSQL, pool);
User.prototype.saveNewUser = makeQuery(SAVENEWUSERSQL, pool);
User.readUser = makeQuery(READUSERSQL, pool);
User.findUserId = makeQuery(FINDUSERIDSQL, pool);
User.findUserIds = makeQuery(FINDUSERIDSSQL, pool);
User.findUserByEmail = makeQuery(FINDUSERBYEMAILSQL, pool);
User.saveUserSocialProfile = makeQuery(SAVEUSERSOCIALPROFILESQL, pool);
User.saveEditUser = makeQuery(SAVEEDITUSERSQL, pool);
User.deleteuser = makeQuery(DELETEUSERSQL, pool);
//User.prototype.uploadImg = makeQuery(UPLOADIMGSQL, pool);




module.exports = User;



