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
const READUSERSQL = "SELECT id, email, first_name, last_name, gender, date_of_birth, country, photo FROM users WHERE id = ?";
const FINDUSERIDSQL = "SELECT id FROM users WHERE email = ?";
//const UPLOADIMGSQL = "UPDATE users SET picture = ? WHERE user_id = ?";

var makeQuery = function (sql, pool) {
    return function (args) {

        var defer = q.defer();

        pool.getConnection(function (err, connection) {
            if (err) {
                return defer.reject(err);
            }
            console.log(args);
            connection.query(sql, args || [], function (err, result) {
                connection.release();
                if (err) {
                    // database error
                    return defer.reject(err);
                }
                console.log("result:", result);
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
//User.prototype.uploadImg = makeQuery(UPLOADIMGSQL, pool);

module.exports = User;



