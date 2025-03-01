"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const adminController = __importStar(require("../controllers/adminController"));
const auth = __importStar(require("../middleware/auth"));
const usercontroller_1 = __importDefault(require("../controllers/usercontroller"));
const nocache_1 = __importDefault(require("nocache"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, '../public/userImages'));
    },
    filename: (req, file, cb) => {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});
const upload = (0, multer_1.default)({ storage: storage });
const router = express_1.default.Router();
router.get('/admin', adminController.loadLogin);
router.post('/admin', (0, nocache_1.default)(), auth.isLogout, adminController.verifyLogin);
router.get('/admin/home', auth.isLogin, adminController.loadHomePage);
router.get('/admin/logout', (0, nocache_1.default)(), auth.isLogin, adminController.adminLogout);
router.get('/admin/dashboard', auth.isLogin, auth.isAdmin, adminController.adminDashboard);
router.get('/admin/new-user', auth.isLogin, auth.isAdmin, adminController.newUserLoad);
router.post('/admin/new-user', upload.single('image'), auth.isLogin, auth.isAdmin, adminController.addUser);
router.get('/admin/edit-user', auth.isLogin, auth.isAdmin, adminController.loadEditUserPage);
router.post('/admin/edit-user', auth.isLogin, auth.isAdmin, adminController.updateUser);
router.get('/admin/search-users', auth.isAdmin, adminController.searchUsers);
router.get('/admin/delete-user', auth.isAdmin, adminController.deleteUser);
router.get('/register', auth.isLogout, usercontroller_1.default.loadRegister);
router.post('/login', usercontroller_1.default.verifyLogin);
router.post('/register', upload.single('image'), (req, res, next) => {
    console.log("File Uploaded:", req.file);
    console.log("Request Body:", req.body);
    next();
}, usercontroller_1.default.insertUser);
router.get('/', auth.isLogout, usercontroller_1.default.loadLogin);
router.get('/login', (0, nocache_1.default)(), auth.isLogout, usercontroller_1.default.loadLogin);
router.get('/home', auth.isUser, auth.isLogin, usercontroller_1.default.loadHome);
router.get('/logout', (0, nocache_1.default)(), auth.isUser, usercontroller_1.default.userLogout);
router.get('/edit', auth.isLogin, auth.isUser, usercontroller_1.default.loadEditPage);
router.post('/edit', upload.single('image'), usercontroller_1.default.updateProfile);
exports.default = router;
