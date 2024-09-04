const mongoose = require("mongoose");
 
const user =new mongoose.Schema({
    username:{
        type:String,
        require:true,
    }, 
    email:{
        type:String,
        require:true,
        unique:true,
    },
    password:{
        type:String,
        require:true,
    },
    address:{
        type:String,
        require:true,
    },
    avatar:{
        type:String,
        default: "https://vectorified.com/images/avatar-icon-png-1.png",
    },
    role:{
        type:String,
        default: "user",
        enum: ["user","admin"], 
    },
    favorites: [
        {
        type: mongoose.Types.ObjectId,
        ref: "books"
        }
    ],
    cart: [
        {
        type: mongoose.Types.ObjectId,
        ref: "books"
        }
    ],
    orders: [
        {
        type: mongoose.Types.ObjectId,
        ref: "order"
        }
    ],
},
{timestamps : true}
);
module.exports = mongoose.model("user",user);