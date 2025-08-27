const router = require("express").Router();
const { authenticateToken } = require("./userAuth");
const Listing = require("../models/listing");
const ProposedBook = require("../models/proposedBook");
const Book = require("../models/book");
const User = require("../models/user");

// Create new book listing (goes active immediately)
router.post("/market/listings/new-book", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { 
      title, authorName, isbn, language, desc, coverUrl, 
      price, condition, deliveryOptions, location, photos, notes, complianceAck 
    } = req.body;
    
    if (!complianceAck) return res.status(400).json({ message: "Compliance acknowledgment required" });
    
    // Create new book in database
    const book = await Book.create({
      url: coverUrl || "",
      title,
      author: authorName,
      price,
      desc: desc || "",
      language: language || "EN",
    });
    
    // Create listing (active immediately for new books)
    const listing = await Listing.create({
      type: "new_book",
      seller: id,
      bookRef: book._id,
      price,
      condition: condition || "new",
      deliveryOptions,
      location,
      photos,
      notes,
      complianceAck,
      isbn,
      status: "active",
    });
    
    const populatedListing = await Listing.findById(listing._id)
      .populate("seller", "username avatar")
      .populate("bookRef");
    
    return res.json({ status: "success", data: populatedListing });
  } catch (error) { 
    console.error("Error creating new book listing:", error);
    return res.status(500).json({ message: "Internal server error" }); 
  }
});

// Create old book listing (own book - requires admin approval)
router.post("/market/listings/old-book-own", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { 
      bookRef, price, condition, deliveryOptions, location, photos, notes, 
      complianceAck, purchaseDate, reasonForSelling 
    } = req.body;
    
    if (!complianceAck) return res.status(400).json({ message: "Compliance acknowledgment required" });
    
    const book = await Book.findById(bookRef);
    if (!book) return res.status(404).json({ message: "Book not found" });
    
    // Create listing (pending verification for own old books)
    const listing = await Listing.create({
      type: "old_book_own",
      seller: id,
      bookRef,
      price,
      condition,
      deliveryOptions,
      location,
      photos,
      notes,
      complianceAck,
      originalOwner: id,
      purchaseDate,
      reasonForSelling,
      status: "pending_verification",
    });
    
    const populatedListing = await Listing.findById(listing._id)
      .populate("seller", "username avatar")
      .populate("bookRef");
    
    return res.json({ status: "success", data: populatedListing });
  } catch (error) { 
    console.error("Error creating old book own listing:", error);
    return res.status(500).json({ message: "Internal server error" }); 
  }
});

// Create old book listing (other's book - goes active immediately)
router.post("/market/listings/old-book-other", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { 
      bookRef, price, condition, deliveryOptions, location, photos, notes, 
      complianceAck, originalOwner, purchaseDate, reasonForSelling 
    } = req.body;
    
    if (!complianceAck) return res.status(400).json({ message: "Compliance acknowledgment required" });
    
    const book = await Book.findById(bookRef);
    if (!book) return res.status(404).json({ message: "Book not found" });
    
    // Create listing (active immediately for other's old books)
    const listing = await Listing.create({
      type: "old_book_other",
      seller: id,
      bookRef,
      price,
      condition,
      deliveryOptions,
      location,
      photos,
      notes,
      complianceAck,
      originalOwner,
      purchaseDate,
      reasonForSelling,
      status: "active",
    });
    
    const populatedListing = await Listing.findById(listing._id)
      .populate("seller", "username avatar")
      .populate("bookRef")
      .populate("originalOwner", "username");
    
    return res.json({ status: "success", data: populatedListing });
  } catch (error) { 
    console.error("Error creating old book other listing:", error);
    return res.status(500).json({ message: "Internal server error" }); 
  }
});

// Public listings search
router.get("/market/listings", async (req, res) => {
  try {
    const { book, type, status, condition, minPrice, maxPrice, location } = req.query;
    const query = {};
    
    if (book) query.bookRef = book;
    if (type) query.type = type;
    if (condition) query.condition = condition;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    query.status = status || "active";
    
    const listings = await Listing.find(query)
      .sort({ createdAt: -1 })
      .populate("seller", "username avatar")
      .populate("bookRef")
      .populate("originalOwner", "username");
    
    return res.json({ status: "success", data: listings });
  } catch (error) { 
    console.error("Error fetching listings:", error);
    return res.status(500).json({ message: "Internal server error" }); 
  }
});

// My listings
router.get("/market/my-listings", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const listings = await Listing.find({ seller: id })
      .sort({ createdAt: -1 })
      .populate("bookRef")
      .populate("originalOwner", "username");
    
    return res.json({ status: "success", data: listings });
  } catch (error) { 
    console.error("Error fetching my listings:", error);
    return res.status(500).json({ message: "Internal server error" }); 
  }
});

