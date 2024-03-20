const path = require('path');
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

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname,'../client/build')));
    app.get('*',(req,res)=> res.sendFile(path.resolve(__dirname,'../client','build','index.html')));
}else{
    app.get('/', (req,res)=>{
        res.send('API is running....');
    });
}

app.listen(PORT,()=>{
    console.log(`Server is Running on ${PORT}`);
});