'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === 'function')
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (
          e.indexOf(p[i]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(s, p[i])
        )
          t[p[i]] = s[p[i]];
      }
    return t;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.WishListService = void 0;
const mongoose_1 = __importDefault(require('mongoose'));
const wishList_model_1 = require('./wishList.model');
const ApiError_1 = __importDefault(require('../../../errors/ApiError'));
const http_status_1 = __importDefault(require('http-status'));
const createWishList = (wishList, userEmail) =>
  __awaiter(void 0, void 0, void 0, function* () {
    // Check if the wishlist already exists
    const existingWishList = yield wishList_model_1.WishList.findOne({
      book: wishList.book,
      userEmail: userEmail,
    });
    console.log('existingWishList', existingWishList);
    if (existingWishList) {
      yield wishList_model_1.WishList.findOneAndUpdate(
        { _id: existingWishList._id },
        {
          status: wishList.status,
        },
      );
      throw new ApiError_1.default(
        http_status_1.default.BAD_REQUEST,
        'Wishlist for this book already exists',
      );
    }
    let newWishListData = null;
    // Start the transaction
    const session = yield mongoose_1.default.startSession();
    console.log(userEmail);
    try {
      session.startTransaction();
      const newWishList = yield wishList_model_1.WishList.create([wishList], {
        session,
      });
      if (!newWishList.length) {
        throw new ApiError_1.default(
          http_status_1.default.BAD_REQUEST,
          'Failed to create this WishList',
        );
      }
      newWishListData = newWishList[0];
      yield session.commitTransaction();
      yield session.endSession();
    } catch (error) {
      yield session.abortTransaction();
      yield session.endSession();
      throw error;
    }
    return newWishListData;
  });
//* Get all wishList
const getAllWishList = filters =>
  __awaiter(void 0, void 0, void 0, function* () {
    const filtersData = __rest(filters, []);
    const andCondition = [];
    if (Object.keys(filtersData).length) {
      andCondition.push({
        $and: Object.entries(filtersData).map(([field, value]) => ({
          [field]: value,
        })),
      });
    }
    const whereCondition =
      andCondition.length > 0 ? { $and: andCondition } : {};
    const result = yield wishList_model_1.WishList.find(
      whereCondition,
    ).populate('book');
    return {
      data: result,
    };
  });
exports.WishListService = {
  createWishList,
  getAllWishList,
};
