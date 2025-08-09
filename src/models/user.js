const mongoose=require("mongoose");

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
        maxlength:20,
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:4,
        maxlength:20,
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


const userModel=mongoose.model("User",userSchema);

module.exports=userModel;