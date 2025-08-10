const User=require("../models/user");
const jwt=require("jsonwebtoken");


const userAuth=async (req,res,next)=>{

    try{
        const {token}=req.cookies;
        if(!token){
            throw new Error("Invalid token");
        }

        const decodedMessage=await jwt.verify(token,"Pranshu@123456qwer")

        const {_id}=decodedMessage;
        const user=await User.findById(_id);
        if(!user){
            throw new Error("Invalid user id, plz check again");
        }
        
        req.user=user;
        next();
    }
    catch(err){
        res.status(400).send("Error occured "+ err.message);
    }
}

module.exports=userAuth;