const express = require('express');
const router = express.Router();
const AuthorController = require("../controllers/authorController")
const AuthorLogin = require("../controllers/authorController")
const BlogController = require("../controllers/blogController")
const auth = require("../middleware/auth")

//Author Routes
router.post("/authors", AuthorController.createAuthor)
router.post("/login", AuthorLogin.loginAuthor)

//Blog Routes
router.post("/blogs", auth.authToken, BlogController.createBlog)
router.get("/getblogs", auth.authToken, BlogController.blogs)

//update blog
router.put("/updateblogs/:blogId", auth.authToken, BlogController.updateblogs)

//delte routes
router.delete("/deleteblog/:blogId", auth.authToken, BlogController.deleblogs)
router.delete("/deletequery/", BlogController.deleteQuery)

module.exports = router;