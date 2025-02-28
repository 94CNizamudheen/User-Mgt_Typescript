

import mongoose, { Model, Schema,Document } from "mongoose";

interface IUser extends Document{
    _id: string;
    name:string;
    email:string;
    mobile:string;
    image:string;
    password:string;
    is_admin:boolean;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    mobile:{type:String,required:true},
    image:{type:String,required:true},
    is_admin:{type:Boolean,required:true,default:false},
});
const User:Model<IUser>=mongoose.model<IUser>('User',userSchema);

export default User;
export {IUser};

