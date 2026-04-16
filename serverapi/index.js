require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 3000;

async function start() {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Kenya PAY API server is running on ${PORT}`);
    });
}

start();