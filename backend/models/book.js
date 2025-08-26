const mongoose = require("mongoose");
 
const books = new mongoose.Schema(
    {
        url: { 
            type: String,
            required: true,
        },
        title: { 
            type: String,
            required: true,
        },
        author : { 
            type: String,
            required: true,
        },
        price : { 
            type: Number,
            required: true,
        },
        desc : { 
            type: String,
            required: true,
        },
        language : { 
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "active", "rejected"],
            default: "pending"
        },
        addedBy: {
            type: mongoose.Types.ObjectId,
            ref: "user",
            required: true
        },
        needsApproval: {
            type: Boolean,
            default: false
        },
    },
{timestamps:true}
);

module.exports = mongoose.model("books",books);