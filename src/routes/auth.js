const express=require("express");
const authRouter=express.Router();
const {validateSignupdata}=require("../utils/validate");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const User=require("../models/user");


authRouter.post("/login",async(req,res)=>{
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

authRouter.post("/signup", async(req,res)=>{

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

});

authRouter.post("/logout",async(req,res)=>{
    res.cookie("token",null,{
        expires:new Date (Date.now())
    });
    res.send("Logout Successfull...")
})

module.exports=authRouter;
