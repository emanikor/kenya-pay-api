const express =require('express');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth');
const payRoutes  = require('./routes/payment')
const cors = require('cors');
const helmet = require('helmet');


const app = express();


// security and parsing middleware (runs on every request)
app.use(express.json());//parse json body
app.use(express.urlencoded({extended:true})); //parse form data 
app.use(cors());
app.use(helmet());



// health check 
app.get('/', (req, res)=>{
    res.json({message: 'welcome to kenya-pay'})
})


//routes 
app.get('./api/auth', authRoutes);
app.get('./api/pay', payRoutes);


// 404 if routes not matched
app.user((req, res)=>{
    res.status(404).json({
        error: "route not found "
    })
})

// error handler -last
app.use(errorHandler);

module.exports =app;
