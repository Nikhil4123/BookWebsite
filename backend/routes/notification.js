const router = require("express").Router();
const { authenticateToken } = require("./userAuth");
const Notification = require("../models/notification");

router.get("/notifications", authenticateToken, async (req, res) => {
	try {
		const { id } = req.headers;
		const items = await Notification.find({ user: id }).sort({ createdAt: -1 }).limit(100).populate("fromUser", "username avatar");
		return res.json({ status: "success", data: items });
	} catch (error) { return res.status(500).json({ message: "internal server error" }); }
});

router.post("/notifications/mark-read", authenticateToken, async (req, res) => {
	try { const { id } = req.headers; await Notification.updateMany({ user: id, read: false }, { $set: { read: true } }); return res.json({ status: "success" }); }
	catch (error) { return res.status(500).json({ message: "internal server error" }); }
});

module.exports = router;


