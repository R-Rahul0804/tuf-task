const express = require('express');
const dotenv = require('dotenv'); dotenv.config();
const db = require('./config/sqlConnection');
const userCodeRoute = require('./routes/userCodeRoute');
const app = express();

db.sync();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use('/api', userCodeRoute);

app.listen(PORT,()=>{
    console.log(`Server is Running on ${PORT}`);
});