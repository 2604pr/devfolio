const adminAuth=(req,res,next)=>{
    console.log("Admin is getting auth");

    const token="xyz";
    const isAuthenticated=token=="xyz";
    
    if(!isAuthenticated){
        res.status(401).send("unauthorized");
    }
    else{
        next();
    }
}

module.exports={adminAuth};