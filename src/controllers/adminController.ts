import { Request,Response } from "express";
import User, { IUser } from "../models/userModel";
import bcrypt from "bcryptjs";
import { promises } from "dns";
import { userInfo } from "os";
import multer = require("multer");

interface NewUserRequestBody{
    name:string;
    email:string;
    password:string;
    mno:string;
};

interface UpdateUserRequestBody{
    id:string;
    name:string;
    mno:string;
    email:string;
};
export const securePassword= async(password:string):Promise<string>=>{
    try {
        const passwordHash= await bcrypt.hash(password,10);
        return passwordHash;
    } catch (error:any) {
        throw error;
    }
};

// Load login page

export const loadLogin=async(req:Request,res:Response):Promise<void>=>{
    try {
        res.render("admin/login");
    } catch (error:any) {
        console.log(error.message)
    }
};

//verify login;

export const verifyLogin= async(req:Request,res:Response):Promise<void>=>{
    try {
        const {email,password}= req.body;
        if(!email ||!password){
           return res.render('admin/login',{message:"All fields are required"})
        }
        const userData= await User.findOne({email}) as IUser|null;
        if(userData){
            const passwordMatch= await bcrypt.compare(password,userData.password);
            if(passwordMatch){
                if(userData.is_admin===false){
                   return res.render("admin/login",{message:"Access denied. Only admins can access this page."})
                }else{
                    req.session.user_id = userData._id.toString()
                    res.redirect('/admin/home')
                } 
            }else{
              return  res.render('admin/login',{message:"Invalid Credentials"})
            }
        }else{
           return res.render("admin/login",{message:"Login details are incorrect."})
        }

    } catch (error:any) {
        console.log(error.message);
        res.render('admin/login',{message:"An error occurred during login"})
    }
};
export const loadHomePage= async(req:Request,res:Response):Promise<void>=>{
    try {
        const userData= await User.findById(req.session.user_id) as IUser |null;
        res.render('admin/home',{admin:userData});
    } catch (error:any) {
        console.log(error.message);
    }
};

export const adminLogout =async(req:Request,res:Response):Promise<void>=>{
    try {
        req.session.destroy((err)=>{
            if(err){
                console.log(err.message);
            }else{
                res.redirect('/login');
            }
        });
    } catch (error:any) {
        console.log(error.message);
    }
};

export const adminDashboard= async(req:Request,res:Response):Promise<void>=>{
    try {
        const usersData= await User.find({is_admin:false}) as IUser[];
        res.render('admin/dashboard',{users:usersData,searchQuery:""});
    } catch (error:any) {
        console.log(error.message);
    }
};

export const newUserLoad= async(req:Request,res:Response):Promise<void>=>{
    try {
        res.render('admin/new-user')
    } catch (error:any) {
        console.log(error.message);
    }
};
export const addUser= async(req:Request<{},{},NewUserRequestBody>,res:Response):Promise<void>=>{
    try {
        const sPassword= await securePassword(req.body.password);
        const {name,email,mno}=req.body;
        const image= req.file?.filename|| "";
        const user=new User({
            name,
            email,
            mobile:mno,
            image:image,
            password:sPassword,
            is_admin:false
        });
        const userData= await user.save();
        if(userData){
            res.redirect('/admin/dashboard');
        }else{
            res.render('admin/new-user',{message:"Something went wrong"});
        }
    } catch (error:any) {
        console.log(error.message)
    }
};
export const loadEditUserPage= async(req:Request,res:Response):Promise<void>=>{
    try {
        const id = req.query.id as string;
        const userData= await User.findById(id)as IUser|null ;
        if(userData){
            res.render('admin/edit-user',{user:userData});
        } else{
            res.redirect('/admin/dashboard');
        }
    } catch (error:any) {
            console.log(error.message);        
    }
};
export const updateUser= async(req:Request<{},{},UpdateUserRequestBody>,res:Response):Promise<void>=>{
    try {
        const {id,name,email,mno}=req.body;
        await User.findByIdAndUpdate(id,{
            $set:{
                name,
                email,
                mobile:mno
            }
        });
        res.redirect('/admin/dashboard');
    } catch (error:any) {
        console.log(error.message);
    }
};
export const deleteUser= async(req:Request,res:Response):Promise<void>=>{
    try {
        const id= req.query.id as string;
         await User.deleteOne({_id : id });
         res.redirect('/admin/dashboard');
    } catch (error:any) {
        console.log(error.message)
    }
}
export const searchUsers= async(req:Request,res:Response):Promise<void>=>{
    try {
        const searchQuery= (req.query.q as string) || "";
        const query= {
            is_admin:false, $or:[
                {name:{$regex:searchQuery,$options:"i"}},
                {email:{$regex:searchQuery,$options:"i"}}
            ]
        };
        const userData=await User.find(query) as IUser[];
        res.render('admin/dashboard',{users:userData,searchQuery})
    } catch (error:any) {
        console.log(error.message);
        res.render('admin/dashboard',{users:[],searchQuery:"",message:"An error occurred while searching"})
    }
}



export default{
    loadLogin,
    securePassword,
    verifyLogin,
    adminLogout,
    loadHomePage,
    adminDashboard,
    newUserLoad,
    addUser,
    loadEditUserPage,
    updateUser,
    deleteUser,
    searchUsers,
    
    
}