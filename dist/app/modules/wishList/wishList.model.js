"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishList = void 0;
const mongoose_1 = require("mongoose");
const wish_constance_1 = require("./wish.constance");
const WishListSchema = new mongoose_1.Schema({
    book: { type: mongoose_1.Types.ObjectId, ref: 'Book' },
    userEmail: { type: String },
    status: { type: String, enum: wish_constance_1.status },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.WishList = (0, mongoose_1.model)('WishList', WishListSchema);
