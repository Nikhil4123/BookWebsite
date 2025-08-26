const router = require("express").Router();
const { authenticateToken } = require("./userAuth");
const Listing = require("../models/listing");
const ProposedBook = require("../models/proposedBook");
const Book = require("../models/book");
const User = require("../models/user");

// Create resale listing (goes active immediately)
router.post("/market/listings/resale", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { bookRef, price, condition, deliveryOptions, location, photos, notes, complianceAck } = req.body;
    if (!complianceAck) return res.status(400).json({ message: "Compliance acknowledgment required" });
    const book = await Book.findById(bookRef);
    if (!book) return res.status(404).json({ message: "Book not found" });
    const listing = await Listing.create({
      type: "resale", seller: id, bookRef, price, condition, deliveryOptions, location, photos, notes, complianceAck, status: "active",
    });
    return res.json({ status: "success", data: listing });
  } catch (error) { return res.status(500).json({ message: "internal server error" }); }
});

// Create original listing (requires verification)
router.post("/market/listings/original", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { title, authorName, isbn, language, desc, coverUrl, docs, price, deliveryOptions, location, photos, notes, complianceAck } = req.body;
    if (!complianceAck) return res.status(400).json({ message: "Compliance acknowledgment required" });
    const proposed = await ProposedBook.create({ title, authorName, isbn, language, desc, coverUrl, submittedBy: id, docs, status: "pending" });
    const listing = await Listing.create({
      type: "original", seller: id, proposedBook: proposed._id, price, condition: "new", deliveryOptions, location, photos, notes, complianceAck, status: "pending_verification",
    });
    return res.json({ status: "success", data: { proposedBook: proposed, listing } });
  } catch (error) { return res.status(500).json({ message: "internal server error" }); }
});

// Public listings search
router.get("/market/listings", async (req, res) => {
  try {
    const { book, type, status } = req.query;
    const query = {};
    if (book) query.bookRef = book;
    if (type) query.type = type;
    query.status = status || "active";
    const listings = await Listing.find(query).sort({ createdAt: -1 }).populate("seller", "username avatar").populate("bookRef");
    return res.json({ status: "success", data: listings });
  } catch (error) { return res.status(500).json({ message: "internal server error" }); }
});

// My listings
router.get("/market/my-listings", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const listings = await Listing.find({ seller: id }).sort({ createdAt: -1 }).populate("bookRef");
    return res.json({ status: "success", data: listings });
  } catch (error) { return res.status(500).json({ message: "internal server error" }); }
});

// Pause/Resume listing (owner only, not sold)
router.patch("/market/listings/:id/:action", authenticateToken, async (req, res) => {
  try {
    const { id: userId } = req.headers; const { id, action } = req.params;
    const listing = await Listing.findOne({ _id: id, seller: userId });
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    if (listing.status === "sold") return res.status(400).json({ message: "Listing already sold" });
    if (action === "pause") listing.status = "paused";
    else if (action === "resume") listing.status = "active";
    else return res.status(400).json({ message: "Invalid action" });
    await listing.save();
    return res.json({ status: "success", data: listing });
  } catch (error) { return res.status(500).json({ message: "internal server error" }); }
});

// Admin: list pending verifications
router.get("/admin/market/verification", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const user = await User.findById(id);
    if (!user || user.role !== "admin") return res.status(403).json({ message: "Admin only" });
    const pendings = await Listing.find({ type: "original", status: "pending_verification" }).populate("proposedBook").populate("seller", "username");
    return res.json({ status: "success", data: pendings });
  } catch (error) { return res.status(500).json({ message: "internal server error" }); }
});

// Admin: approve verification
router.post("/admin/market/verification/:listingId/approve", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers; const { listingId } = req.params; const { duplicateOf } = req.body;
    const user = await User.findById(id);
    if (!user || user.role !== "admin") return res.status(403).json({ message: "Admin only" });
    const listing = await Listing.findById(listingId).populate("proposedBook");
    if (!listing || listing.type !== "original" || listing.status !== "pending_verification") return res.status(400).json({ message: "Invalid listing" });
    let bookRefId = duplicateOf;
    if (!bookRefId) {
      const book = await Book.create({
        url: listing.proposedBook.coverUrl || "",
        title: listing.proposedBook.title,
        author: listing.proposedBook.authorName,
        price: listing.price,
        desc: listing.proposedBook.desc || "",
        language: listing.proposedBook.language || "EN",
      });
      bookRefId = book._id;
    }
    await ProposedBook.findByIdAndUpdate(listing.proposedBook._id, { status: "approved", duplicateOf: duplicateOf || undefined });
    listing.bookRef = bookRefId;
    listing.status = "active";
    await listing.save();
    return res.json({ status: "success", data: listing });
  } catch (error) { return res.status(500).json({ message: "internal server error" }); }
});

// Admin: reject verification
router.post("/admin/market/verification/:listingId/reject", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers; const { listingId } = req.params; const { reason } = req.body;
    const user = await User.findById(id);
    if (!user || user.role !== "admin") return res.status(403).json({ message: "Admin only" });
    const listing = await Listing.findById(listingId).populate("proposedBook");
    if (!listing || listing.type !== "original" || listing.status !== "pending_verification") return res.status(400).json({ message: "Invalid listing" });
    await ProposedBook.findByIdAndUpdate(listing.proposedBook._id, { status: "rejected" });
    listing.status = "rejected";
    await listing.save();
    return res.json({ status: "success", data: { listing, reason: reason || "" } });
  } catch (error) { return res.status(500).json({ message: "internal server error" }); }
});

module.exports = router;


