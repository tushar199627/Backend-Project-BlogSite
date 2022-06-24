const AuthorModel = require("../models/authorModel");
const BlogModel = require("../models/blogModel")

//create blog
const createBlog = async function (req, res) {
    try {
        const { authorId, title, body, catagory, ispublished, tags, subcategory } = req.body

        //validation starts
        if (!authorId) {
            res.status(400).send({ status: false, msg: "authorId field is required" })
        } else if (!title) {
            res.status(400).send({ status: false, msg: "title field is required" })
        } else if (!body) {
            res.status(400).send({ status: false, msg: "body is required" })
        } else
            if (!catagory) {
                res.status(400).send({ status: false, msg: "catagory is required" })
            } else {
                const author = await AuthorModel.findById(authorId);
                if (!author) {
                    res.status(400).send({ status: false, msg: "Author Id is not valid" })
                }

                //validations ends

                let blogss = {
                    title,
                    body,
                    authorId,
                    catagory,
                    tags,
                    subcategory,
                    ispublished: ispublished ? ispublished : false,
                    publishedAt: ispublished ? new Date() : null
                }
                let blogCreated = await BlogModel.create(blogss)
                res.status(201).send({ status: true, data: blogCreated })

            }

    } catch (err) {
        console.log(err.message)
        res.status(500).send({ error: err.message })
    }
};


//Get Blogs

const blogs = async function (req, res) {

    try {
        let authorId = req.query.author_Id
        let catagory = req.query.catagory
        let tagkey = req.query.tags
        let sub = req.query.subcategory
        let list = await BlogModel.find({ isDeleted: false, ispublished: true })
        if (!list.length) { res.status(404).send({ status: false, msg: "blog not found" }) }
        let bloglist = await BlogModel.find({ isDeleted: false, ispublished: true, $or: [{ author_Id: authorId }, { catagory: catagory }, { tags: tagkey }, { subcategory: sub }] })
        if (bloglist.length === 0) {
            res.status(404).send({ status: false, msg: "No blog Found" })
        } else {
            res.status(200).send({ status: true, data: bloglist })
        }
    }
    catch (err) {

        return res.status(500).send({ status: false, msg: err.message })
    }
};

//update blog

const updateblogs = async function (req, res) {
    try {
        let id = req.params.blogId;
        let authorToken=req.body.authorId


        let list1=await BlogModel.findOne({_id:id,isDeleted:false})
        if(list1 == null){return res.status(404).send({status:false,msg:"blog not found"})}

        if(list1.authorId.toString()!=authorToken){
            return res.status(400).send({status:false, msg:"Not authorised"});
        }
        if(!authorToken){
            res.status(400).send({status:false, msg:"not a valid author Id"})
        }


        let blogData = req.body
        let {body, title, subcategory,tags}=blogData


        if (blogData.body){
            if (!body) {return res.status(400).send({status:false,message:"body is not valid"})}
        }

        if (blogData.title){
            if (!title) {return res.status(400).send({status:false,message:"title is not valid"})}
        }

        if (blogData.subcategory){
            if (!subcategory) {return res.status(400).send({status:false,message:" subcategory is not valid"})}
        }

        if (blogData.tags){
            if (!tags) {return res.status(400).send({status:false,message:"tag is not valid"})}
        }

        let list = await BlogModel.findOneAndUpdate({_id:id,isDeleted:false},{
            $addToSet:{tags:{$each:blogData.tags},subcategory:{$each:blogData.subcategory}},
            title:blogData.title,
            body:blogData.body,
            publishedAt:new Date(),
            isDeleted:true
        },
            {new:true})
        if (list == null){
            res.status(404).send({status:false,msg:"blog not found"})
        }
        else{res.status(200).send({status:true,data:list})}
        
        
    }
    catch (error) {
        res.status(500).send({ msg: "Error", error: error.message })
    }
}

//delete route

const deleblogs = async function (req, res) {
    try {
        let blogId = req.params.blogId;
        let authorToken=req.body.authorId
        if (!blogId) {
            res.status(400).send({ status: false, msg: "blog id is not valid" })
        }
        const blog = await BlogModel.findOne({ _id: blogId, isDeleted: false });
        if (!blog) {
            return res.status(404).send("blog not found");
        }
        if(blog.authorId.toString()!=authorToken){
            return res.status(404).send({status:false, msg:"Not authorised"});
        }

        const deletedBlog = await BlogModel.updateOne({ _id: blogId }, { $set: { isDeleted: true, deleteAt: new Date() } },
            { new: true });
        res.status(201).send({ data: deletedBlog, msg: "deleted successfully" });
    }
    catch (err) {
        res.status(500).send(err.message)
    }
};


//Delete query param
const deleteQuery = async function (req, res) {
    try{
       
        let authorId = req.query.authorId
        let subcategory = req.query.subcategory
        let ispublished = req.query.ispublished
        let category = req.query.category
        let tags = req.query.tags

        
  
        let data= await BlogModel.findOne({$or:[{category: category  },{tags: tags},{subcategory: subcategory},{ispublished: ispublished}, { authorId: authorId }]})
  
  
        if(data.length == 0){
        return res.status(404).send({ status: false, msg: " Blog doesn't exist "})
        }
  
        let deletedUser = await BlogModel.updateMany( {authorId: authorId},
             { $set: { isDeleted: true} },
              { new: true })
  
        if (deletedUser.isDeleted == true) {
          res.status(400).send({status: false, msg: "blog is already deleted"})
        }
  
        res.status(200).send({status: true, msg: "deleted successfully", data: deletedUser });
    }
    catch(err){
        res.status(500).send({ msg: "Error", error: err.message })
    }
  }
  






module.exports.createBlog = createBlog
module.exports.blogs = blogs
module.exports.deleblogs = deleblogs
module.exports.deleteQuery = deleteQuery
module.exports.updateblogs = updateblogs
