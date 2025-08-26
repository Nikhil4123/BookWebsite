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
    coverPhoto:{
        type:String,
    },
    bio:{
        type:String,
        default: "",
        maxlength: 300,
    },
    favoriteGenres:[{ type:String }],
    studyInterests:[{ type:String }],
    readingStatus:{
        type:String,
        enum:["none","currently_reading","completed","on_hold","dropped","plan_to_read"],
        default:"none",
    },
    privacy:{
        type:String,
        enum:["public","followers","private"],
        default:"public",
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