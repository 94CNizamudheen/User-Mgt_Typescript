import mongoose  from 'mongoose';
import express ,{Express,Request,Response ,NextFunction }from "express";
import session from "express-session";
import nocache from "nocache";
import path from "path";
import dotenv from "dotenv";
import config from './config/config';
import routes from './routes/routes'
import { promises } from 'dns';


declare module 'express-session' {
    interface SessionData {
      user_id?: string | number; 
    }
  };
  
interface SessionConfig{
  secret:string;
  resave:boolean;
  saveUninitialized:boolean;
};

dotenv.config();
mongoose.connect("mongodb://127.0.0.1:27017/user_management_system")
                .then(()=>{
                    console.log("Connected to MongoDb");
                })
                .catch((err:Error)=>{
                    console.log("MongoDb connection Error: ",err);
                });


const app:Express = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(nocache())
app.use(express.static(path.join(__dirname,'public')));

app.use(session({
  secret:config.sessionSecret,
  resave:false,
  saveUninitialized:false
}as SessionConfig));

app.set("view engine","ejs");
app.set("views",[
  path.join(__dirname,'views/user'),
  path.join(__dirname,'views')
]);



app.use('/',routes)



const port:number|string = process.env.PORT||2900;
app.listen(port,()=>console.log(`runnig on port http://localhost:${port}`));

app.use((err:Error,req:Request,res:Response,next:NextFunction)=>{
  console.error(err.stack);
  res.status(500).send("Something Broke!");
})

export default app;