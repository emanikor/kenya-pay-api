 const express  = require('express');
 const jwt  = require('jsonwebtoken');
 const  user  = require('../models/user');
 const asyncHandler = require('../middleware/asyncHandler');
 const router = express.Router();

//  POST / api/auth/register
router.post('/register', asyncHandler(async(req, res)=>{
    const {name , email, password, phone} =req.body;

    const exists = await user.findOne({email});
    if(exists){
        const err = new Error ("Email already registered");
        err.status =409;
        throw err;
    }
  const users =await user.create({name, email, password, phone});
  res.status(201).json({
      success: true,
      message: "Account created successfully"
  }); 
}));

// POST /api/auth/login
router.post('/login', asyncHandler(async (req, res) => {
    const {email, password} = req.body;

    const foundUser = await user.findOne({email});
    if (!foundUser || !(await foundUser.matchPassword(password))) {
        const err = new Error("Invalid email or password");
        err.status = 401;
        throw err;
    }

    const token = jwt.sign(
        {id: foundUser._id, email: foundUser.email},
        process.env.JWT_SECRET,
        {expiresIn: "7d"}
    );

    res.json({
        success: true,
        token,
        user: {
            name: foundUser.name,
            email: foundUser.email
        }
    });
}));


// GET /api/auth/profile (protected)
const {authenticate} = require('../middleware/auth');
router.get('/profile', authenticate, asyncHandler(async (req, res) => {
    const profile = await user.findById(req.user.id).select("-password");
    res.json({success: true, user: profile});
}));

 module.exports = router;