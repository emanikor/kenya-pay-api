const axios = require('axios');
  
async function getToken(){
    //app credentialls from safaricom dev portal

    const {MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, MPESA_BASE_URL} = process.env;
   
    //combining them as key: secret and encode to base64
    const auth = buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString("base64");
   //auth endpoint 
    const { data } = await axios.get(
        `${MPESA_BASE_URL}/oauth/vl/generate?grant_type =client_credentials `, 
       {headers: {authorization:`basic ${auth}`}}
    )
   return data.access_token; 

}
// the pop up that appears on someone phone then to enter there mpesa-pin
async function  stkPush({phone, amount, reference, description}) {

    const {MPESA_BASE_URL, MPESA_SHORTCODE, MPESA_PASSKEY, MPESA_CALLBACK_URL} =process.env;
    
    // .
    const token =await getToken();

    //current time mpesa needs it to pass
    // form at 20260413120000
    const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "").slice(0, 14);

    // 
    const  password =  buffer.from(`${MPESA_SHORTCODE} ${MPESA_PASSKEY} ${timestamp}`).toString("base64");

    const {data } = await axios.post(
        `${MPESA_BASE_URL}/mpesa/stkpush/vl/processrequest`,
        {
            BussnessShortCode :MPESA_SHORTCODE,
            password : password,
            timestamp : timestamp,
            transactionType  :   "customerPayBillOnline",
            amount:  amount,
            partA: phone,
            partB: MPESA_SHORTCODE,
            Phone_Number : phone,
            CallBackUrl : MPESA_CALLBACK_URL,
            acountReference: reference,
            TransactionDesc: description 
        },

        {headers: {authorization: `Bearer ${token}`} }
    );

    return data; //contain checkoutRequestID -save this !


}

module.exports = { stkPush} ;