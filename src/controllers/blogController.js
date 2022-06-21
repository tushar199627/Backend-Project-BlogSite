const AuthorModel = require("../models/authorModel")
const BlogModel = require("../models/blogModel")
const { populate } = require("../models/blogModel")

const createBlog = async function (req, res) {
    const { authorId } = req.body
    if (!authorId) {
        res.send("this field is required")
    } else {
        const author = await AuthorModel.findById(authorId);
        if (!author) {
            res.send("AuthorId is not Valid")
        } else {
            let blogCreated = await BlogModel.create(req.body)
            res.send({ data: blogCreated })
        }
    }
}

module.exports.createBlog = createBlog

