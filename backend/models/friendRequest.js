const mongoose = require("mongoose");

const friendRequest = new mongoose.Schema(
	{
		fromUser: {
			type: mongoose.Types.ObjectId,
			ref: "user",
			required: true,
		},
		toUser: {
			type: mongoose.Types.ObjectId,
			ref: "user",
			required: true,
		},
		status: {
			type: String,
			default: "pending",
			enum: ["pending", "accepted", "declined", "canceled"],
		},
	},
	{ timestamps: true }
);

friendRequest.index({ fromUser: 1, toUser: 1 }, { unique: true });

module.exports = mongoose.model("friendRequest", friendRequest);


