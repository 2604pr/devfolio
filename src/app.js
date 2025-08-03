const express=require("express");

const app=express();

app.use("/hello",(req,res)=>{
    res.send("Hello from /hello");
});

app.use("/test",(req,res)=>{
    res.send("Hello from server,test");
});

app.use((req,res)=>{
    res.send("Hello from server,8000");
});

app.listen(8000,()=>{
    console.log("Server is listening on port, 8000");
})