const express=require("express");
const connectDB=require("./config/database");
const app=express();
const User=require("./models/user");
const {validateSignupdata}=require("./utils/validate");
const bcrypt=require("bcrypt");
const cookieParser=require("cookie-parser");
const jwt=require("jsonwebtoken");
const userAuth=require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async(req,res)=>{

    try{

        validateSignupdata(req);

        const{firstName,lastName,emailID,password}=req.body;

        const duplicate=await User.findOne({ emailID });
        
        if(duplicate){
            res.status(400).send("Email already exists, try a different one");
        }

        const passwordHash=await bcrypt.hash(password,10);
        console.log(passwordHash);

        const user=new User({
            firstName,
            lastName,
            emailID,
            password:passwordHash
        })

        await user.save();

        res.send("User added...");
    }
    catch(err){
        res.status(400).json({ error: err.message });
    }   

})

app.post("/login",async(req,res)=>{


    try{
        const {emailID,password}=req.body;

        const emailExists=await User.findOne({emailID:emailID});

        if(!emailExists){
            throw new Error("This email does not exist, please Signup first...");
        }

        const validPass=await emailExists.validatePassword(password);

        if(validPass){
            const token=jwt.sign({_id:emailExists._id.toString()},"Pranshu@123456qwer",{
                expiresIn:"7d"
            })
            console.log(token);
            res.cookie("token",token,{
                expires:new Date(Date.now()+8*3600000)
            })
            res.send("Login successful");
        }
        else{
            throw new Error("Login unsuccessful, check credentials")
        }

    }
    catch(err){
        res.status(400).send("Error occured "+ err.message);
    }
});

app.get("/profile",userAuth,async(req,res)=>{
    try{
        const user=req.user;
        res.send(user);

    }
    catch(err){
        res.status(400).send("Error occured "+ err.message);
    }
});

app.post("/sendconnectionRequest", userAuth, async(req,res)=>{

    const user=req.user;
    if(!user){
        res.send("Invalid credentials, check again")
    }
    res.send(user.firstName +" sent a connection request...")
})

app.get("/user", async(req,res)=>{

    const userEmail=req.body.emailID;

    try{
        const user=await User.find({emailID:userEmail});
        res.send(user);
    }
    catch(err){
        res.status(400).send("error occured..."+err.message);
    }

})


app.get("/feed", async(req,res)=>{

    const userEmail=req.body.emailID;

    try{
        const users=await User.find({});
        res.send(users);
    }
    catch(err){
        res.status(400).send("error occured..."+err.message);
    }

})


app.delete("/user", async(req,res)=>{

    const userId=req.body.userId;

    try{
        const user=User.findByIdAndDelete({_id:userId});
       
        if (!user) {
            return res.status(404).send("User not found; nothing deleted.");
        }

        res.send("User deleted successfully...");
    }
    catch(err){
        res.status(400).send("Something went wrong"+err.message);
    }
})


app.patch("/user/:userId",async(req,res)=>{

    const userId=req.params?.userId;
    console.log(userId);

    try{
        const ALLOWED_UPDATES=["photourl","skills","about"];
        const isUpdateAllowed=Object.keys(req.body).every((k)=>
            ALLOWED_UPDATES.includes(k)
        )

        if(!isUpdateAllowed){
            throw new error("Update not allowed");
        }

        if(Array.isArray(req.body?.skills) && req.body.skills.length > 10){
            throw new Error("Update not allowed, reduce length in skills");
        }

        await User.findByIdAndUpdate(userId,req.body,{runValidators: true});
        res.send("User updated successfully...");
    }
    catch(err){
        res.status(400).send("Something went wrong " + err.message);
    }
})


connectDB().then(()=>{
    console.log("Database connected successfully...");


    app.listen(8000,()=>{
        console.log("Server is listening on port, 8000");
    })
})
.catch((err)=>{
    console.log("Database connection unsuccessful.....",err.message);
})
