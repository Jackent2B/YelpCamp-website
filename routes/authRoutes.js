var express   = require("express");
var router    = express.Router();
var passport  = require("passport");
var User      = require("../models/user");


router.get("/",function(req,res){
    res.render("landing");
});


//===========
//AUTH ROUTES
//===========

//Register Routes

// show sign up form
router.get("/register", function(req,res){
    res.render("register.ejs");
});

// handling user sign up 
router.post("/register",function(req,res){
        var newUser = new User({username: req.body.username});

        User.register(new User({username: req.body.username}),req.body.password,function(err, user){
            if(err){
                req.flash("error",err.message);
                return res.render("register");
            }
            passport.authenticate("local")(req, res, function(){
                req.flash("success","Welcome to Yelpcamp " + user.username);
                res.redirect("/camp");
            });
        });
});


//Login Routes
router.get("/login",function(req,res){
    res.render("login.ejs");
})

router.post("/login",passport.authenticate("local",
    {successRedirect: "/camp",
     failureRedirect: "/login"
    }),function(req,res){

});


// LOGOUT routes

router.get("/logout",function(req,res){
// .logout() is a pre-defined function in passport.
    req.logout();
    req.flash("success","You have successfully logged out!");
    res.redirect("/camp");
});

function isLoggedIn(req, res, next){
// it will check whether the user is logged in or not.
    if(req.isAuthenticated()){
        return next();
    }
    else{
    req.flash("error","you need to login first!")
    res.redirect("/login");
    }
}

module.exports = router;