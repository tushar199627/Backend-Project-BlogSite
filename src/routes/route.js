const express = require('express');
const router = express.Router();
const allController= require("../controllers/allController")
const middleware = require ("../middlewares/auth")



router.post("/createUser", allController.createUser  )

router.post("/login", allController.loginUser)

router.get("/user/:userId", middleware.checkToken, middleware.checkAuthorization, allController.getUserData)

router.put("/user/:userId", middleware.checkToken, middleware.checkAuthorization, allController.updateUser)

router.delete("/user/:userId", middleware.checkToken, middleware.checkAuthorization, allController.deleteUser)

module.exports = router;