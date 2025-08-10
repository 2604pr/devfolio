const mongoose=require("mongoose");
const validator=require("validator");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");

const userSchema=mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true,
        minlength:4,
        maxlength:15,

    },
    lastName:{
        type:String
    },
    emailID:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        minlength:8,
        maxlength:30,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address "+ value);
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:4,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong password " + value);
            }
        }
    },
    age:{
        type:Number,
        min:18,
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","others"]==value){
                throw new error("Not a valid gender");
            }
        }
    },
    photourl:{
        type:String,
        default:"https://bbdu.ac.in/tpocontacts/dummy-image1/",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid photo URL " + value);
            }
        }
    },
    about:{
        type:String,
        default:"Write your bio"
    },
    skills:{
        type:[],
    }
},
{timestamps:true});

userSchema.methods.getJWT=async function () {
    const user=this;

    const token=await jwt.sign({_id:user._id},"Pranshu@123456qwer",{
        expiresIn:"7d"
    });

    return token;
}

userSchema.methods.validatePassword=async function (passwordInputByUser) {
    const user=this;
    const hashPassword=user.password;

    const validPass=await bcrypt.compare(passwordInputByUser,hashPassword);   

    return validPass;
}

const userModel=mongoose.model("User",userSchema);

module.exports=userModel;