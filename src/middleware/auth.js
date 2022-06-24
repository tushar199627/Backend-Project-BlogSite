const jwt = require("jsonwebtoken");



const authToken = async function (req, res, next) {
    try {
        let token = req.headers["x-auth-token"];
        if (!token) {
            return res.status(400).send({ status: false, msg: "token not valid or provide the token to create a blog" })
        }
        console.log(token)


        let decodedToken = jwt.verify(token, "functionup-radon-secretKey")
        if (!decodedToken) {
            return res.status(400).send({ status: false, msg: "token is invalid" });
        }

        //authorization
        let userToBeModified = req.body.authorId
        let userLoggedIn = decodedToken.authorId
        if (userToBeModified != userLoggedIn) {
            res.status(400).send({ status: false, msg: "not authorized" })
        }

        next();

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}


module.exports.authToken = authToken