const express=require("express");
const requestRouter=express.Router();
const User=require("../models/user");
const userAuth=require("../middlewares/auth");

requestRouter.post("/sendconnectionRequest", userAuth, async(req,res)=>{

    const user=req.user;
    if(!user){
        res.send("Invalid credentials, check again")
    }
    res.send(user.firstName +" sent a connection request...")
})

module.exports=requestRouter;