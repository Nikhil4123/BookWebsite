const mongoose = require("mongoose");

const blog = new mongoose.Schema(
	{
		author: { type: mongoose.Types.ObjectId, ref: "user", required: true },
		title: { type: String, required: true },
		body: { type: String, required: true },
		tags: [{ type: String }],
		coverImage: { type: String },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("blog", blog);


