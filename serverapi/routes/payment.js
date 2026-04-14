const express = require('express');
const Payment = require('../models/payment');
const User = require('../models/user');
const {stkPush}  = require('../service/mpesa');
const asyncHandler = require('../middleware/asyncHandler');
const {authenticate}  = require('../middleware/auth');
const router = express.Router();

// Post /api/pay - start payment (must be logged in)
router.post('/', authenticate, asyncHandler(asyncHandler(async (req, res)=>{
     const {amount, reference} =req.body;

     //Get user's phone from DB
     const user = await User.findById(req.user.id);
     //format phone : 0712345678 --> 254712345678
     const phone = "254" + user.phone.slice(-9);

     //initiate  stk push 
     const result = await stkPush({
        phone, amount,
        reference: reference || "kenyaPay",
        description: 'Payment via KenyaPay'
     });
     //save pending payment to DB 
     const payment = await payment.create({
        user: req.user.id,
        phone, amount,
        reference,
        checkoutId: result.CheckoutRequestID, //key link to callback
        status: 'pending'
     });

     res.json({
        success:true,
        message:"check your phone and enter m-pesa pin",
        checkoutId:result.CheckoutRequestID
     })
})))

//POST /api/pay/callback --mpesa calls this after payment 
router.post('/callback', asyncHandler(async(req, res)=>{
    const stk = req.body.Body.stkCallback;
    const checkoutId = stk.CheckoutRequestID;

    if(stk.ResultCode === 0 ){
    //payment succeed
    const items = stk.callbackMetadata.Item;
    const amount = items.find(i=>i.Name === "amount").value;
    const Receipt = items.find(i=>i.Name === "MpesaReceiptNumber").value;

    //Find the pending payment by checkoutId and update it 
    await Payment.findOneAndUpdate(
        {checkoutId},
        {status: 'sucess',  mpessCode: receipt}
    );
}else{
        //payment failed or cancelled
        await Payment.findOneAndUpdate(
            {checkoutId},
            {status:'failed'}
        ) ;
     }
     //always respond ok to mpesa
     res.json({ResultCode: 0, ResltDesc: "Accepted"});
}
))

//GET /api.pay-get y payment hostory 
router.get('/', authenticate, asyncHandler(async(req, res)=>{
    const payments = await payment.find({user: req.user.id})
    .sort({CreatedAt: -1}); // Newest first
    res.json({sucess: true, payments});
}));

module.exports = router;



