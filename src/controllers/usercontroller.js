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
exports.updateProfile = exports.loadEditPage = exports.userLogout = exports.loadLogin = exports.loadHome = exports.verifyLogin = exports.loadRegister = exports.inserUser = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const adminController_1 = require("./adminController");
require("express-session");
;
;
const inserUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, mno, image } = req.body;
        const sPassword = yield (0, adminController_1.securePassword)(password);
        const user = new userModel_1.default({
            name: name,
            email: email,
            password: sPassword,
            mobile: mno,
            image: image,
            is_admin: false
        });
        const userData = yield user.save();
        if (userData) {
            res.render('registation', { message: "Successfully registered" });
        }
        else {
            res.render('registration', { message: "Your registration has failed" });
        }
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.inserUser = inserUser;
const loadRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.render('registration');
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.loadRegister = loadRegister;
const verifyLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.render('/login', { message: "All fields are required" });
        }
        const userData = yield userModel_1.default.findOne({ email });
        if (userData) {
            const passwordMatch = yield bcryptjs_1.default.compare(password, userData.password);
            if (passwordMatch) {
                if (userData.is_admin === true) {
                    res.render('login', { message: "Access denied. Admins cannot log in as users." });
                }
                else {
                    req.session.user_id = userData._id.toString();
                    ;
                    res.redirect('/home');
                }
            }
            else {
                res.render('login', { message: "Incorrect details" });
            }
        }
        else {
            res.render('login', { message: "Login details are incorrect." });
        }
    }
    catch (error) {
    }
});
exports.verifyLogin = verifyLogin;
const loadHome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.session.user_id) {
            res.redirect('/home');
        }
        else {
            res.redirect('/login');
        }
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.loadHome = loadHome;
const loadLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = yield userModel_1.default.findById(req.session.user_id);
        res.render('home', { user: userData });
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.loadLogin = loadLogin;
const userLogout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.log(err.message);
            }
            else {
                res.redirect('/');
            }
        });
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.userLogout = userLogout;
const loadEditPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.query.id;
        const userData = yield userModel_1.default.findById(id);
        if (userData) {
            res.render('edit', { user: userData });
        }
        else {
            res.redirect('/home');
        }
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.loadEditPage = loadEditPage;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id, name, email, mno } = req.body;
        if (req.file) {
            yield userModel_1.default.findByIdAndUpdate(user_id, {
                $set: {
                    name,
                    email,
                    mobile: mno,
                    image: req.file.filename
                }
            });
        }
    }
    catch (error) {
    }
});
exports.updateProfile = updateProfile;
exports.default = {
    inserUser: exports.inserUser,
    loadEditPage: exports.loadEditPage,
    loadLogin: exports.loadLogin,
    loadRegister: exports.loadRegister,
    updateProfile: exports.updateProfile,
    userLogout: exports.userLogout,
    verifyLogin: exports.verifyLogin,
    loadHome: exports.loadHome
};
