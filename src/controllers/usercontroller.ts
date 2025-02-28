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

export const inserUser= async(req:Request<{},{},NewUserRRequestBody>,res:Response):Promise<void>=>{
    try {
        const {name,email,password,mno,image}= req.body;
        const sPassword= await securePassword(password);
        
        const user= new User({
            name:name,
            email:email,
            password:sPassword,
            mobile:mno,
            image:image,
            is_admin:false
        });
        const userData= await user.save();
        if(userData){
            res.render('registation',{message:"Successfully registered"});
        }else{
            res.render('registration',{message:"Your registration has failed"});
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
export const verifyLogin=async(req:Request<{},{},LoginRequestBody>,res:Response):Promise<void>=>{
    try {
        const {email,password} =req.body;
        const userData= await User.findOne({email}) as IUser|null;

        if(userData){
            const passwordMatch= await bcript.compare(password,userData.password);
            if(passwordMatch){
                if(userData.is_admin===true){
                    res.render('login',{message:"Access denied. Admins cannot log in as users."});
                }else{
                    req.session.user_id= userData._id.toString();;
                    res.redirect('/home');

                }
            }else{
                res.render('login',{message:"Incorrect details"});
            }
        }else{
            res.render('login',{message:"Login details are incorrect."})
        }
    } catch (error) {
        
    }
};

export const loadLogin= async (req:Request,res:Response):Promise<void>=>{
    try {
        const userData= await User.findById(req.session.user_id) as IUser |null;
        res.render('home',{user:userData});
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
export const updateProfile= async(req:MulterRequest,res:Response):Promise<void>=>{
    try {
        const {user_id,name,email,mno}= req.body;
        if(req.file){
            await User.findByIdAndUpdate(user_id,{
                $set:{
                    name,
                    email,
                    mobile:mno,
                    image:req.file.filename
                }
            });
        }
    } catch (error) {
        
    }
};

export default{
    inserUser,
    loadEditPage,
    loadLogin,
    loadRegister,
    updateProfile,
    userLogout,
    verifyLogin
};





