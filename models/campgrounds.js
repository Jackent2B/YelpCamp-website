var mongoose =require("mongoose");
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	writer: {
		id:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		   },
		username: String

	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

// assigning a variable

module.exports = mongoose.model("Camp", campgroundSchema);