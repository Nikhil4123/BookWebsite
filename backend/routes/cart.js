const router = require("express").Router();
const user = require("../models/user");
const User = require("../models/user");
const { authenticateToken } = require("./userAuth");

router.put("/add-to-cart", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);
    const isBookCart = userData.cart.includes(bookid);
    if (isBookCart) {
      return res.json({
        status: "Success",
        message: "Book is already in cart",
      });
    }
    await User.findByIdAndUpdate(id, { $push: { cart: bookid } });
    return res.json({
      status: "Success",
      message: "Book is added cart",
    });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
});

router.put("/remove-from-cart/:bookid", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.params;
    const { id } = req.headers;

    await User.findByIdAndUpdate(id, { $pull: { cart: bookid } ,});
    return res.json({
      status: "Success",
      message: "Book removed from Favorites",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
});

router.get("/get-users-carts", authenticateToken, async (req, res) => {
    try {
      const { id } = req.headers;
      const userData = await User.findById(id).populate("cart");
      const cart = userData.cart.reverse();
      return res.json({ status: "success", data: cart });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "An error occurred" });
    }
});

module.exports = router;
