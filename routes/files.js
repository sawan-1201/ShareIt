const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const File = require('../models/file')
const { v4: uuidv4 } = require('uuid');
const { response } = require('express');


let storage = multer.diskStorage({
    destination: (req , file, cb)=> cb(null, 'uploads/'), // storing for file destination in upload files
    filename: (req , file, cb)=>{ // generating uniqe file name for each file
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
              cb(null, uniqueName) //calling the function                    // less then one but greater then zero 
    }                                                                      // 1E9 that means this number is multiple my one bilion and round it
});                                                                        //extname for extension name of the file



let upload = multer({ 
    storage, 
    limits:{ fileSize: 1000000 * 100 },

    }).single('myfile'); //100mb single file 



router.post('/', (req,res)=>{

    //store files
    upload(req ,res, async(err)=>{

          //vallidation of request
            if(!req.file){ // if file not coming
                return res.json({error :"All fields are required!"});
            }

        
        if(err){
            return res.status(500).send({error: err.message})
        }

        //store into database
        const file=new File({
            filename: req.file.filename,
            uuid:  uuidv4(),
            path: req.file.path,    //multer doning these works
            size: req.file.size
        });

        const response = await file.save();
        return res.json({file: `${process.env.APP_BASE_URL}/files/${response.uuid}`}) // generating downloading page link
                                //http://localhost:5000/files/44e4c65c-30ba-4291-b8a2-c2fd6b0bab79
         

    });

    //Response -> link
});

router.post('/send', async (req, res) =>{
    
    const { uuid, emailTo, emailFrom }=req.body;
    //validate request
    if(!uuid || !emailTo || !emailFrom){
        return res.status(422).send({error: 'All fields are required'});
    }

    //get data from Database
    const file= await File.findOne({uuid: uuid})
    if(file.sender){
        return res.status(422).send({error: 'Email Allready sent'});
    }

    file.sender = emailFrom
    file.receiver = emailTo

    const response =  await file.save();

    // send email
    const sendMail= require('../services/emailService')
    sendMail({
        from: emailFrom,
        to: emailTo,
        subject: 'FileSharing',
        text: `${emailFrom} shared a file with you`,
        html: require('../services/emailTemplate')({
            emailFrom: emailFrom,
            downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size: parseInt(file.size/1000) + 'KB',
            expires: '24 hours'
        })
    });

    return res.send({success: true})
});

module.exports = router;