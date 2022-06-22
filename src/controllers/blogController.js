const AuthorModel = require("../models/authorModel");
const blogModel = require("../models/blogModel");
const BlogModel = require("../models/blogModel")

//create blog
const createBlog= async function (req, res) {
    try{
    const {authorId,title, body,catagory} = req.body
    if(!authorId){
        res.status(400).send({status:false, msg:"authorId field is required"})
     } else if(!title){
        res.status(400).send({status:false,msg:"title field is required"})
     } else if(!body){
        res.status(400).send({status:false,msg:"body is required"})
     } else if(!catagory){
        res.status(400).send({status:false,msg:"catagory is required"})
    }else{
        const author=await AuthorModel.findById(authorId);
        if(!author){
            res.status(400).send({status:false,msg:"Author Id is not valid"})
            
            
        }else{
            let blogCreated = await BlogModel.create(req.body)
            res.status(201).send({status:true, data: blogCreated})
        }
    }

}catch (err) {
    console.log(err.message)
    res.status(500).send({ error: err.message })
  }
};


//Get Blogs

const blogs= async function (req, res) {
    try{
    let data = await BlogModel.find({$and:[{isDeleted:false},{ispublished:true}]})
    if(data.length===0){
        res.status(404).send({status:false,msg:"No data Found"})
    }else{
        let id=req.params.authorId
        let catagorykey=req.params.catagory
        let tagkey=req.params.tags
        let subcategorykey=req.params.subcategory
    let newdata=await BlogModel.find({isDeleted:false,ispublished:true , $or:[{authorId:id},{catagory:catagorykey},{tags:tagkey},{subcategory:subcategorykey}]})
    if(newdata.length===0){
        res.status(404).send({status:false,msg:"No blog Found"})
    }else{
        res.status(200).send({status:true,data:newdata})
    }
    }
}catch (err) {
    console.log(err.message)
    res.status(500).send({ error: err.message })
  }
};


//delete route

const deleblogs = async function (req,res){
    try{ 
    let blogId = req.params.blogId;
    if(!blogId){
        res.status(400).send({status:false,msg:"blog id is not valid"})
    }
    const blog = await BlogModel.findOne({_id:blogId, isDeleted:false});
    if (!blog){
      return res.status(404).send("blog not found");
    }

    const deletedBlog = await BlogModel.updateOne({_id:blogId},{$set:{isDeleted:true}},
        {new:true});
    res.status(201).send({data:deletedBlog, msg:"deleted successfully"});
  } 
  catch(err){
    res.status(500).send(err.message)
  }
   }






module.exports.createBlog=createBlog
module.exports.blogs=blogs
module.exports.deleblogs=deleblogs
