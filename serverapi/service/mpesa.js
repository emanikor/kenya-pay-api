const axios = require('axios');

async function getToken() {
  const { MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, MPESA_BASE_URL } = process.env;

  const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString("base64");

  try {
    const { data } = await axios.get(
      `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
      { headers: { Authorization: `Basic ${auth}` } }
    );
    return data.access_token;
  } catch (error) {
    console.error("Token Generation Error:", error.response?.data || error.message);
    throw error;
  }
}

async function stkPush({ phone, amount, reference, description }) {
  const { MPESA_BASE_URL, MPESA_SHORTCODE, MPESA_PASSKEY, MPESA_CALLBACK_URL } = process.env;

  try {
    const token = await getToken();

    const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "").slice(0, 14);

    const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString("base64");
    
    // Fixed 'vl' to 'v1'
    const { data } = await axios.post(
      `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      {
        BusinessShortCode: MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: MPESA_SHORTCODE,
        PhoneNumber: phone,
        CallBackURL: MPESA_CALLBACK_URL,
        AccountReference: reference,
        TransactionDesc: description
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return data;
  } catch (error) {
    console.error("STK Push Error:", error.response?.data || error.message);
    throw error;
  }
}

module.exports = { stkPush };