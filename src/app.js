const express=require("express");
const connectDB=require("./config/database");
const app=express();
const User=require("./models/user");

app.use(express.json());

app.post("/user", async(req,res)=>{


    const user=new User(req.body);

    try{
        await user.save();

        res.send("User added...");
    }
    catch(err){
        res.status(400).send("Error occured:", err.message);
    }   

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


app.patch("/user",async(req,res)=>{

    const userId=req.body.userId;
    console.log(userId);

    try{
        await User.findByIdAndUpdate(userId,req.body,{runValidators: true});
        res.send("User updated successfully...");
    }
    catch(err){
        res.status(400).send("Something went wrong"+err.message);
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
