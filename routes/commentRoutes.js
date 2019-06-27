var express = require("express");
var router  = express.Router();
var Camp    = require("../models/campgrounds");
var Comment = require("../models/comment");
var middleware = require("../middleware/midindex");
// ======================
// COMMENT ROUTES
// ======================
router.get("/camp/:id/comments/new",isLoggedIn,function(req,res){
    // find camp through id
    Camp.findById(req.params.id, function(err, camp){
        if(err)
            console.log(err);
        else
            res.render("newComment.ejs",{camp: camp});
    });
});


router.post("/camp/:id/comments",isLoggedIn,function(req,res){
    Camp.findById(req.params.id, function(err,camp){
        if(err){
            console.log(err);
            res.redirect("/camp");
        }
        else{
            var writer= req.body.writer;
            var text= req.body.text;
            var newcomment ={text: text,writer: writer};
            Comment.create(newcomment, function(err,newcomment){
                if(err){
                    console.log(err);

                } else {
                    //add username and id to comment
                    newcomment.writer.id = req.user._id;
                    newcomment.writer.username= req.user.username;
                    //save comment
                    newcomment.save();
                    camp.comments.push(newcomment);
                    camp.save();
                    console.log(newcomment);
                    req.flash("success","Successfully added comment!");
                    res.redirect("/camp/" + camp._id);
                }

            });
         }

    });
});

//edit comment
router.get("/camp/:id/comments/:comment_id/edit",middleware.checkCommentOwner,function(req,res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err)
            res.redirect("back");
        else
        {
            req.flash("success","Wohoo! Comment edited Successfully!");
            res.render("editCom",{campId: req.params.id, comment: foundComment});
        }
    });
   
});

//update comment
router.put("/camp/:id/comments/:comment_id",middleware.checkCommentOwner,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err, updatedComment){
        if(err)
            res.redirect("back");
        else
        {
            req.flash("success","Comment updated successfully!");
            res.redirect("/camp/" + req.params.id);
        }
    });
});

//destroy comment
router.delete("/camp/:id/comments/:comment_id",middleware.checkCommentOwner,function(req,res){
     Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err)
            res.redirect("back");
        else
            {req.flash("success","Comment deleted Successfully");
            res.redirect("/camp/" + req.params.id);
        }
    });
});

//middleware
function isLoggedIn(req, res, next){
// it will check whether the user is logged in or not.
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logged in first");
    res.redirect("/login");
}


// //check ownership of comment
// function checkCommentOwner(req, res, next){
//     //is user logged in?
//     if(req.isAuthenticated()){

//         Comment.findById(req.params.comment_id, function(err, foundComment){
//         if(err)
//             res.redirect("back");
//         else{
//             //does the user own the camp?
//             //if(foundCamp.writer.id === req.user._id),they both have same values but this would not work.
//             //this above "if" statement would not work because foundCamp.writer.id is an OBJECT while req.user._id is an STRING.
//             //instead we will use below code:
//             if(foundComment.writer.id.equals(req.user._id)){
//                 next();
//             }
//             else
//             {
//                 res.redirect("back");
//             }

//         }   
//     });
//             }else{
//                     //it will take us to just previous page.
//                     res.redirect("back");
//                 }
//             }

module.exports = router;