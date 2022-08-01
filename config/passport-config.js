
const LocalStrategy = require("passport-local").Strategy;

const bcrypt = require("bcrypt");

const User = require("../models/User");

function init_passport_local(passport) {

    passport.use(
        new LocalStrategy(
            {usernameField:"email"},

            async function verifyCredentials(email,password,done) {
                try{
                    console.log("Strats")
                    const user = await User.findOne({email:email}); // Get user from db

                    console.log(user);

                    if(!user) { // user not found in db (findOne returned null for this to happen)
                        return done(null, false, {message: "That email is not registered!"});
                    }

                    const match = await bcrypt.compare(password, user.password); // Compare entered password with hashed database password

                    if(!match) { // Password doesn't match
                        return done(null, false, {message: "That password is incorrect!"});
                    }

                    return done(null, user); // Successful auth
                }
                catch(e) { // Catch mongoose or bcrypt error here, end process with generic error
                    console.error(e);
                    done(e, false);
                }
            }
        )
    );

    passport.serializeUser( (user, done) => {
        console.log("Cereal")
        done(null, user.id);
    });

    passport.deserializeUser( async (id,done) => {
        console.log("Decereal")
        try{
            const user = await User.findById(id);
            done(null, user);
        }
        catch(e) {
            console.error(e);
            done(e);
        }
    });

}

module.exports = init_passport_local;