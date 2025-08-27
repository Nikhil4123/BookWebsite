const router = require("express").Router();
const { authenticateToken } = require("./userAuth");
const Blog = require("../models/blog");

// Create blog
router.post("/blogs", authenticateToken, async (req, res) => {
	try {
		const { id } = req.headers;
		const { title, body, tags, coverImage } = req.body;
		const blog = await Blog.create({ author: id, title, body, tags, coverImage });
		return res.json({ status: "success", data: blog });
	} catch (error) { return res.status(500).json({ message: "internal server error" }); }
});

// Update blog (owner only)
router.put("/blogs/:blogId", authenticateToken, async (req, res) => {
	try {
		const { id } = req.headers; const { blogId } = req.params;
		const blog = await Blog.findOneAndUpdate({ _id: blogId, author: id }, req.body, { new: true });
		if (!blog) return res.status(404).json({ message: "Not found" });
		return res.json({ status: "success", data: blog });
	} catch (error) { return res.status(500).json({ message: "internal server error" }); }
});

// List blogs
router.get("/blogs", async (req, res) => {
	try {
		const { tag, author, search } = req.query;
		const query = {};
		if (tag) query.tags = tag; 
		if (author) query.author = author;
		if (search) {
			query.$or = [
				{ title: { $regex: search, $options: 'i' } },
				{ body: { $regex: search, $options: 'i' } },
				{ tags: { $in: [new RegExp(search, 'i')] } }
			];
		}
		const blogs = await Blog.find(query).sort({ createdAt: -1 }).limit(50).populate("author", "username avatar");
		return res.json({ status: "success", data: blogs });
	} catch (error) { return res.status(500).json({ message: "internal server error" }); }
});

// Search blogs
router.get("/blogs/search", async (req, res) => {
	try {
		const { q } = req.query;
		if (!q) {
			return res.json({ status: "success", data: [] });
		}
		const query = {
			$or: [
				{ title: { $regex: q, $options: 'i' } },
				{ body: { $regex: q, $options: 'i' } },
				{ tags: { $in: [new RegExp(q, 'i')] } }
			]
		};
		const blogs = await Blog.find(query).sort({ createdAt: -1 }).limit(20).populate("author", "username avatar");
		return res.json({ status: "success", data: blogs });
	} catch (error) { return res.status(500).json({ message: "internal server error" }); }
});

module.exports = router;


