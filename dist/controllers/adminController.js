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
exports.searchUsers = exports.deleteUser = exports.updateUser = exports.loadEditUserPage = exports.addUser = exports.newUserLoad = exports.adminDashboard = exports.adminLogout = exports.loadHomePage = exports.verifyLogin = exports.loadLogin = exports.securePassword = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
;
;
const securePassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const passwordHash = yield bcryptjs_1.default.hash(password, 10);
        return passwordHash;
    }
    catch (error) {
        throw error;
    }
});
exports.securePassword = securePassword;
// Load login page
const loadLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.render("admin/login");
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.loadLogin = loadLogin;
//verify login;
const verifyLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.render('admin/login', { message: "All fields are required" });
        }
        const userData = yield userModel_1.default.findOne({ email });
        if (userData) {
            const passwordMatch = yield bcryptjs_1.default.compare(password, userData.password);
            if (passwordMatch) {
                if (userData.is_admin === false) {
                    return res.render("admin/login", { message: "Access denied. Only admins can access this page." });
                }
                else {
                    req.session.user_id = userData._id.toString();
                    res.redirect('/admin/home');
                }
            }
            else {
                return res.render('admin/login', { message: "Invalid Credentials" });
            }
        }
        else {
            return res.render("admin/login", { message: "Login details are incorrect." });
        }
    }
    catch (error) {
        console.log(error.message);
        res.render('admin/login', { message: "An error occurred during login" });
    }
});
exports.verifyLogin = verifyLogin;
const loadHomePage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = yield userModel_1.default.findById(req.session.user_id);
        res.render('admin/home', { admin: userData });
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.loadHomePage = loadHomePage;
const adminLogout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.log(err.message);
            }
            else {
                res.redirect('/login');
            }
        });
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.adminLogout = adminLogout;
const adminDashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usersData = yield userModel_1.default.find({ is_admin: false });
        res.render('admin/dashboard', { users: usersData, searchQuery: "" });
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.adminDashboard = adminDashboard;
const newUserLoad = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.render('admin/new-user');
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.newUserLoad = newUserLoad;
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const sPassword = yield (0, exports.securePassword)(req.body.password);
        const { name, email, mno } = req.body;
        const image = ((_a = req.file) === null || _a === void 0 ? void 0 : _a.filename) || "";
        const user = new userModel_1.default({
            name,
            email,
            mobile: mno,
            image: image,
            password: sPassword,
            is_admin: false
        });
        const userData = yield user.save();
        if (userData) {
            res.redirect('/admin/dashboard');
        }
        else {
            res.render('admin/new-user', { message: "Something went wrong" });
        }
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.addUser = addUser;
const loadEditUserPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.query.id;
        const userData = yield userModel_1.default.findById(id);
        if (userData) {
            res.render('admin/edit-user', { user: userData });
        }
        else {
            res.redirect('/admin/dashboard');
        }
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.loadEditUserPage = loadEditUserPage;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, name, email, mno } = req.body;
        yield userModel_1.default.findByIdAndUpdate(id, {
            $set: {
                name,
                email,
                mobile: mno
            }
        });
        res.redirect('/admin/dashboard');
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.query.id;
        yield userModel_1.default.deleteOne({ _id: id });
        res.redirect('/admin/dashboard');
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.deleteUser = deleteUser;
const searchUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchQuery = req.query.q || "";
        const query = {
            is_admin: false, $or: [
                { name: { $regex: searchQuery, $options: "i" } },
                { email: { $regex: searchQuery, $options: "i" } }
            ]
        };
        const userData = yield userModel_1.default.find(query);
        res.render('admin/dashboard', { users: userData, searchQuery });
    }
    catch (error) {
        console.log(error.message);
        res.render('admin/dashboard', { users: [], searchQuery: "", message: "An error occurred while searching" });
    }
});
exports.searchUsers = searchUsers;
exports.default = {
    loadLogin: exports.loadLogin,
    securePassword: exports.securePassword,
    verifyLogin: exports.verifyLogin,
    adminLogout: exports.adminLogout,
    loadHomePage: exports.loadHomePage,
    adminDashboard: exports.adminDashboard,
    newUserLoad: exports.newUserLoad,
    addUser: exports.addUser,
    loadEditUserPage: exports.loadEditUserPage,
    updateUser: exports.updateUser,
    deleteUser: exports.deleteUser,
    searchUsers: exports.searchUsers,
};
