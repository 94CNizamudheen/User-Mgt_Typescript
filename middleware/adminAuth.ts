import { Request,Response,NextFunction } from "express";
import User,{IUser} from "../src/models/userModel";

export const isLogin=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
    try {
        if(req.session.user_id){
            next();
        }else{
            res.redirect('/admin');
        }
    } catch (error:any) {
        console.log(error.message);
    }
};
export const isLogout= async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
    try {
        if(req.session.user_id){
            res.redirect('/admin/home');
        }else{
            next();
        }
    } catch (error:any) {
        console.log(error.message);
    }
};
export const isAdmin= async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
    try {
        if(req.session.user_id){
           const user=await User.findById(req.session.user_id)as IUser|null;
            if(user && user.is_admin===true){
                next();
            }else{
                res.redirect('/login');
            }
        }
    } catch (error:any) {
        console.log(error.message);
        res.redirect('/login')
    }
    
};
export const isUser=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
    try {
        if(req.session.user_id){
            const user= await User.findById(req.session.user_id) as IUser | null;
            if(user && user.is_admin===false){
                next()
            }else{
                res.redirect('/admin/home')
            }
        }
    } catch (error:any) {
        console.log(error.message);
        res.redirect('/login');
    }
};

export default{
    isAdmin,
    isUser,
    isLogout,
    isLogin
}

