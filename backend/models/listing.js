const mongoose = require("mongoose");

const listing = new mongoose.Schema(
  {
    type: { type: String, enum: ["original", "resale"], required: true },
    seller: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    bookRef: { type: mongoose.Types.ObjectId, ref: "books" },
    proposedBook: { type: mongoose.Types.ObjectId, ref: "proposedBook" },
    price: { type: Number, required: true, min: 0 },
    condition: { type: String, enum: ["new", "like_new", "good", "fair", "poor"], default: "good" },
    deliveryOptions: [{ type: String, enum: ["pickup", "ship"] }],
    location: { type: String },
    photos: [{ type: String }],
    notes: { type: String, default: "" },
    complianceAck: { type: Boolean, default: false },
    status: { type: String, enum: ["pending_verification", "active", "paused", "rejected", "sold"], default: "active" },
    docBundleId: { type: String },
  },
  { timestamps: true }
);

listing.index({ seller: 1, status: 1 });

module.exports = mongoose.model("listing", listing);


