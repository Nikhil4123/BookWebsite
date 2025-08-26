const mongoose = require("mongoose");

const message = new mongoose.Schema(
	{
		chatId: { type: mongoose.Types.ObjectId, ref: "conversation", required: true },
		sender: { type: mongoose.Types.ObjectId, ref: "user", required: true },
		content: { type: String, default: "" },
		attachments: [{ type: String }],
		seenBy: [{ type: mongoose.Types.ObjectId, ref: "user" }],
	},
	{ timestamps: true }
);

const conversation = new mongoose.Schema(
	{
		isGroup: { type: Boolean, default: false },
		participants: [{ type: mongoose.Types.ObjectId, ref: "user" }],
		name: { type: String },
		lastMessageAt: { type: Date, default: Date.now },
	},
	{ timestamps: true }
);

module.exports = {
	Message: mongoose.model("message", message),
	Conversation: mongoose.model("conversation", conversation),
};


