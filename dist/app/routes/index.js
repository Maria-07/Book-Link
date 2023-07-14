'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const auth_route_1 = require('../modules/auth/auth.route');
const book_route_1 = require('../modules/book/book.route');
const wishList_route_1 = require('../modules/wishList/wishList.route');
const routes = express_1.default.Router();
const moduleRoutes = [
  {
    path: '/auth',
    route: auth_route_1.AuthRoutes,
  },
  {
    path: '/books',
    route: book_route_1.BookRoutes,
  },
  {
    path: '/wishLists',
    route: wishList_route_1.wishListRoutes,
  },
];
moduleRoutes.forEach(route => {
  routes.use(route.path, route.route);
});
exports.default = routes;
