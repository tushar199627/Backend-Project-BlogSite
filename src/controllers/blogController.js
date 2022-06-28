const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
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
                    res.status(400).send({ status: false, msg: "Author doesnt not exist" })
                }

                //validations ends

                let blogss = {
                    title,
                    body,
                    authorId,
                    catagory,
                    ispublished: ispublished ? ispublished : false,
                    publishedAt: ispublished ? new Date() : null
                }
                if (tags) {
                    if (Array.isArray(tags)) {
                        blogss['tags'] = [...tags]
                    }
                    if (Object.prototype.toString.call(tags) === "[object string]") {
                        blogss["tags"] = [tags]
                    }
                }

                if (subcategory) {
                    if (Array.isArray(subcategory)) {
                        blogss['subcategory'] = [...subcategory]
                    }
                    if (Object.prototype.toString.call(subcategory) === "[object string]") {
                        blogss["subcategory"] = [subcategory]
                    }
                }

                let blogCreated = await BlogModel.create(blogss)
                res.status(201).send({ status: true, data: blogCreated, msg: "Blogs created Successfully" })

            }

    } catch (err) {
        console.log(err.message)
        res.status(500).send({ error: err.message })
    }
};


//Get Blogs

const blogs = async function (req, res) {

    const isValid = function (value) {

        if (typeof value == "undefined" || value == null) return false;
        if (typeof value == "string" && value.trim().length === 0) return false;
        return true;
    }
    const isValidReqestBody = function (requestBody) {
        return Object.keys(requestBody).length > 0;
    }

    const isValidObjectId = function (objectId) {
        return ObjectId.isValid(objectId)
    }

    try {
        const filter = { isDeleted: false, deletedAt: null, ispublished: true };
        const queryParam = req.query;

        if (!isValidReqestBody(queryParam)) {
            const { authorId, catagory, subcategory, tags } = queryParam;

            if (isValid(authorId) && isValidObjectId(authorId)) {
                filter["authorId"] = authorId;
            };

            if (isValid(catagory)) {
                filter["catagory"] = catagory.trim()
            };

            if (isValid(tags)) {
                let tagsArry = tags.trim().split(',').map(tag => tag.trim());
                filter['tags'] = { $all: tagsArry }
            };

            if (isValid(subcategory)) {
                let subCategoryArry = subcategory.trim().split(',').map(tag => tag.trim());
                filter['subcategory'] = { $all: subCategoryArry }
            };
        }

        const blogs = await BlogModel.find(queryParam);

        if (Array.isArray(blogs) && blogs.length === 0) {
            res.status(400).send({ status: false, message: "No blogs found" })
            return
        }

        res.status(200).send({ status: true, message: "Blogs list", data: blogs })

    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

//update blog

const updateblogs = async function (req, res) {
    try {
        let id = req.params.blogId;
        let Token = req.authorId

        if (!Token) {
            res.status(400).send({ status: false, msg: "Not a valid author Id" })
        }


        let list1 = await BlogModel.findOne({ _id: id, isDeleted: false })

        if (list1 == null) { return res.status(404).send({ status: false, msg: "blog not found" }) }



        let blogData = req.body
        let { body, title, subcategory, tags } = blogData


        if (blogData.body) {
            if (!body) { return res.status(400).send({ status: false, message: "body is not valid" }) }
        }

        if (blogData.title) {
            if (!title) { return res.status(400).send({ status: false, message: "title is not valid" }) }
        }

        if (blogData.subcategory) {
            if (!subcategory) { return res.status(400).send({ status: false, message: " subcategory is not valid" }) }
        }

        if (blogData.tags) {
            if (!tags) { return res.status(400).send({ status: false, message: "tag is not valid" }) }
        }

        if (list1.authorId.toString() != Token) {
            return res.status(400).send({ status: false, msg: "Not authorised" });
        }

        let list = await BlogModel.findOneAndUpdate({ _id: id, isDeleted: false }, {
            $addToSet: { tags: { $each: blogData.tags }, subcategory: { $each: blogData.subcategory } },
            title: blogData.title,
            body: blogData.body,
            publishedAt: new Date(),
        },
            { new: true })
        if (list == null) {
            res.status(404).send({ status: false, msg: "Blog not found" })
        }
        else { res.status(200).send({ status: true, data: list ,msg:"Blog Updated Successfully"}) }


    }
    catch (error) {
        res.status(500).send({ msg: "Error", error: error.message })
    }
}

//delete route

const deleblogs = async function (req, res) {
    try {
        let blogId = req.params.blogId;
        let Token = req.authorId
        if (!blogId) {
            res.status(400).send({ status: false, msg: "blog id is not valid" })
        }
        const blog = await BlogModel.findOne({ _id: blogId, isDeleted: false });
        if (!blog) {
            return res.status(404).send("blog not found");
        }
        if (blog.authorId.toString() != Token) {
            return res.status(404).send({ status: false, msg: "Not authorised" });
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

    const isValid = function (value) {

        if (typeof value == "undefined" || value == null) return false;
        if (typeof value == "string" && value.trim().length === 0) return false;
        return true;
    }
    const isValidReqestBody = function (requestBody) {
        return Object.keys(requestBody).length > 0;
    }

    const isValidObjectId = function (objectId) {
        return ObjectId.isValid(objectId)
    }

    try {
        const filter = { isDeleted: false, deletedAt: null };
        const queryParam= req.query;
        const Token = req.authorId

        if (!isValidReqestBody(queryParam)) {
            res.status(400).send({ status: false, messag: `${queryParam} No query params received. Aborting delete operation` })
            return
        }

        if (!isValidObjectId(Token)) {
            res.status(400).send({ status: false, messag: `${Token} is not a valid token id` })
            return
        }
        ;
        const { authorId, catagory, tags, subcategory, ispublished } = queryParam;

        if (isValidReqestBody(queryParam)) {

            if (isValid(authorId) && isValidObjectId(authorId)) {
                filter["authorId"] = authorId;
            };

            if (isValid(catagory)) {
                filter["catagory"] = catagory.trim()
            };

            if (isValid(ispublished)) {
                filter["ispublished"] = ispublished
            }

            if (isValid(tags)) {
                let tagsArry = tags.trim().split(',').map(tag => tag.trim());
                filter['tags'] = { $all: tagsArry }
            };

            if (isValid(subcategory)) {
                let subCategoryArry = subcategory.trim().split(',').map(tag => tag.trim());
                filter['subcategory'] = { $all: subCategoryArry }
            };
        }

        const blogs = await BlogModel.find(filter);

        if (Array.isArray(blogs) && blogs.length === 0) {
            res.status(400).send({ status: false, messag: "No blogs found" })
            return
        }

        const idOfBlogsToDelete = blogs.map(blog => {
            if (blog.authorId.toString() === Token) return blog._id;
        })

        if (idOfBlogsToDelete.length === 0) {
            res.status(400).send({ status: false, messag: "No blogs found" })
        }

        await BlogModel.updateMany({ _id: { $in: idOfBlogsToDelete } }, { $set: { isDeleted: true, deletedAt: new Date() } })

        res.status(400).send({ status: true, messag: "Blogs deleted successfully" })

    } catch (error) {
        res.status(500).send({ msg: "Error", error: error.message });
    }
};







module.exports.createBlog = createBlog
module.exports.blogs = blogs
module.exports.deleblogs = deleblogs
module.exports.deleteQuery = deleteQuery
module.exports.updateblogs = updateblogs
