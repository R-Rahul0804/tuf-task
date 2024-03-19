const UserCode = require('../models/userCode');
const axios = require('axios');
const dotenv = require('dotenv'); dotenv.config();
const { Buffer } = require('buffer');
const redis = require('redis');
 
const redisClient = redis.createClient({
    port: 6379,
    host: "127.0.0.1"
})

// Function to encode a string to base64
function encodeToBase64(text) {
    return Buffer.from(text).toString('base64');
}

//1.create usercode form
//2. POST request - Public Access
exports.createUserCode = async(req,res)=>{
    try {
        const {username, codelanguage, stdin, sourcecode,output} = req.body;
        
        //all fields are required
        if(!username || !codelanguage || !sourcecode || !output){
            return res.status(400).json({message: 'Enter All fields'});
        }

        const newUserCode = await UserCode.create({username,codelanguage,stdin,sourcecode, output});
        res.status(200).json(newUserCode);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({message: 'Server Error'});
    }
};

const getAllUserCode = async()=>{
    try {
        let res = await UserCode.findAll();
        let ans = res;
        redisClient.set(
            "ans",
            JSON.stringify(ans)
        );
        redisClient.setex("ans", 3600, JSON.stringify(ans));
        return ans;
    } catch (e) {
        throw new Error(e);
    }
}

const checkCache = (req,res,next)=>{
    redisClient.get("ans",(err,data)=>{
        if(err){
            return next(err);
        }
        if(data!==null){
            res.status(200).json(JSON.parse(data));
        }else{
            next();
        }
    })
}

//1.Get All usercode Details
//2. GET request - Public Access
exports.getUserCode = async(req,res)=>{
    try {   
            checkCache(req,res,async()=>{
                const usercode = await getAllUserCode();
               res.status(200).json(usercode);
            })   
    } catch (error) {
        console.error(error.message);
        res.status(500).json({message: 'Server Error'});
    }
};

const getSingleUserCodeData = async(id)=>{
    try {
        const res = await UserCode.findByPk(id);
        return res;
    } catch (e) {
        throw new Error(e);
    }
}

const checkCacheSingleUser = (req,res,next)=>{
    const {id} = req.params;
    redisClient.get(id,(err,data)=>{
        if(err){
            return next(err);
        }
        if(data!==null){
            res.status(200).json(JSON.parse(data));
        }else{
            next();
        }
    })
}

//1.Get Single usercode Details
//2. GET request - Public Access
exports.getSingleUserCode = async(req,res)=>{
    try {
        const{id} = req.params;
        checkCacheSingleUser(req,res,async()=>{
        const usercode = await getSingleUserCodeData(id);
        if(!usercode){
            return res.status(400).json({message:'User Not Found'});
        }
        redisClient.setex(id, 3600, JSON.stringify(usercode));
        res.status(200).json(usercode);
        })
    } catch (error) {
        console.error(error.message);
        res.status(500).json({message: 'Server Error'});
    }
}



// POST /api/runCode
// Run code
exports.runCode = async (req, res) => {
    try {
        const { language_id, source_code, stdin } = req.body;

        // Encode source_code and stdin to base64
        const encodedSourceCode = encodeToBase64(source_code);
        const encodedStdin = encodeToBase64(stdin);

        const options = {
            method: 'POST',
            url: 'https://judge0-ce.p.rapidapi.com/submissions',
            params: {
                base64_encoded: 'true',
                fields: '*'
            },
            headers: {
                'content-type': 'application/json',
                'Content-Type': 'application/json',
                'X-RapidAPI-Key': '2903c1ea6dmsh69d7172a87928dcp18b991jsn4f9624e3df32',
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            },
            data: {
                language_id,
                source_code: encodedSourceCode,
                stdin: encodedStdin
            }
        };

       const response = await axios.request(options);
       // req.session.submissionToken = response.data.token;
       const token = response.data.token;

       const submissionDetails = await fetchSubmissionDetailsWithLongPolling(token);

       // Return the submission details to the client
       res.status(200).json(submissionDetails);

    //    const submissionDetailsResponse = await axios.get(`https://judge0-ce.p.rapidapi.com/submissions/${token}`,{
    //     params: {
    //         base64_encoded: 'true',
    //         fields: '*'
    //     },
    //     headers: {
    //         'X-RapidAPI-Key': '2903c1ea6dmsh69d7172a87928dcp18b991jsn4f9624e3df32',
    //         'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
    //     }
    //    });
    //     res.status(200).json(submissionDetailsResponse.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};


async function fetchSubmissionDetailsWithLongPolling(token) {
    const options = {
        method: 'GET',
        url: `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
        params: {
            base64_encoded: 'true',
            fields: '*'
        },
        headers: {
            'X-RapidAPI-Key': '2903c1ea6dmsh69d7172a87928dcp18b991jsn4f9624e3df32',
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        }
    };

    let response;
    do {
        // Make a request to fetch submission details
        response = await axios.request(options);

        // Check if the submission is still processing
        if (response.data.status.id === 2) { // Processing
            // Wait for a certain period (e.g., 1 second) before making the next request
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    } while (response.data.status.id === 2); // Continue polling until the status changes

    // Once the status changes, return the final response
    return response.data;
}


exports.getSubmissionDetails = async (req, res) => {
    try {
        //const { submissionId } = req.params;
        const token = req.session.submissionToken;

        const options = {
            method: 'GET',
            url: `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
            params: {
                base64_encoded: 'true',
                fields: '*'
            },
            headers: {
                'X-RapidAPI-Key': '2903c1ea6dmsh69d7172a87928dcp18b991jsn4f9624e3df32',
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            }
        };

        const response = await axios.request(options);
        res.status(200).json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};










  // const redisClient = await setupRedis();
        // redisClient.get('allUserCode', async(err,data)=>{
        //     if(data){
        //         res.status(200).json({
        //             error:false,
        //             message: `Data from from the cache`,
        //             data: JSON.parse(data)
        //         });
        //     }else{

          //redisClient.setex('allUserCode', 3600, JSON.stringify(usercode)); // Cache for 1 hour (3600 seconds)
              //        }
    //    }); 