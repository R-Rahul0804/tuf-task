const UserCode = require('../models/userCode');

//1.create usercode form
//2. POST request - Public Access
exports.createUserCode = async(req,res)=>{
    try {
        const {username, codelanguage, stdin, sourcecode} = req.body;
        
        //all fields are required
        if(!username || !codelanguage || !stdin || !sourcecode){
            return res.status(400).json({message: 'Enter All fields'});
        }

        const newUserCode = await UserCode.create({username,codelanguage,stdin,sourcecode});
        res.status(200).json(newUserCode);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({message: 'Server Error'});
    }
};

//1.Get All usercode Details
//2. GET request - Public Access
exports.getUserCode = async(req,res)=>{
    try {
        const usercode = await UserCode.findAll();
        res.status(200).json(usercode);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({message: 'Server Error'});
    }
};