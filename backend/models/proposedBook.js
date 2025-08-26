const mongoose = require("mongoose");

const proposedBook = new mongoose.Schema(
  {
    title: { type: String, required: true },
    authorName: { type: String, required: true },
    isbn: { type: String },
    language: { type: String },
    desc: { type: String },
    coverUrl: { type: String },
    submittedBy: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    docs: [
      {
        url: { type: String, required: true },
        kind: { type: String, enum: ["id_proof", "copyright_proof", "misc"], default: "misc" },
      },
    ],
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    duplicateOf: { type: mongoose.Types.ObjectId, ref: "books" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("proposedBook", proposedBook);


