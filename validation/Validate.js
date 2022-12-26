const client = require("../config/dbconfig");

const validate=(data)=>{
const {firstname,lastname,email,password,confirmpassword} = data;
let errors=[];
if(!firstname || !lastname || !email || !password||!confirmpassword){
  errors.push({message:"Enter Details correctly!!!"})
}
if(password.length <8){
  errors.push({message:"Password should be 6 characters length!!!"})
}
if(password!==confirmpassword){
  errors.push({message:"Passwords donot match!!!"});
}
return errors;
}

module.exports={validate};