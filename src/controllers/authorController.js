const AuthorModel = require("../models/authorModel")

const createAuthor= async function (req, res) {
    try{
        let {title,firstName,lastName,emailId,password}=req.body
        if(!title){
            return res.status(400).send({status:false,message:"author title is required"})
        }
        if(!firstName){
            return res.status(400).send({status:false,message:"author first name is required"})
        }
        if(!lastName){
            return res.status(400).send({status:false,message:"author last name is required"})
        }
        if(!emailId){
            return res.status(400).send({status:false,message:"author email is required"})
        }
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailId)) {
            res.status(400).send({status: false,message: `Email should be a valid email address`});
        }
    
        if(!password){
            return res.status(400).send({status:false,message:"author password is required"})
        }
        

        
        
            let authorCreated =await AuthorModel.create(req.body)
            res.status(201).send({status:true,date:authorCreated, msg:"created"}) 
        
        }catch (err)
        {
            return res.status(500).send({status:false,msg:err.message})
        }
    
};
    
 module.exports.createAuthor=createAuthor