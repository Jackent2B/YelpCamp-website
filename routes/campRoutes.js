
// it is always needed when we make different files for different routes.
var express = require("express");
var router  = express.Router();

var Camp    = require("../models/campgrounds");
var middleware =require("../middleware/midindex");
// ==============
// VERY IMPORTANT
//now replace app. by router. because now app is replaced by router


// CREATE- add new campgrounds to database
router.post("/camp",isLoggedIn,function(req,res){
    
    // we want to get data from form and add ot to camp array.
    var name=req.body.name;
    var image=req.body.image;
    var desc=req.body.description;
    var writer= {
        id: req.user._id,
        username: req.user.username
    }
    var newcamp={name:name, image:image , description: desc, writer:writer  };
    // camp.push(newcamp);
    // create a new campground and save it to database
    Camp.create(newcamp, function(err,newlyCreated){
    	if(err){
    		console.log(err);
    	} else {

    		// redirect to camp page
            console.log(newlyCreated);
    		res.redirect("/camp");
    	}

    });
    
    // yes we have two camp routes but by default it will be treated as get route in redirect
});

// INDEX-show all campgrounds
router.get("/camp",function(req,res){
		// Get all campgrounds from DB
		Camp.find({},function(err, allCamp){
			if(err){
				console.log(err);
			} else{
				res.render("camp",{camp: allCamp, currentUser: req.user});
			}
		});
});

// NEW -show form to create new campgrounds
router.get("/camp/new",isLoggedIn,function(req,res){
    res.render("new.ejs");
});

// note that /camp/new should be declared first before /camp/:id as otherwise /camp/:id will treat /camp/new as a name of id(i.e. new).
router.get("/camp/:id",function(req,res){
	// find the campground with provided ID
	Camp.findById(req.params.id).populate("comments").exec(function(err,foundCamp){
		if(err){
			console.log(err);

		}else{
            console.log("foundCamp");
            // render show template with that campgrounds
			res.render("show",{camp: foundCamp});

		}
	});
	
});


//edit campground
router.get("/camp/:id/edit",middleware.checkCampOwner,function(req, res){
    //is user logged in?
    if(req.isAuthenticated()){

        Camp.findById(req.params.id, function(err, foundCamp){
        if(err)
            res.redirect("/camp");
        else{
            //does the user own the camp?
            //if(foundCamp.writer.id === req.user._id),they both have same values but this would not work.
            //this above "if" statement would not work because foundCamp.writer.id is an OBJECT while req.user._id is an STRING.
            //instead we will use below code:
            if(foundCamp.writer.id.equals(req.user._id)){
                res.render("edit",{ camp: foundCamp});
            }
            else
            {
                req.flash("error","You don't have permission to do that!");
            }

        }   
    });


    }else{
         req.flash("error","You need to be logged in first");
        console.log("you need to be logged in first!");
    }
    
    
});

//update campground
router.put("/camp/:id",middleware.checkCampOwner,function(req, res){
    //find and update the correct campgrounds
    Camp.findByIdAndUpdate(req.params.id, req.body.camp,function(err,updatedCamp){
           if(err)
                res.redirect("/camp")
            else
            {
                 req.flash("success","Campground updated successfully!");
                res.redirect("/camp/" + req.params.id);
            }
    });
});

//delete campground

router.delete("/camp/:id",middleware.checkCampOwner,function(req,res){
    Camp.findOneAndDelete(req.params.id, function(err){
        if(err)
            res.redirect("/camp");
        else{
             req.flash("success","Campground deleted successfully!");
            res.redirect("/camp");
        }
    });
});



//middleware
function isLoggedIn(req, res, next){
// it will check whether the user is logged in or not.
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logged in first!");
    res.redirect("/login");
}

// function checkCampOwner(req, res, next){
//     //is user logged in?
//     if(req.isAuthenticated()){

//         Camp.findById(req.params.id, function(err, foundCamp){
//         if(err)
//             res.redirect("back");
//         else{
//             //does the user own the camp?
//             //if(foundCamp.writer.id === req.user._id),they both have same values but this would not work.
//             //this above "if" statement would not work because foundCamp.writer.id is an OBJECT while req.user._id is an STRING.
//             //instead we will use below code:
//             if(foundCamp.writer.id.equals(req.user._id)){
//                 next();
//             }
//             else
//             {
//                 res.redirect("back");
//             }

//         }   
//     });


//     }else{
//         //it will take us to just previous page.
//         res.redirect("back");
//     }
// }

module.exports = router;