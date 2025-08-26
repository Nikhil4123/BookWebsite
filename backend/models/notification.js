const mongoose = require("mongoose");

const notification = new mongoose.Schema(
	{
		user: { type: mongoose.Types.ObjectId, ref: "user", required: true },
		fromUser: { type: mongoose.Types.ObjectId, ref: "user" },
		type: { type: String, enum: ["follow", "friend_request", "comment", "reaction", "message", "book_approval", "book_approved", "book_rejected"], required: true },
		refId: { type: mongoose.Types.ObjectId },
		meta: { type: Object, default: {} },
		read: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("notification", notification);


