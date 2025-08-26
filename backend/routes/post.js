const router = require("express").Router();
const { authenticateToken } = require("./userAuth");
const { Post, Comment, Reaction } = require("../models/post");
const Follow = require("../models/follow");

// Create a post
router.post("/posts", authenticateToken, async (req, res) => {
	try {
		const { id } = req.headers;
		const { text, images, video, tags, visibility } = req.body;
		const post = await Post.create({ author: id, text, images, video, tags, visibility });
		return res.json({ status: "success", data: post });
	} catch (error) { return res.status(500).json({ message: "internal server error" }); }
});

// Feed (self + following, excluding private of others)
router.get("/posts/feed", authenticateToken, async (req, res) => {
	try {
		const { id } = req.headers;
		const following = await Follow.find({ follower: id }).select("following");
		const authors = following.map(f => String(f.following));
		authors.push(String(id));
		const posts = await Post.find({
			$or: [
				{ author: { $in: authors }, visibility: { $ne: "private" } },
				{ author: id },
			],
		}).sort({ createdAt: -1 }).limit(100).populate("author", "username avatar");
		return res.json({ status: "success", data: posts });
	} catch (error) { return res.status(500).json({ message: "internal server error" }); }
});

// React to a post (upsert)
router.post("/posts/:postId/react", authenticateToken, async (req, res) => {
	try {
		const { id } = req.headers; const { postId } = req.params; const { type } = req.body;
		const reaction = await Reaction.findOneAndUpdate(
			{ post: postId, user: id },
			{ $set: { type } },
			{ upsert: true, new: true }
		);
		return res.json({ status: "success", data: reaction });
	} catch (error) { return res.status(500).json({ message: "internal server error" }); }
});

// Remove reaction
router.delete("/posts/:postId/react", authenticateToken, async (req, res) => {
	try {
		const { id } = req.headers; const { postId } = req.params;
		await Reaction.deleteOne({ post: postId, user: id });
		return res.json({ status: "success" });
	} catch (error) { return res.status(500).json({ message: "internal server error" }); }
});

// Comment
router.post("/posts/:postId/comments", authenticateToken, async (req, res) => {
	try {
		const { id } = req.headers; const { postId } = req.params; const { text, parent } = req.body;
		const comment = await Comment.create({ post: postId, author: id, text, parent });
		return res.json({ status: "success", data: comment });
	} catch (error) { return res.status(500).json({ message: "internal server error" }); }
});

// Get comments
router.get("/posts/:postId/comments", async (req, res) => {
	try {
		const { postId } = req.params;
		const comments = await Comment.find({ post: postId }).sort({ createdAt: 1 }).populate("author", "username avatar");
		return res.json({ status: "success", data: comments });
	} catch (error) { return res.status(500).json({ message: "internal server error" }); }
});

module.exports = router;


