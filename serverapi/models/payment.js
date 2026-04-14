// payment 
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
      user : {type: mongoose.Schema.Types.ObjectId, ref:"user"},
      phone: String,
      amount: Number,
      reference: String,
      status: {type: String, enum: ['pending', 'sucess', 'failed'], default:'pending'},
      mpesaCode: String, //Receipt number from m-pesa
      checkoutId: String, // m-pesa's checkoutRequestID (links call to) payment)
       CreatedAt: {type: Date, default: Date.now }
})

module.exports = mongoose.model("payment", paymentSchema);
