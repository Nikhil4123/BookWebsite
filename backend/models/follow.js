const mongoose = require("mongoose");

const follow = new mongoose.Schema(
	{
		follower: { type: mongoose.Types.ObjectId, ref: "user", required: true },
		following: { type: mongoose.Types.ObjectId, ref: "user", required: true },
	},
	{ timestamps: true }
);

follow.index({ follower: 1, following: 1 }, { unique: true });

module.exports = mongoose.model("follow", follow);


