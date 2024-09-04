const router = require("express").Router();
const user = require("../models/user");
const User = require("../models/user");
const { authenticateToken } = require("./userAuth");

router.put("/add-book-to-fav", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);
    const isBookFav = userData.favorites.includes(bookid);
    if (isBookFav) {
      return res.status(200).json({ message: "Book is already in Favorites" });
    }
    await User.findByIdAndUpdate(id, { $push: { favorites: bookid } });
    return res.status(200).json({ message: "Book is added to Favorites" });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
});

router.put("/remove-book-from-fav", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);
    const isBookFav = userData.favorites.includes(bookid);
    if (isBookFav) {
      await User.findByIdAndUpdate(id, { $pull: { favorites: bookid } });
    }
    return res.status(200).json({ message: "Book removed from  Favorites" });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
});

router.get("/get-favorite-books", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate("favorites");
    const favBooks = userData.favorites;
    return res.json({ status: "success", data: favBooks });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

module.exports = router;
