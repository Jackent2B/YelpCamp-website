var mongoose = require("mongoose");


var commentSchema = new mongoose.Schema({
	text: String,
    //writer: String
    //we are changing the datatype of writer given above with the one given below.    
    //we are doing so, so that we don't have to writer name while making new comment, it can come automatically on its own. 
    writer: {
    	id: {
    		type: mongoose.Schema.Types.ObjectId,
    		ref: "User"
    //here User is the name of the model we are referring to.
    		},
   		username: String
    }
});

module.exports = mongoose.model("Comment", commentSchema);
