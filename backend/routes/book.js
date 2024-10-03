const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Book = require("../models/book.js");
const { authenticateToken } = require("./userAuth");

router.post("/add-book", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const user = await User.findById(id);
    if (user.role !== "admin") {
      return res
        .status(400)
        .json({ message: "You do not have access to perform admin work " });
    }

    const book = new Book({
      url: req.body.url,
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      desc: req.body.desc,
      language: req.body.language,
    });
    await book.save();
    res.status(200).json({ message: "Book added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal service error " });
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
      const books=await Book.find().sort({createAt: -1 });
      return res.json({ status:"success",
        data: books,
       });
    } catch (error) {
      res.status(500).json({ message: "An error occurred " });
    }
});

router.get("/get-recent-books",  async (req, res) => {
    try {
      const books=await Book.find().sort({createAt: -1 }).limit(4);
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

module.exports = router;
