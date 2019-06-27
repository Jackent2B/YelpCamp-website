//all the middlewares goes here
var Camp = require("../models/campgrounds");
var Comment = require("../models/comment");
var middlewareObj = {};

//checking camp ownership
middlewareObj.checkCampOwner = function(req, res, next){
    //is user logged in?
    if(req.isAuthenticated()){

        Camp.findById(req.params.id, function(err, foundCamp){
        if(err){
        	req.flash("error","campground not found");
            res.redirect("back");
        }
        else{
            //does the user own the camp?
            //if(foundCamp.writer.id === req.user._id),they both have same values but this would not work.
            //this above "if" statement would not work because foundCamp.writer.id is an OBJECT while req.user._id is an STRING.
            //instead we will use below code:
            if(foundCamp.writer.id.equals(req.user._id)){
                next();
            }
            else
            {
            	req.flash("error","you don't have permission to do that!");
                res.redirect("back");
            }

        }   
    });


		    }else{
		    	req.flash("error","you need to be logged in first!");
		        //it will take us to just previous page.
		        res.redirect("back");
		    }
		}





//check ownership of comment
middlewareObj.checkCommentOwner  = function(req, res, next){
    //is user logged in?
    if(req.isAuthenticated()){

        Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
        	req.flash("error","comment not found");
            res.redirect("back");
        }
        else{
            //does the user own the camp?
            //if(foundCamp.writer.id === req.user._id),they both have same values but this would not work.
            //this above "if" statement would not work because foundCamp.writer.id is an OBJECT while req.user._id is an STRING.
            //instead we will use below code:
            if(foundComment.writer.id.equals(req.user._id)){
                next();
            }
            else
            {
            	req.flash("error","you don't have permission to do that!");
                res.redirect("back");
            }

        }   
    });
            }else{
            		req.flash("error","you need to be logged in first!");
                    //it will take us to just previous page.
                    res.redirect("back");
                }
            }







module.exports = middlewareObj;