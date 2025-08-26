const router = require("express").Router();
const user = require("../models/user");
const User = require("../models/user");
const { authenticateToken } = require("./userAuth");
const Book = require("../models/book");
const Order = require("../models/orders");
const Listing = require("../models/listing");
const { Admin } = require("mongodb");

router.post("/place-order", authenticateToken, async (req, res) => {
    try {
        const {id } =req.headers;
        const {order, listingId}=req.body;
        if (listingId) {
            const listing = await Listing.findById(listingId).populate("bookRef");
            if (!listing || listing.status !== "active") return res.status(400).json({ message: "Listing not available" });
            const newOrder = new Order({ user: id, book: listing.bookRef, status: "order placed" });
            const orderDataFromDb = await newOrder.save();
            await User.findByIdAndUpdate(id, { $push: { orders: orderDataFromDb._id } });
            listing.status = "sold";
            await listing.save();
            return res.json({ status:"Success", message:"Order Placed Successfully", data: orderDataFromDb });
        }
        // legacy cart checkout
        for(const orderData of order){
            const newOrder=new Order({user: id , book:orderData._id});
            const orderDataFromDb=await newOrder.save();
            await User.findByIdAndUpdate(id,{ $push:{orders:orderDataFromDb._id} });
            await User.findByIdAndUpdate(id,{ $pull:{cart:orderData._id} });
        }
        return res.json({
            status:"Success",
            message:"Order Placed Successfully",
        });
    }
     catch (error) {
        console.log(error);
      res.status(500).json({ message: "internal server error" });
    }
});

router.get("/add-order-history", authenticateToken, async (req, res) => {
    try {
        const {id } =req.headers;
        const userData=await User.findById(id).populate({
            path:"orders",
            populate:{path:"book"},
        });
        const ordersData=userData.orders.reverse();

        return res.json({
            status:"Success",
            data:ordersData,
        });
    }
     catch (error) {
        console.log(error);
      res.status(500).json({ message: "internal server error" });
    }
});


router.get("/get-all-orders", authenticateToken, async (req, res) => {
    try {
        const userData=await Order.find()
        .populate({
            path:"book",
        }).populate({
            path:"user"
        })
        .sort({ createdAt:-1 });

        return res.json({
            status:"Success",
            data:userData,
        });
    }
     catch (error) {
        console.log(error);
      res.status(500).json({ message: "internal server error" });
    }
});

router.put("/update-status/:id", authenticateToken, async (req, res) => {
    try {
        const {id}=req.params;
        // const data = await user.findById(id).select("-password");
        // await user.findById(id,{ if (data){ }})
       await Order.findByIdAndUpdate(id,{status:req.body.status});
        return res.json({
            status:"Success",
            message:"Status Updated Successfully",
        });
    }
     catch (error) {
        console.log(error);
      res.status(500).json({ message: "internal server error" });
    }
});

module.exports=router;