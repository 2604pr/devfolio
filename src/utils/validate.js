const validator=require("validator");

const validateSignupdata=(req)=>{

    const {firstName,lastName,emailID,password}=req.body;

    if(!firstName||!lastName){
        throw new Error("Not a valid name");
    }

    else if(firstName.length<4||firstName.length>50){
        throw new Error("Please enter name between 4-50 characters");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Enter a strong password " + value);
    }

}

const validateEditProfileData=(req)=>{
    const allowedFields=["firstName","lastName","emailID", "age", "gender", "skills","about","photourl"];

    const isEditAllowed=Object.keys(req.body).every((field)=>{
        allowedFields.includes(field)
    });

    return isEditAllowed;
}

module.exports={validateSignupdata, validateEditProfileData};