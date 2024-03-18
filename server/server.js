const express = require('express');
const dotenv = require('dotenv'); dotenv.config();
const sqlDB = require('./config/sqlConnection');
const UserCode = require('./models/userCode');
const userCodeRoute = require('./routes/userCodeRoute');
const app = express();

sqlDB.sync();
const PORT = process.env.PORT;

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use('/api', userCodeRoute);

app.listen(PORT,()=>{
    console.log(`Server is Running on ${PORT}`);
});