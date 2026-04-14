const jwt = require('jsonwebtoken');

function authenticate(req, res, next){
// looking for a web token authorization
const authHeader = req.headers.authorization;

// if there is no header
if(!authHeader){
    return res.status(401).json({
         sucess:false, 
         error:"no token provided"
    })
}
// we split the bearer token 
const token = authHeader.split("")[1];

try{
      // decode and verify the token
     const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // attach user info to req
       req.user = decode;
    //next()if the token is good
      next()     
     }catch(err){
        res.status(401).json({
            sucess:false, 
         error:"invalid token or expired"
        })
   
}
}

module.exports = {authenticate};
