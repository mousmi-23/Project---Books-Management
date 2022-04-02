const jwt = require('jsonwebtoken')
const userModel = require("../models/userModel")


const authentication = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]

        if (!token) return res.status(400).send({ status: false, msg: "please provide token in request hadder with name 'x-api-key' " })

        let validateToken = jwt.verify(token, "Er. Sonu Verma")

        // below condition execution chances are very low as catch block will handle the invalid token error

        if (!validateToken) return res.status(401).send({ status: false, msg: "authentication failed" }) // failed ka 401 ?

        res.setHeader('x-api-key', token)
        next()
    } catch (err) {

        if(err.message== "invalid token") return res.status(401).send({ status: false, msg: "authentication failed May be your hadder part currupt" }) // failed ka 401 ?
        if(err.message.startsWith("Unexpected")) return res.status(401).send({ status: false, msg: "authentication failed May be your payload part currupt" }) // failed ka 401 ?
        if(err.message== "invalid signature") return res.status(401).send({ status: false, msg: "authentication failed May be your singature part currupt" }) // failed ka 401 ?
        if(err.message== "jwt expired") return res.status(401).send({ status: false, msg: "authentication failed May be your Token is Expired" }) // failed ka 401 ?
        return res.status(500).send({ status: false, err: err.message })
        // priority wise error catch if any space present in anywhere at token catch only hadder part
        
    }
}



const authorization = async function (req, res, next) {

    try {

        let token = req.headers["x-api-key"]
        let verifiedToken = jwt.verify(token, "Er. Sonu Verma")

        let userId = verifiedToken.userId
        let isPresentUser = await userModel.findById(userId)

        if (!isPresentUser) return res.status(401).send({ status: false, msg: "Unautorize access" }) // just search if not fount than no access

        //if (userId != req.query.userId) return res.status(401).send({ status: false, msg: "unauthorize access " })  //  take id from user if not match than no access

        next()

    } catch (err) {
        return res.status(500).send({ status: false, err: err.message })
    }
}


module.exports.authentication = authentication
module.exports.authorization = authorization
