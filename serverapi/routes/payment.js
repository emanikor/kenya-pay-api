const express = require('express');
const Payment = require('../models/payment');
const User = require('../models/user');
const { stkPush } = require('../service/mpesa');
const asyncHandler = require('../middleware/asyncHandler');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// POST /api/pay - start payment (must be logged in)
router.post('/', authenticate, asyncHandler(async (req, res) => { 
    const { amount, reference } = req.body;

    const user = await User.findById(req.user.id);
    const phone = "254" + user.phone.slice(-9);

    const result = await stkPush({
        phone, amount,
        reference: reference || "kenyaPay",
        description: 'Payment via KenyaPay'
    });

    const newPayment = await Payment.create({ 
        user: req.user.id,
        phone, amount,
        reference,
        checkoutId: result.CheckoutRequestID,
        status: 'pending'
    });

    res.json({
        success: true,
        message: "Check your phone and enter M-Pesa PIN",
        checkoutId: result.CheckoutRequestID
    });
}));

// POST /api/pay/callback - mpesa calls this after payment
router.post('/callback', asyncHandler(async (req, res) => {
    const stk = req.body.Body.stkCallback;
    const checkoutId = stk.CheckoutRequestID;

    if (stk.ResultCode === 0) {
        const items = stk.CallbackMetadata.Item; 
        const amount = items.find(i => i.Name === "Amount").value; // ✅ capital A in Amount
        const receipt = items.find(i => i.Name === "MpesaReceiptNumber").value;

        await Payment.findOneAndUpdate(
            { checkoutId },
            { status: 'success', mpesaCode: receipt } 
        );
    } else {
        await Payment.findOneAndUpdate(
            { checkoutId },
            { status: 'failed' }
        );
    }

    res.json({ ResultCode: 0, ResultDesc: "Accepted" }); 
}));

// GET /api/pay - get payment history
router.get('/', authenticate, asyncHandler(async (req, res) => {
    const payments = await Payment.find({ user: req.user.id }) // ✅ Payment capital P
        .sort({ createdAt: -1 });
    res.json({ success: true, payments }); // ✅ success not sucess
}));

module.exports = router;