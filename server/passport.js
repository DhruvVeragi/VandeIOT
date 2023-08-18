const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.serializeUser((user, done) => {
    done(null, user);
})
passport.deserializeUser(function (user, done) {
    done(null, user);
});


passport.use(new GoogleStrategy({
    clientID: "56872273873-vhgsll3031aqu9p4vo9jtt9tpci3s2vh.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:5000/auth/callback",
    passReqToCallback: true
},
    function (request, accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));
