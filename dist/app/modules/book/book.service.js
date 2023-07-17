"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const book_model_1 = require("./book.model");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const filterableFields_1 = require("../../../constance/filterableFields");
const paginationHelpers_1 = require("../../../helpers/paginationHelpers");
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const config_1 = __importDefault(require("../../../config"));
//* create a Book
const createBook = (book) => __awaiter(void 0, void 0, void 0, function* () {
    let newBookData = null;
    // console.log(userEmail);
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const newBook = yield book_model_1.Book.create([book], { session });
        if (!newBook.length) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create a Book Profile');
        }
        newBookData = newBook[0];
        yield session.commitTransaction();
        yield session.endSession();
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
    return newBookData;
});
//* Get all Book
const getAllBook = (filters, paginationOption) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const andCondition = [];
    if (searchTerm) {
        andCondition.push({
            $or: filterableFields_1.bookFilterableFields.map(field => ({
                [field]: {
                    $regex: searchTerm,
                    $options: 'i',
                },
            })),
        });
    }
    if (Object.keys(filtersData).length) {
        andCondition.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }
    const { page, limit, skip, sortBy, sortOrder } = paginationHelpers_1.paginationHelpers.calculationPagination(paginationOption);
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
    const result = yield book_model_1.Book.find(whereCondition)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield book_model_1.Book.countDocuments(whereCondition);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
//* get single Book
const getSingleBook = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield book_model_1.Book.findById(id);
    return result;
});
//* Update a book
const updateBook = (id, payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(id, payload);
    console.log('Token => 🔖🔖', token);
    let verifiedToken = null;
    try {
        verifiedToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
    }
    catch (err) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Invalid Refresh Token');
    }
    console.log('verifiedToken =======', verifiedToken);
    const { userEmail } = verifiedToken;
    // console.log('Email 📩', email);
    const bookDetails = yield book_model_1.Book.findById(id);
    // console.log('bookDetails 📕', cowDetails);
    if (!bookDetails) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'This Book is invalid');
    }
    if (!userEmail) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'user UNAUTHORIZED');
    }
    const result = yield book_model_1.Book.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
    // console.log(result, 'updated result');
    return result;
});
//* Delete Book
const deleteBook = (id, token) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Token => 🔖🔖', token);
    let verifiedToken = null;
    try {
        verifiedToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
    }
    catch (err) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Invalid Refresh Token');
    }
    // // console.log('verifiedToken =======', verifiedToken);
    const { userEmail } = verifiedToken;
    if (!userEmail) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'UNAUTHORIZED');
    }
    const result = yield book_model_1.Book.findByIdAndDelete({ _id: id }, { new: true });
    // console.log('Deleted Result 🗑️🗑️', result);
    return result;
});
exports.BookService = {
    createBook,
    getAllBook,
    getSingleBook,
    updateBook,
    deleteBook,
    // addReview,
};
