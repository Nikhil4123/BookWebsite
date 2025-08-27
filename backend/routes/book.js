const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Book = require("../models/book.js");
const { authenticateToken } = require("./userAuth");
const { parse } = require("csv-parse");

// Admin-only CSV import endpoint
router.post("/import-books-csv", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const user = await User.findById(id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    // Expect the CSV file to be present on the server filesystem.
    // For simplicity, look for it at project root: ../../BooksDatasetClean.csv
    const csvPath = path.join(__dirname, "..", "..", "BooksDatasetClean.csv");
    if (!fs.existsSync(csvPath)) {
      return res.status(400).json({ message: "CSV file not found at project root (BooksDatasetClean.csv)" });
    }

    const parser = fs.createReadStream(csvPath).pipe(parse({
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }));

    const docs = [];
    const BATCH_SIZE = 1000;
    let inserted = 0;

    const flushBatch = async () => {
      if (docs.length === 0) return;
      const batch = docs.splice(0, docs.length);
      const result = await Book.insertMany(batch, { ordered: false });
      inserted += result.length;
    };

    for await (const record of parser) {
      // Map CSV columns to schema fields based on actual CSV headers
      const title = record.Title || record.title || "Untitled";
      const author = record.Authors || record.authors || "Unknown";
      const desc = record.Description || record.description || "No description available.";
      const category = record.Category || record.category || "";
      const publisher = record.Publisher || record.publisher || "";
      const priceRaw = record["Price Starting With ($)"] || record.price || "0";
      const publishMonth = record["Publish Date (Month)"] || "";
      const publishYear = record["Publish Date (Year)"] || "";
      
      // Generate a placeholder image URL since CSV doesn't have images
      const url = `https://via.placeholder.com/300x400?text=${encodeURIComponent(title)}`;
      const language = "English"; // Default since not in CSV

      // Coerce price to number
      const price = Number(String(priceRaw).toString().replace(/[^0-9.]/g, "")) || 0;

      if (!url || !title) {
        continue; // skip incomplete rows
      }

      docs.push({
        url,
        title,
        author,
        price,
        desc,
        language,
        status: "active",
        addedBy: id,
        needsApproval: false,
      });

      if (docs.length >= BATCH_SIZE) {
        await flushBatch();
      }
    }

    await flushBatch();

    return res.json({ status: "success", inserted });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to import CSV" });
  }
});

