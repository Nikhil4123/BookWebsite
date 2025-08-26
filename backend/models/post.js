const mongoose = require("mongoose");

const post = new mongoose.Schema(
	{
		author: { type: mongoose.Types.ObjectId, ref: "user", required: true },
		text: { type: String, default: "" },
		images: [{ type: String }],
		video: { type: String },
		tags: [{ type: String }],
		visibility: { type: String, enum: ["public", "followers", "private"], default: "public" },
	},
	{ timestamps: true }
);

const comment = new mongoose.Schema(
	{
		post: { type: mongoose.Types.ObjectId, ref: "post", required: true },
		author: { type: mongoose.Types.ObjectId, ref: "user", required: true },
		text: { type: String, required: true },
		parent: { type: mongoose.Types.ObjectId, ref: "comment" },
	},
	{ timestamps: true }
);

const reaction = new mongoose.Schema(
	{
		post: { type: mongoose.Types.ObjectId, ref: "post", required: true },
		user: { type: mongoose.Types.ObjectId, ref: "user", required: true },
		type: { type: String, enum: ["like", "love", "insightful", "funny"], default: "like" },
	},
	{ timestamps: true }
);

reaction.index({ post: 1, user: 1 }, { unique: true });

module.exports = {
	Post: mongoose.model("post", post),
	Comment: mongoose.model("comment", comment),
	Reaction: mongoose.model("reaction", reaction),
};


