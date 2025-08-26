const router = require("express").Router();
const { authenticateToken } = require("./userAuth");
const User = require("../models/user");
const Follow = require("../models/follow");
const FriendRequest = require("../models/friendRequest");

// Follow a user
router.post("/follow/:targetId", authenticateToken, async (req, res) => {
	try {
		const { id } = req.headers;
		const { targetId } = req.params;
		if (id === targetId) return res.status(400).json({ message: "Cannot follow yourself" });
		await Follow.create({ follower: id, following: targetId });
		return res.json({ status: "success" });
	} catch (error) {
		if (error.code === 11000) return res.status(200).json({ message: "Already following" });
		return res.status(500).json({ message: "internal server error" });
	}
});

// Unfollow
router.delete("/follow/:targetId", authenticateToken, async (req, res) => {
	try {
		const { id } = req.headers;
		const { targetId } = req.params;
		await Follow.deleteOne({ follower: id, following: targetId });
		return res.json({ status: "success" });
	} catch (error) {
		return res.status(500).json({ message: "internal server error" });
	}
});

// Send friend request
router.post("/friends/request/:targetId", authenticateToken, async (req, res) => {
	try {
		const { id } = req.headers;
		const { targetId } = req.params;
		if (id === targetId) return res.status(400).json({ message: "Cannot send to yourself" });
		const fr = await FriendRequest.findOneAndUpdate(
			{ fromUser: id, toUser: targetId },
			{ $setOnInsert: { status: "pending" } },
			{ upsert: true, new: true }
		);
		return res.json({ status: "success", data: fr });
	} catch (error) {
		return res.status(500).json({ message: "internal server error" });
	}
});

// Accept friend request
router.post("/friends/accept/:requestId", authenticateToken, async (req, res) => {
	try {
		const { id } = req.headers;
		const { requestId } = req.params;
		const fr = await FriendRequest.findById(requestId);
		if (!fr || String(fr.toUser) !== String(id)) return res.status(404).json({ message: "Request not found" });
		fr.status = "accepted";
		await fr.save();
		return res.json({ status: "success" });
	} catch (error) {
		return res.status(500).json({ message: "internal server error" });
	}
});

// Decline friend request
router.post("/friends/decline/:requestId", authenticateToken, async (req, res) => {
	try {
		const { id } = req.headers;
		const { requestId } = req.params;
		const fr = await FriendRequest.findById(requestId);
		if (!fr || String(fr.toUser) !== String(id)) return res.status(404).json({ message: "Request not found" });
		fr.status = "declined";
		await fr.save();
		return res.json({ status: "success" });
	} catch (error) {
		return res.status(500).json({ message: "internal server error" });
	}
});

// List followers/following
router.get("/followers/:userId", authenticateToken, async (req, res) => {
	try {
		const { userId } = req.params;
		const followers = await Follow.find({ following: userId }).populate("follower", "username avatar");
		return res.json({ status: "success", data: followers });
	} catch (error) { return res.status(500).json({ message: "internal server error" }); }
});

router.get("/following/:userId", authenticateToken, async (req, res) => {
	try {
		const { userId } = req.params;
		const following = await Follow.find({ follower: userId }).populate("following", "username avatar");
		return res.json({ status: "success", data: following });
	} catch (error) { return res.status(500).json({ message: "internal server error" }); }
});

// Pending friend requests for me
router.get("/friends/pending", authenticateToken, async (req, res) => {
	try {
		const { id } = req.headers;
		const pending = await FriendRequest.find({ toUser: id, status: "pending" }).populate("fromUser", "username avatar");
		return res.json({ status: "success", data: pending });
	} catch (error) { return res.status(500).json({ message: "internal server error" }); }
});

module.exports = router;


