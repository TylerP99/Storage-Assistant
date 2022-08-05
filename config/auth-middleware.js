// Middleware to forward user if they are already authenticated and to ensure user is authenticated to access routes
module.exports = {
    ensureAuthenticated: (req,res,next) => {
        if(req.isAuthenticated()) {
            return next();
        }
        res.redirect("/login");
    },
    forwardIfAuthenticated: (req,res,next) => {
        if(!req.isAuthenticated()) {
            return next();
        }
        res.redirect("/dashboard");
    }
};