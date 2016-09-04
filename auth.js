var sha1 = require("sha1");
var LocalStrategy = require("passport-local").Strategy;
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
var FacebookStrategy = require("passport-facebook").Strategy;

var User = require("./user.js");
var Auth_Provider = require("./auth_provider.js");

// var api_key = 'key-17f3f08cef542c273092100b3070d6fe';
// var domain = 'sandboxb9149de8fd394077a7ceb49d6f093ffd.mailgun.org';
// var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

module.exports = function (passport) {
    function authenticate(username, password, done) {
        console.log("Local strategy login begins");
        password = sha1(password);
        var userObj = {};

        //Saving User details in DB
        User.findUser([username, password])
            .then(function (results) {
                var user = results[0];
                if(user && (user.enabled==1)) {
                    userObj = {
                        id: user.id,
                        provider: "local"
                    };
                    return done(null, userObj);
                }
                else {
                    return done(false, null);
                }
            })
            .catch(function (err) {
                return done(err, null)
            });

        // //Send verification email
        // var d = new Date();
        // var toHash = username.concat(d);
        // var verify_token = sha1(toHash);
        // var data = {
        //     from: 'Todo App <me@samples.mailgun.org>',
        //     to: username,
        //     subject: '[Todo APP] Activate your Account',
        //     text: 'Thank you for using Todo App. Please activate the link by clicking the link below. '
        // };
        //
        // mailgun.messages().send(data, function (error, body) {
        //     console.log(body);
        // });
    }
    
    function verifyCallBack(accessToken, refreshToken, profile, done) {
        console.log(profile.provider+" strategy returned value:");

        //done(null, profile);
        
        var provider_id = profile.id;
        var email = profile.emails[0].value;

        var first_name = profile.name.givenName;
        var last_name = profile.name.familyName;
        var gender = "";
        if(profile.gender == 'male'){
            gender = 'M';
        }
        if(profile.gender == 'female'){
            gender = 'F';
        }
        var provider = profile.provider;
        var photo = profile.photos[0].value;
        var userObj = {};
        
        Auth_Provider.findUserSocialProfile([email])
            .then(function (results) {
                //If user's social profile does not exists
                if(!results[0]){
                    console.log("User's social profile does not exist");
                    //Save user's social profile in authentication_provider
                    Auth_Provider.saveUserSocialProfile([provider_id, email, first_name, last_name, gender, photo, accessToken, provider])
                        .then(function (result) {
                            console.log("User's social profile saved in authentication_provider table");
                            //Check user has already signed using local strategy
                            User.findUserByEmail([email])
                                .then(function (resultId) {
                                    //if yes
                                    if(resultId[0]){
                                        var userObj = {
                                            id: resultId[0].id,
                                            provider: "local"
                                        };
                                        //update user_id as foreign key
                                        Auth_Provider.updateUserId([user_id, result.insertId])
                                            .then(function (res) {
                                                return done(null, userObj);     //pass user_id to serializeUser
                                            })
                                            .catch(function (err) {
                                                return done(err, null);
                                            });
                                    }
                                    //If no
                                    else{
                                        console.log("User social profile already exists in authentication_provider table");
                                        userObj = {
                                            id: result.insertId,
                                            provider: provider
                                        };
                                        return done(null, userObj);     //pass authentication_provider.id to serializeUser
                                    }
                                })
                                .catch(function (err) {
                                    return done(err, null);
                                });
                        })
                        .catch(function (err) {
                            console.log("User's social profile cannot be saved in authentication_provider table");
                            return done(err, null);
                        });
                }
                //If user's social profile already exists
                else {
                    //user_id is not null
                    if(results[0].user_id){
                        userObj = {
                            id: results[0].user_id,
                            provider: "local"
                        };
                        return done(null, userObj);
                    }
                    //if user_id is null
                    else{
                        userObj = {
                            id: results[0].id,
                            provider: provider
                        };
                        return done(null, userObj);
                    }
                }
            })
            .catch(function (err) {
                return done(err, null);
            });        
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
        callbackURL: 'http://localhost:3000/oauth/facebook/callback',
        profileFields: ['id', 'email', 'first_name', 'last_name', 'gender', 'picture']
    }, verifyCallBack));
    
    passport.serializeUser(function (user, done) {
        done(null, user);

    });

    passport.deserializeUser(function (user, done) {
        if(user.provider == "local"){
            //Get user details from users table
            User.readUser([user.id])
                .then(function (results) {
                    var user = results[0];
                    if(user) {
                        return done(null, user);
                    }
                    done(false, null);
                })
                .catch(function (err) {
                    done(err, null)
                });
        }
        else{
            //Get user details from authentication_provider table
            Auth_Provider.readUserSocialProfile([user.id])
                .then(function (results) {
                    var user = results[0];
                    if(user) {
                        return done(null, user);
                    }
                    done(false, null);
                })
                .catch(function (err) {
                    done(err, null)
                });
        }
        
    });

};
