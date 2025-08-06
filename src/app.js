const express=require("express");
const connectDB=require("./config/database");
const app=express();
const User=require("./models/user");


app.post("/signup", async(req,res)=>{


    const user=new User({
        firstName:"Chris",
        lastName:"Gayle",
        emailID:"abc@gmail.com",
        password:"abc@123",
        age:43,
        gender:"Male"
    });


    try{
        await user.save();

        res.send("User added...");
    }
    catch(err){
        res.status(400).send("Error occured:", err.message);
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
