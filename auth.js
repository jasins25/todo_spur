var sha1 = require("sha1");
var LocalStrategy = require("passport-local").Strategy;

var User = require("./user.js");

module.exports = function (passport) {
    function authenticate(username, password, done) {
        console.log("username", username);
        console.log("password", password);
        password = sha1(password);
        console.log("password", password);

        User.findUser([username, password])
            .then(function (results) {
                var user = results[0];
                if(user) {
                    return done(null, user);
                }
                else {
                    return done(null, false);
                }
            })
            .catch(function (err) {
                return done(err, null)
            });
        //     function (err, results) {
        //     if(err) {
        //         done(err, null);
        //     }
        //     var user = results[0];
        //     if(user) {
        //         return done(null, user);
        //     }
        //     done(err, null);
        // });
            
    }
    passport.use(new LocalStrategy({
                usernameField: "email",
                passwordField: "password"
            }, authenticate));

    passport.serializeUser(function (user, done) {
        done(null, user.id);

    });

    passport.deserializeUser(function (id, done) {
        User.readUser([id])
            .then(function (results) {
                var user = results[0];
                if(user) {
                    return done(null, user);
                }
                done(err, null);
            })
            .catch(function (err) {
                done(err, null)
            });
    });

};
