const express=require("express");
const requestRouter=express.Router();
const userAuth=require("../middlewares/auth");
const connectionRequest=require("../models/connectionRequest");
const user=require("../models/user");
const mongoose=require("mongoose");


requestRouter.post("/request/send/:status/:toUserId", userAuth, async(req,res)=>{

    try{
        const fromUserId=req.user._id;
        const toUserId=req.params.toUserId;
        const status=req.params.status;

        const allowedStatus=["ignored","interested"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message:"Invalid status",
                status
            })
        }

        const existingConnectionRequest=await connectionRequest.findOne({
            $or:[{fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId}
            ]
        });

        const isUserExists=await user.findById(toUserId);
        if(!isUserExists){
            return res.status(404).json({message:"User not found..."})
        }

        if(existingConnectionRequest){
            return res.status(400).json({message:"Request already exists.."});
        }

        const request=new connectionRequest({
            fromUserId,
            toUserId,
            status,
        });

        console.log(request);

        const data=await request.save();

        res.json({
            message:"Connection request sent successfully....",
            data
        });
         
    }
    catch(err){
        res.status(400).send("Error occured " + err.message);
    }
    
})

requestRouter.post("/request/review/:status/:requestId", userAuth, async(req,res)=>{

    try{
        const {status, requestId}=req.params;
        const loggedInUser=req.user;  

        const allowedStatus=["accepted", "rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"Not a valid status "});
        }

        console.log("loggedInUser._id (raw):", loggedInUser._id);
        console.log("typeof loggedInUser._id:", typeof loggedInUser._id);
        console.log("String(loggedInUser._id):", String(loggedInUser._id));

        const connectionReq=await connectionRequest.findOne({
            _id:requestId,
            status:"interested",
            toUserId:String(loggedInUser._id),
            
        });

        // const connectionReq = await connectionRequest.findOne({
        // _id: requestId,
        // status: "interested",
        // $or: [
        //     { toUserId: loggedInUser._id },
        //     { fromUserId: loggedInUser._id }
        // ]
        // });

        
        console.log("Found request:", connectionReq);

        if(!connectionReq){
            return res.status(400).json("Not a valid connection request ");
        }
        
        connectionReq.status=status;

        const data=await connectionReq.save();

        res.json({message:"Connection request " +status ,data});
    }

    catch(err){
        res.status(400).send("error occured "+ err.message);
    }
})

module.exports=requestRouter;