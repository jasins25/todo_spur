var mysql = require("mysql");
var q = require("q");

var pool = mysql.createPool({
    host: "localhost",
    user: "sindhu",
    password: "disha",
    database: "sakila",
    port: 3306,
    connectionLimit: 4
});

