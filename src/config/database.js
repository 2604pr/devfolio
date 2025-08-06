const mongoose=require("mongoose");

const connectDB=async()=>{
    await mongoose.connect("mongodb+srv://pranshupatel833:Pranshu%4026@cluster0.mycq9pk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
}

//here in connection string .....password was "Pranshu@26"
//but instead of "@"....we had to write "%40" bcz @ is special character 
//and it is not allowed in password in mongodb connection string 

module.exports=connectDB;