var sha1 = require("sha1");
var LocalStrategy = require("passport-local").Strategy;
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
var FacebookStrategy = require("passport-facebook").Strategy;

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
                if(!user) {
                    return done(null, false);
                }
                else {
                    return done(null, user);
                }
            })
            .catch(function (err) {
                return done(err, null)
            });            
    }
    
    function verifyCallBack(accessToken, refreshToken, profile, done) {
        console.log("Access Token", accessToken);
        console.log("Refresh Token", refreshToken);
        console.log("Profile info", profile.emails[0].value);

        done(null, profile);
        // id = profile.id;
        // email = profile.emails[0].value;
        //
        // displayName = profile.displayName;
        // provider_type = profile.provider;
        // photo = profile.photos[0].value;
        //
        // User.findUserByEmail([email])
        //     .then(function (result) {
        //         if(result) {
        //             user_id = result.id;
        //             Auth_Provider.saveUserSocialProfile([id, user_id, provider_type])
        //                 .then(function (result) {
        //                     return done(null, profile);
        //                 })
        //                 .catch(function (err) {
        //
        //                 });
        //         }
        //         else {
        //             User.saveUserSocialProfile([])
        //                 .then(function (result) {
        //                     user_id = insertId;
        //                     Auth_Provider.saveUserSocialProfile([id, user_id, provider_type])
        //                         .then()
        //                         .catch();
        //                 })
        //         }
        //     })
        //     .catch(function (err) {
        //
        //     });

        
    }
    
    passport.use(new LocalStrategy({
                usernameField: "email",
                passwordField: "password"
            }, authenticate));

    passport.use(new GoogleStrategy({
        clientID: '847035918256-a2vutf84pfttvod9irbeleenjuu7h417.apps.googleusercontent.com',
        clientSecret: '-9_CMHQ2JW8xQC-JPTqtZllI',
        callbackURL: 'http://localhost:3000/oauth/google/callback'
    }, verifyCallBack));

    passport.use(new FacebookStrategy({
        clientID: '1760687727480183',
        clientSecret: 'b181cca24cbfee44cac0302f2f232d53',
        callbackURL: 'http://localhost:3000/oauth/facebook/callback'
    }, verifyCallBack));
    
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
