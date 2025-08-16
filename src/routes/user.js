const express=require("express");
const userRouter=express.Router();
const userAuth=require("../middlewares/auth");
const connectionRequest=require("../models/connectionRequest");

const requiredData="firstName lastName about age skills";

userRouter.get("/user/request/recieved", userAuth, async(req,res)=>{

    try{
        const loggedInUser=req.user;
        const connectionRequests=await connectionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested"
        }).populate("fromUserId",requiredData);

       res.json({message:"Data fetched successfully ", connectionRequests});
    }
    catch(err){
        res.status(400).send("Error occured "+ err.message);
    }
})

userRouter.get("/user/connections", userAuth, async(req,res)=>{
    try{
        const loggedInUser=req.user;
        const connectionRequests=await connectionRequest.find({
            $or:[
                {fromUserId:loggedInUser._id, status:"accepted"},
                {toUserId:loggedInUser._id, status:"accepted"}
            ]
        }).populate("fromUserId",requiredData).populate("toUserId",requiredData);


        const data=connectionRequests.map((row)=>{
            if(row.fromUserId._id.toString()==loggedInUser._id.toString()){
                return row.toUserId;
            }
        
            return row.fromUserId;
        });

        res.json({message:"Connections available are: ",data});

    }
    catch(err){
        res.status(400).send("Error occured "+ err.message);
    }
})

module.exports=userRouter;