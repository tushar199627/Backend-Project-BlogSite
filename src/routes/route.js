const express = require('express');
const router = express.Router();
const AuthorController= require("../controllers/authorContoller")
const BlogController= require("../controllers/blogController")



//Author Routes

router.post("/authors", AuthorController.createAuthor  )


//Blog Routes

router.post("/blogs", BlogController.createBlog)
router.get("/getblogs", BlogController.blogs)


//delte routes

router.delete("/deleteblog/:blogId",BlogController.deleblogs)

module.exports=router;