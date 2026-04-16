const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
    phone: String,
    amount: Number,
    reference: String,
    status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' }, 
    mpesaCode: String,
    checkoutId: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Payment", paymentSchema); // 