import mongoose ,{Connection} from 'mongoose';
import express ,{Application ,Request,Response,NextFunction}from "express";
import session from "express-session";
import nocache from "nocache";
import path from "path";
import dotenv from "dotenv";
import exp from 'constants';


declare module 'express-session' {
    interface SessionData {
      user_id?: string | number; 
    }
  };
  
// import userRoutes from './routes/userRoutes'

mongoose.connect("mongodb://127.0.01:27017/user_managment_system")
                .then(()=>{
                    console.log("Connected to MongoDb");
                })
                .catch((err:Error)=>{
                    console.log("MongoDb connection Error: ",err);
                });

dotenv.config();
const app:Application = express();

app.use(express.json());
app.use(nocache())
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(session({secret:"secret",resave:false,saveUninitialized:true,cookie: { secure: false }}));

// app.use('/',userRoute);
// app.use('/admin',adminRoute);


const port= process.env.PORT||2900;
app.listen(port,()=>console.log(`runnig on port ${port}`));

export default app;