// Get single listing
router.get("/market/listings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate("seller", "username avatar email")
      .populate("bookRef")
      .populate("originalOwner", "username")
      .populate("approvedBy", "username");
    
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    
    return res.json({ status: "success", data: listing });
  } catch (error) { 
    console.error("Error fetching listing:", error);
    return res.status(500).json({ message: "Internal server error" }); 
  }
});

// Pause/Resume listing (owner only, not sold)
router.patch("/market/listings/:id/:action", authenticateToken, async (req, res) => {
  try {
    const { id: userId } = req.headers; 
    const { id, action } = req.params;
    
    const listing = await Listing.findOne({ _id: id, seller: userId });
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    
    if (listing.status === "sold") return res.status(400).json({ message: "Listing already sold" });
    
    if (action === "pause") listing.status = "paused";
    else if (action === "resume") listing.status = "active";
    else return res.status(400).json({ message: "Invalid action" });
    
    await listing.save();
    
    const populatedListing = await Listing.findById(listing._id)
      .populate("seller", "username avatar")
      .populate("bookRef");
    
    return res.json({ status: "success", data: populatedListing });
  } catch (error) { 
    console.error("Error updating listing:", error);
    return res.status(500).json({ message: "Internal server error" }); 
  }
});

// Delete listing (owner only)
router.delete("/market/listings/:id", authenticateToken, async (req, res) => {
  try {
    const { id: userId } = req.headers; 
    const { id } = req.params;
    
    const listing = await Listing.findOne({ _id: id, seller: userId });
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    
    if (listing.status === "sold") return res.status(400).json({ message: "Cannot delete sold listing" });
    
    await Listing.findByIdAndDelete(id);
    
    return res.json({ status: "success", message: "Listing deleted successfully" });
  } catch (error) { 
    console.error("Error deleting listing:", error);
    return res.status(500).json({ message: "Internal server error" }); 
  }
});

// Admin: list pending verifications
router.get("/admin/market/verification", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const user = await User.findById(id);
    if (!user || user.role !== "admin") return res.status(403).json({ message: "Admin only" });
    
    const pendings = await Listing.find({ 
      type: "old_book_own", 
      status: "pending_verification" 
    })
    .populate("seller", "username avatar email")
    .populate("bookRef")
    .sort({ createdAt: -1 });
    
    return res.json({ status: "success", data: pendings });
  } catch (error) { 
    console.error("Error fetching pending verifications:", error);
    return res.status(500).json({ message: "Internal server error" }); 
  }
});

// Admin: approve verification
router.post("/admin/market/verification/:listingId/approve", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers; 
    const { listingId } = req.params; 
    const { adminNotes } = req.body;
    
    const user = await User.findById(id);
    if (!user || user.role !== "admin") return res.status(403).json({ message: "Admin only" });
    
    const listing = await Listing.findById(listingId);
    if (!listing || listing.type !== "old_book_own" || listing.status !== "pending_verification") {
      return res.status(400).json({ message: "Invalid listing" });
    }
    
    listing.status = "active";
    listing.adminNotes = adminNotes;
    listing.approvedBy = id;
    listing.approvedAt = new Date();
    
    await listing.save();
    
    const populatedListing = await Listing.findById(listing._id)
      .populate("seller", "username avatar email")
      .populate("bookRef")
      .populate("approvedBy", "username");
    
    return res.json({ status: "success", data: populatedListing });
  } catch (error) { 
    console.error("Error approving listing:", error);
    return res.status(500).json({ message: "Internal server error" }); 
  }
});

// Admin: reject verification
router.post("/admin/market/verification/:listingId/reject", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers; 
    const { listingId } = req.params; 
    const { reason, adminNotes } = req.body;
    
    const user = await User.findById(id);
    if (!user || user.role !== "admin") return res.status(403).json({ message: "Admin only" });
    
    const listing = await Listing.findById(listingId);
    if (!listing || listing.type !== "old_book_own" || listing.status !== "pending_verification") {
      return res.status(400).json({ message: "Invalid listing" });
    }
    
    listing.status = "rejected";
    listing.adminNotes = adminNotes;
    listing.approvedBy = id;
    listing.approvedAt = new Date();
    
    await listing.save();
    
    const populatedListing = await Listing.findById(listing._id)
      .populate("seller", "username avatar email")
      .populate("bookRef")
      .populate("approvedBy", "username");
    
    return res.json({ 
      status: "success", 
      data: { listing: populatedListing, reason: reason || "" } 
    });
  } catch (error) { 
    console.error("Error rejecting listing:", error);
    return res.status(500).json({ message: "Internal server error" }); 
  }
});

// Get all books for listing creation
router.get("/market/books", async (req, res) => {
  try {
    const { search } = req.query;
    const query = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } }
      ];
    }
    
    const books = await Book.find(query).limit(50).sort({ title: 1 });
    return res.json({ status: "success", data: books });
  } catch (error) { 
    console.error("Error fetching books:", error);
    return res.status(500).json({ message: "Internal server error" }); 
  }
});

module.exports = router;


