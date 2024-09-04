const express = require("express");
const app = express();
const cors=require("cors");
require("dotenv").config();
require("./conn/conn");

const User =require("./routes/user.js");
const Book =require("./routes/book.js")
const Favorite =require("./routes/favorite");
const cart=require("./routes/cart");
const Order=require("./routes/order");

app.use(cors({origin:"*"}));
app.use(express.json());

app.get("/",(req,res) => {
    res.send("hello from backend ")
});


app.use("/api/v1",User);
app.use("/api/v1",Book);
app.use("/api/v1",Favorite);
app.use("/api/v1",cart);
app.use("/api/v1",Order);


app.listen(process.env.PORT,()=>{
    console.log(`server Started at ${process.env.PORT}`);
})