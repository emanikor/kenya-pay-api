const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
   name: {type: string, required: true},
   email : {type: string , required:true , unique:true, lowercase: true},
   password: {type: string, required: true},
   phone: {type: string, required: true},
   CreatedAt: {type: Date, default: Date.now }

})


//before saving lets hash the password
userSchema.pre('save', async function(next){
  //only hashing if passwrod was changed
  if(!this.isModified("password")) {
    return() ;
  }
//   12 salt round
  this.password =await bcrypt.hash(this.password, 12)
  next();
})

// method to check the password on login 
userSchema.methods.matchPassword =async function (plain) {

    return bcrypt.compare(plain , this.password);
    // compare hash plain with and compare with stores 
};

module.exports= mongoose.module("user", userSchema);