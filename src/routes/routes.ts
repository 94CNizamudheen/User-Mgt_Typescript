import express, {Request,Response,Express, Router} from "express";
import session from "express-session";
import multer from "multer";
import path from "path";
import config from "../config/config";
import * as adminController from '../controllers/adminController';
import * as auth from '../middleware/auth'
import usercontroller, { loadLogin } from "../controllers/usercontroller";
import exp from "constants";
import nocache from 'nocache';
const storage =multer.diskStorage({
    destination:(req:Request, file:Express.Multer.File, cb:(error:Error|null,destination:string)=>void)=>{
        cb(null,path.join(__dirname,'../public/userImages'));
    },
    filename:(req:Request, file:Express.Multer.File, cb:(error:Error|null, filename:string)=>void)=>{
        const name =Date.now() +'-' + file.originalname;
        cb(null,name);
    }
});
const upload= multer({storage:storage});

const router:Router=express.Router();

router.get('/admin',adminController.loadLogin);
router.post('/admin',nocache(),auth.isLogout,adminController.verifyLogin);
router.get('/admin/home',auth.isLogin,adminController.loadHomePage);
router.get('/admin/logout',nocache(),auth.isLogin,adminController.adminLogout);
router.get('/admin/dashboard',auth.isLogin,auth.isAdmin,adminController.adminDashboard);
router.get('/admin/new-user',auth.isLogin,auth.isAdmin,adminController.newUserLoad);
router.post('/admin/new-user',upload.single('image'),auth.isLogin,auth.isAdmin,adminController.addUser);
router.get('/admin/edit-user',auth.isLogin,auth.isAdmin,adminController.loadEditUserPage);
router.post('/admin/edit-user',auth.isLogin,auth.isAdmin,adminController.updateUser);
router.get('/admin/search-users',auth.isAdmin,adminController.searchUsers);
router.get('/admin/delete-user',auth.isAdmin,adminController.deleteUser);


router.get('/register',auth.isLogout,usercontroller.loadRegister);
router.post('/login',usercontroller.verifyLogin);

router.post('/register', upload.single('image'), (req, res, next) => {
    console.log("File Uploaded:", req.file);
    console.log("Request Body:", req.body);
    next();
}, usercontroller.insertUser);
router.get('/',auth.isLogout,usercontroller.loadLogin);
router.get('/login',nocache(),auth.isLogout,usercontroller.loadLogin);
router.get('/home',auth.isUser,auth.isLogin,usercontroller.loadHome);
router.get('/logout',nocache(),auth.isUser,usercontroller.userLogout);
router.get('/edit',auth.isLogin,auth.isUser,usercontroller.loadEditPage);
router.post('/edit',upload.single('image'),usercontroller.updateProfile);




export default router;
