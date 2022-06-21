const express = require('express');
const router = express.Router();
const AuthorController= require("../controllers/authorContoller")
const BlogController= require("../controllers/blogController")


router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})


//Author Routes

router.post("/authors", AuthorController.createAuthor  )


//Blog Routes

router.post("/blogs", BlogController.createBlog)
router.get("/getblogs", BlogController.getBlogData)
module.exports=router;