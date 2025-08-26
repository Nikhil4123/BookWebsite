const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Book = require("../models/book.js");
const { authenticateToken } = require("./userAuth");

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
      const books=await Book.find().sort({createdAt: -1 });
      return res.json({ status:"success",
        data: books,
       });
    } catch (error) {
      res.status(500).json({ message: "An error occurred " });
    }
});

router.get("/get-recent-books",  async (req, res) => {
    try {
      const books=await Book.find().sort({createdAt: -1 }).limit(4);
      return res.json({ 
        status:"success",
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
