"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
const mongoose_1 = require("mongoose");
const book_constance_1 = require("./book.constance");
const BookSchema = new mongoose_1.Schema({
    title: { type: String, required: true, unique: true },
    author: { type: String, required: true, unique: true },
    genre: { type: String, enum: book_constance_1.Genre, required: true },
    publicationDate: { type: String, required: true },
    img: { type: String },
    userEmail: { type: String },
    reviews: [{ type: String }],
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.Book = (0, mongoose_1.model)('Book', BookSchema);
