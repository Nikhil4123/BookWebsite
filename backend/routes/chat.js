const router = require("express").Router();
const { authenticateToken } = require("./userAuth");
const { Conversation, Message } = require("../models/chat");

// Create or get 1:1 conversation
router.post("/chat/ensure", authenticateToken, async (req, res) => {
	try {
		const { id } = req.headers;
		const { targetUserId } = req.body;
		let convo = await Conversation.findOne({ isGroup: false, participants: { $all: [id, targetUserId] } });
		if (!convo) {
			convo = await Conversation.create({ isGroup: false, participants: [id, targetUserId] });
		}
		return res.json({ status: "success", data: convo });
	} catch (error) { return res.status(500).json({ message: "internal server error" }); }
});

// Send message
router.post("/chat/:conversationId/message", authenticateToken, async (req, res) => {
	try {
		const { id } = req.headers;
		const { conversationId } = req.params;
		const { content, attachments } = req.body;
		const msg = await Message.create({ chatId: conversationId, sender: id, content, attachments });
		await Conversation.findByIdAndUpdate(conversationId, { lastMessageAt: new Date() });
		// Realtime fanout
		const io = req.app.locals.io;
		const onlineUsers = req.app.locals.onlineUsers;
		const conversation = await Conversation.findById(conversationId);
		for (const participant of conversation.participants) {
			const sid = onlineUsers.get(String(participant));
			if (sid) io.to(sid).emit("chat:message", { conversationId, message: msg });
		}
		return res.json({ status: "success", data: msg });
	} catch (error) { return res.status(500).json({ message: "internal server error" }); }
});

// Fetch messages
router.get("/chat/:conversationId/messages", authenticateToken, async (req, res) => {
	try {
		const { conversationId } = req.params;
		const messages = await Message.find({ chatId: conversationId }).sort({ createdAt: -1 }).limit(100);
		return res.json({ status: "success", data: messages.reverse() });
	} catch (error) { return res.status(500).json({ message: "internal server error" }); }
});

module.exports = router;


