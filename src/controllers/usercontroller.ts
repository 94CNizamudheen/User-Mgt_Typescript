import { Request, Response, NextFunction } from "express";
import { Multer } from "multer";

interface MulterRequest extends Request {
    file?: Express.Multer.File;
}
import User,{IUser} from "../models/userModel";
import bcript from  "bcryptjs";
import { PassThrough } from "stream";
import { securePassword } from "./adminController";
import 'express-session';


interface LoginRequestBody {
    email: string;
    password: string;
  }


interface NewUserRRequestBody{
    name:string;
    email:string;
    password:string;
    mno:string;
    image:string;
};
interface UpdateUserRequestBody{
    user_id:string;
    name:string;
    email:string;
    mno:string;
    image:string;
};

export const insertUser= async(req:Request<{},{},NewUserRRequestBody>,res:Response):Promise<void>=>{
    try {
        const {name,email,password,mno}= req.body;
        const sPassword= await securePassword(password);
        if(!req.file){
            return res.render("registration", { message: "Image is required" })
        }
        
        const user= new User({
            name:name,
            email:email,
            password:sPassword,
            mobile:mno,
            image: req.file.filename,
            is_admin:false
        });
        const userData= await user.save();
        if(userData){
            res.render('user/registration',{message:"Successfully registered"});
        }else{
            res.render('user/registration',{message:"Your registration has failed"});
        }

    } catch (error:any) {
        console.log(error.message);
    }
};

export const loadRegister= async(req:Request,res:Response):Promise<void>=>{
    try {
        res.render('registration');
    } catch (error:any) {
        console.log(error.message)
    }
};
export const verifyLogin = async (req: Request<{}, {}, LoginRequestBody>, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.render('login', { message: "All fields are required" }); // Fixed
            return;
        }
        const userData = await User.findOne({ email }) as IUser | null;
        if (userData) {
            const passwordMatch = await bcript.compare(password, userData.password);
            if (passwordMatch) {
                if (userData.is_admin === true) {
                    res.render('login', { message: "Access denied. Admins cannot log in as users." });
                } else {
                    req.session.user_id = userData._id.toString();
                    res.redirect('/home');
                }
            } else {
                res.render('login', { message: "Incorrect details" });
            }
        } else {
            res.render('login', { message: "Login details are incorrect." });
        }
    } catch (error: any) {
        console.log(error.message);
        res.render('login', { message: "An error occurred. Please try again." });
    }
};
export const loadHome= async(req:Request,res:Response):Promise<void>=>{
    try {
        if(req.session.user_id){
            const userData= await User.findById(req.session.user_id) as IUser|null;
            res.render('home',{user:userData});
        }else{
            res.redirect('/login');
        }
    } catch (error:any) {
        console.log(error.message)
    }
}

export const loadLogin= async (req:Request,res:Response):Promise<void>=>{
    try {
        const userData= await User.findById(req.session.user_id) as IUser |null;
        res.render('login',{user:userData});
    } catch (error:any) {
        console.log(error.message);
    }
};
export const  userLogout=async(req:Request,res:Response):Promise<void>=>{
    try {
        req.session.destroy((err:any)=>{
            if(err){
                console.log(err.message)
            }else{
                res.redirect('/');
            }
        })
    } catch (error:any) {
        console.log(error.message);
    }
};
export const loadEditPage=async(req:Request,res:Response):Promise<void>=>{
    try {
        const id= req.query.id as string;
        const userData= await User.findById(id)as IUser |null;
        if(userData){
            res.render('edit',{user:userData});
        }else{
            res.redirect('/home');
        }
    } catch (error:any) {
        console.log(error.message)
    }

};
export const updateProfile = async (req: MulterRequest, res: Response): Promise<void> => {
    try {
        const { user_id, name, email, mno } = req.body;
        if (!user_id) {
            return res.status(400).render('edit', { message: "User ID is required" });
        }

        let updateData: { name: string; email: string; mobile: string; image?: string } = {
            name,
            email,
            mobile: mno
        };

        if (req.file) {
            updateData.image= req.file.filename;
        }

        const updatedUser = await User.findByIdAndUpdate(user_id, { $set: updateData }, { new: true });
        if (updatedUser) {
           
            req.session.user_id = user_id;
            res.redirect('/home'); 
        } else {
            res.status(404).render('edit', { message: "User not found" });
        }
    } catch (error: any) {
        console.log(error.message);
        res.status(500).render('edit', { message: "An error occurred while updating your profile" });
    }
};

export default{
    insertUser,
    loadEditPage,
    loadLogin,
    loadRegister,
    updateProfile,
    userLogout,
    verifyLogin,
    loadHome
};





