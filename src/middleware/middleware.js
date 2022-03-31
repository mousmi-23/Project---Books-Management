const jwt = require('jsonwebtoken')
const BookModel = require('../models/bookModel')
const UserModel = require('../models/userModel')

const mongoose=require('mongoose')

const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}
const authentication = async function (req, res, next) {
    try {
        const token = req.headers["x-api-key"]
        if (!token) { return res.status(404).send("token must be present") }
        const decodedToken = jwt.verify(token, 'Book-Management')
        if (!decodedToken) { return res.status(400).send("token is invalid") }//
        next()
    }
    catch (err) {
        return res.status(500).send({ error: err.message })
    }
}

const authorization = async function (req, res, next) {
    try {
        const token = req.headers["x-api-key"]
        if (!token) { return res.status(404).send("token must be present") }
        const decodedToken = jwt.verify(token, 'Book-Management')
        if (!decodedToken) { return res.status(400).send("token is invalid") }
        const bookId = req.params.bookId
        if(!isValidObjectId(bookId.trim())){
            return res.status(400).send({ status : false, msg : "Invalid bookId"})
        }
        const findBook = await BookModel.findById(bookId)
       if (!findBook) { return res.status(400).send('book does not exist') }

        if (findBook.userId != decodedToken.userId) { return res.status(400).send('user is not allowed to make changes') }
        next()
    }
    catch (err) {
        return res.status(500).send({ error: err.message })
    }
}





module.exports.authentication = authentication

module.exports.authorization = authorization



// const jwt = require('jsonwebtoken')
// const BookModel = require('../models/bookModel')
// const UserModel = require('../models/userModel')

// const authentication = async function (req, res, next) {
//     try {
//         const token = req.headers["x-api-key"]
//         if (!token) { return res.status(404).send("token must be present") }
//         const decodedToken = jwt.verify(token, 'Book-Management')
//         if (!decodedToken) { return res.status(400).send("token is invalid") }
//         next()
//     }
//     catch (err) {
//         return res.status(500).send({ error: err.message })
//     }
// }

// const authorise = async function (req, res, next) {
//     try {
//         const token = req.headers["x-api-key"]
//         if (!token) { return res.status(404).send("token must be present") }
//         const decodedToken = jwt.verify(token, 'Book-Management')
//         if (!decodedToken) { return res.status(400).send("token is invalid") }
//         const userId = req.body.userId
//         const findUser = await UserModel.findById(userId)
//         if (!findUser) { return res.status(400).send('user does not exist') }

//         if (findUser._id != decodedToken.userId) {
//             return res.status(400).send('user is not allowed to create Book')
//         }

//         next()
//     }
//     catch (err) {
//         return res.status(500).send({ error: err.message })
//     }
// }

// const authorization = async function (req, res, next) {
//     try {
//         const token = req.headers["x-api-key"]
//         if (!token) { return res.status(404).send("token must be present") }
//         const decodedToken = jwt.verify(token, 'Book-Management')
//         if (!decodedToken) { return res.status(400).send("token is invalid") }
//         const bookId = req.params.bookId
//         const findBook = await BookModel.findById(bookId)
//         if (!findBook) { return res.status(400).send('book does not exist') }

//         if (findBook.userId !== decodedToken.userId) { return res.status(400).send('user is not allowed to make changes') }
//         next()
//     }
//     catch (err) {
//         return res.status(500).send({ error: err.message })
//     }
// }









// module.exports.authentication = authentication
// module.exports.authorise = authorise
// module.exports.authorization = authorization