router.post("/add-book", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const user = await User.findById(id);
    
    // Check if author is provided
    if (req.body.author && req.body.author.trim() !== "") {
      // Author is set - Admin approval required
      if (user.role !== "admin") {
        return res
          .status(400)
          .json({ message: "Only admins can add books with author information" });
      }
      
      const book = new Book({
        url: req.body.url,
        title: req.body.title,
        author: req.body.author,
        price: req.body.price,
        desc: req.body.desc,
        language: req.body.language,
        status: "active", // Direct activation for admin
        addedBy: id
      });
      await book.save();
      
      res.status(200).json({ 
        message: "Book added successfully by admin",
        bookId: book._id,
        status: "active"
      });
    } else {
      // No author - User can self-buy, but needs admin approval
      const book = new Book({
        url: req.body.url,
        title: req.body.title,
        author: req.body.author || "Unknown",
        price: req.body.price,
        desc: req.body.desc,
        language: req.body.language,
        status: "pending", // Pending admin approval
        addedBy: id,
        needsApproval: true
      });
      await book.save();
      
      // Create notification for admin
      const Notification = require("../models/notification");
      const adminUsers = await User.find({ role: "admin" });
      
      for (const admin of adminUsers) {
        await Notification.create({
          user: admin._id,
          fromUser: id,
          type: "book_approval",
          refId: book._id,
          meta: {
            bookTitle: req.body.title,
            userName: user.username,
            message: `New book "${req.body.title}" needs admin approval`
          }
        });
      }
      
      res.status(200).json({ 
        message: "Book submitted for admin approval",
        bookId: book._id,
        status: "pending",
        note: "Admin will review and contact you soon"
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal service error" });
  }
});

router.post("/update-book", authenticateToken, async (req, res) => {
    try {
      const { bookid } = req.headers;
      await Book.findByIdAndUpdate(bookid,{
        url: req.body.url,
        title: req.body.title,
        author: req.body.author,
        price: req.body.price,
        desc: req.body.desc,
        language: req.body.language,
      } )
      
      res.status(200).json({ message: "Book updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "An error occurred " });
    }
});

router.delete("/delete-book", authenticateToken, async (req, res) => {
    try {
      const { bookid } = req.headers;
      await Book.findByIdAndDelete(bookid);
      res.status(200).json({ message: "Book Deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "An error occurred " });
    }
});

router.get("/get-all-books",  async (req, res) => {
    try {
      console.log("Fetching all books...");
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;
      const skip = (page - 1) * limit;
      
      // Get total count without sorting
      const totalCount = await Book.countDocuments();
      
      // Get books with pagination, no sorting to avoid memory issues
      const books = await Book.find()
        .skip(skip)
        .limit(limit)
        .lean(); // Use lean() for better performance
      
      console.log(`Found ${books.length} books (page ${page}, total: ${totalCount})`);
      return res.json({ 
        status: "success",
        data: books,
        count: books.length,
        totalCount: totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPrevPage: page > 1
      });
    } catch (error) {
      console.error("Error fetching books:", error);
      res.status(500).json({ message: "An error occurred", error: error.message });
    }
});

router.get("/get-recent-books",  async (req, res) => {
    try {
      // Get recent books without sorting to avoid memory issues
      const books = await Book.find().limit(4).lean();
      return res.json({ 
        status: "success",
        data: books,
      });
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: "An error occurred " });
    }
});

router.get("/get-book-by-id/:id",  async (req, res) => {
    try {
        const {id} =req.params;
      const books=await Book.findById(id);
      return res.json({
         status:"success",
        data: books,
       });
    } catch (error) {
      res.status(500).json({ message: "An error occurred " });
    }
});

// Admin: Get pending books for approval
router.get("/pending-approval", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const user = await User.findById(id);
        
        if (user.role !== "admin") {
            return res.status(403).json({ message: "Admin access required" });
        }
        
        const pendingBooks = await Book.find({ status: "pending", needsApproval: true })
            .populate("addedBy", "username email")
            .sort({ createdAt: -1 });
            
        res.json({
            status: "success",
            data: pendingBooks
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal service error" });
    }
});

// Admin: Approve book
router.post("/approve-book/:bookId", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const { bookId } = req.params;
        const user = await User.findById(id);
        
        if (user.role !== "admin") {
            return res.status(403).json({ message: "Admin access required" });
        }
        
        const book = await Book.findByIdAndUpdate(bookId, {
            status: "active",
            needsApproval: false
        }, { new: true });
        
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        
        // Create notification for user
        const Notification = require("../models/notification");
        await Notification.create({
            user: book.addedBy,
            fromUser: id,
            type: "book_approved",
            refId: book._id,
            meta: {
                bookTitle: book.title,
                message: `Your book "${book.title}" has been approved!`
            }
        });
        
        res.json({
            status: "success",
            message: "Book approved successfully",
            data: book
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal service error" });
    }
});

// Admin: Reject book
router.post("/reject-book/:bookId", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const { bookId } = req.params;
        const { reason } = req.body;
        const user = await User.findById(id);
        
        if (user.role !== "admin") {
            return res.status(403).json({ message: "Admin access required" });
        }
        
        const book = await Book.findByIdAndUpdate(bookId, {
            status: "rejected",
            needsApproval: false
        }, { new: true });
        
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        
        // Create notification for user
        const Notification = require("../models/notification");
        await Notification.create({
            user: book.addedBy,
            fromUser: id,
            type: "book_rejected",
            refId: book._id,
            meta: {
                bookTitle: book.title,
                reason: reason || "No specific reason provided",
                message: `Your book "${book.title}" was rejected: ${reason || "No specific reason provided"}`
            }
        });
        
        res.json({
            status: "success",
            message: "Book rejected successfully",
            data: book
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal service error" });
    }
});

module.exports = router;
