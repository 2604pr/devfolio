const express=require("express");

const app=express();

app.get("/test",
    (req,res,next)=>{
    console.log("hello Yash ");

    next();
    },

    (req,res,next)=>{
        console.log("hello Yash 2 ");
    
        //res.send("/hello yash");
    }



)

app.post("/hello",(req,res)=>{
    

    res.send({
        firstname:"Yash",
        age:21,
        gender:"Male"
    });
})

app.put("/hello",(req,res)=>{
    

    res.send({
        age:21,
        gender:"Female"
    });
})

app.patch("/hello",(req,res)=>{
    

    res.send({
        firstname:"Yash",
        age:31,
        gender:"Male"
    });
})

app.post("/hello",(req,res)=>{
    console.log("hello Yash ");
    
    res.send("post /hello yash");
})

app.use("/hello/2",(req,res)=>{
    res.send("Hello from /hello/2");
});


app.use("/hello",(req,res)=>{
    res.send("Hello from /hello");
});

// app.use("/test",(req,res)=>{
//     res.send("Hello from server,test");
// });

app.use("/",(req,res)=>{
    res.send("Hello from /");
});

app.use((req,res)=>{
    res.send("Hello from server,8000");
});

app.listen(8000,()=>{
    console.log("Server is listening on port, 8000");
})