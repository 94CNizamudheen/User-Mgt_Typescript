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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUser = exports.isAdmin = exports.isLogout = exports.isLogin = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const isLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.session.user_id) {
            next();
        }
        else {
            res.redirect('/login');
            return;
        }
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.isLogin = isLogin;
const isLogout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.session.user_id) {
            res.redirect('/admin/home');
        }
        else {
            next();
        }
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.isLogout = isLogout;
const isAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.session.user_id) {
            const user = yield userModel_1.default.findById(req.session.user_id);
            if (user && user.is_admin === true) {
                next();
            }
            else {
                res.redirect('/login');
            }
        }
    }
    catch (error) {
        console.log(error.message);
        res.redirect('/login');
    }
});
exports.isAdmin = isAdmin;
const isUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.session.user_id) {
            const user = yield userModel_1.default.findById(req.session.user_id);
            if (user && user.is_admin === false) {
                next();
            }
            else {
                res.redirect('/admin/home');
            }
        }
    }
    catch (error) {
        console.log(error.message);
        res.redirect('/login');
    }
});
exports.isUser = isUser;
exports.default = {
    isAdmin: exports.isAdmin,
    isUser: exports.isUser,
    isLogout: exports.isLogout,
    isLogin: exports.isLogin
};
