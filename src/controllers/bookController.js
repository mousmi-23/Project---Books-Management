const UserModel = require('../models/userModel')
const BookModel = require('../models/bookModel')
const ReviewModel = require('../models/reviewModel')
const jwt = require('jsonwebtoken')
const aws = require('../aws/aws')
const mongoose = require('mongoose')

const isValid = function (value) {

    if (typeof (value) == 'undefined' || typeof (value) == 'null') { return false }
    if (typeof (value) == 'string' && value.trim().length == 0) { return false }
    return true

}
const isValidRequestBody = function (requestbody) {
    return Object.keys(requestbody).length > 0
}

const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}


const createBook = async function (req, res) {

    try {
        const token = req.headers["x-api-key"]
        if (!token) { return res.status(404).send({ status: false, msg: "token must be present" }) }

        const decodedToken = jwt.verify(token, 'Book-Management')
        if (!decodedToken) { return res.status(400).send({ status: false, msg: "token is invalid" }) }

        const data = req.body
        if (Object.keys(data) == 0) { return res.status(400).send({ status: false, msg: 'data  is missing' }) }

        // userId is required
        const req8 = isValid(data.userId)
        if (!req8) { return res.status(400).send({ status: false, msg: 'userId is required' }) }

        let userId = data.userId.trim()
        if (!isValidObjectId(userId)) { return res.status(400).send({ status: false, msg: ' Invalid userId' }) }

        const findUser = await UserModel.findById(userId)
        if (!findUser) { return res.status(404).send({ status: false, msg: 'user does not exist' }) }

        data.userId = data.userId.trim()

        const { title, excerpt, category, subcategory, releasedAt } = data

        // title is required
        const req0 = isValid(title)
        if (!req0) { return res.status(400).send({ status: false, msg: 'title is required' }) }

        // title should be unique
        const titleAlreadyUsed = await BookModel.findOne({ title: title })
        if (titleAlreadyUsed) { return res.status(400).send({ status: false, msg: 'title should be unique' }) }


        // excerpt is required
        const req1 = isValid(excerpt)
        if (!req1) { return res.status(400).send({ status: false, msg: 'excerpt is required' }) }

        // ISBN is required
        const req3 = isValid(data.ISBN)
        if (!req3) { return res.status(400).send({ status: false, msg: 'ISBN is required' }) }

        //validation of ISBN
        const ISBN = data.ISBN.trim()
        if (!/^(97(8|9))?\d{9}(\d|X)$/.test(ISBN)) {
            return res.status(400).send({ status: false, message: `Enter a valid ISBN of 13 digits` })
        }

        // ISBN should be unique
        const ISBNisAlreadyUsed = await BookModel.findOne({ ISBN })
        if (ISBNisAlreadyUsed) { return res.status(400).send({ status: false, msg: 'ISBN should be unique' }) }

        // category is required
        const req4 = isValid(category)
        if (!req4) { return res.status(400).send({ status: false, msg: 'category is required' }) }

        const req5 = isValid(subcategory)
        if (!req5) { return res.status(400).send({ status: false, msg: 'subcategory is required' }) }

        const req6 = isValid(releasedAt)
        if (!req6) { return res.status(400).send({ status: false, msg: 'releasedAt is required' }) }

        if (!(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/.test(releasedAt.trim())))
            return res.status(400).send({ status: false, msg: "date format is not valid" })

        if (findUser._id != decodedToken.userId) {
            return res.status(401).send({ status: false, msg: 'user is not allowed to create Book' })
        }

        const files = req.files;
        if (files) {
            const uploadedFiles = [];
            for (const file of files) {
                const fileRes = await aws.uploadFile(file);
                //console.log(fileRes)
                uploadedFiles.push(fileRes.Location);
                //console.log(uploadedFiles)
            }
            data.bookCover = uploadedFiles;
            //console.log(files)
            const insertRes = await BookModel.create(data);
            //console.log(insertRes)
            return res.status(201).send({
                status: true,
                message: 'Book created successfully !',
                data: insertRes
            });
        }

        const saveData = await BookModel.create(data);
        res.status(201).send({ status: true, data: saveData })
    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}


const getBook = async function (req, res) {
    try {
        const queryParams = req.query
        const filterQueryParams = { isDeleted: false }

        let keys = Object.keys(queryParams);
        for (let i = 0; i < keys.length; i++) {
            if (!(queryParams[keys[i]])) return res.status(400).send({ status: false, message: "Please provide proper filters" })
            queryParams[keys[i]] = queryParams[keys[i]].trim();
            if (!(queryParams[keys[i]])) return res.status(400).send({ status: false, message: "Please provide proper filters" })
        }

        if (isValidRequestBody(queryParams)) {

            const { userId, category, subcategory } = queryParams

            if (isValid(userId) && isValidObjectId(userId)) {
                filterQueryParams["userId"] = userId.trim()
            }


            if (isValid(category)) {
                filterQueryParams["category"] = category.trim()
            }

            if (isValid(subcategory)) {
                filterQueryParams["subcategory"] = subcategory.trim()
            }
        }
        const findBook = await BookModel.find(filterQueryParams).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 }).sort({ title: 1 }).count()
        const findBook1 = await BookModel.find(filterQueryParams).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 }).sort({ title: 1 })

        if (findBook1.length == 0) {
            return res.status(404).send({ status: false, message: "No Books Found" })
        }
        return res.status(201).send({ status: true, message: "Books Find Successfully", count: findBook, data: findBook1 })
    }

    catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}


const getBookByParams = async function (req, res) {
    try {

        let bookId = req.params.bookId

        if (!isValidObjectId(bookId)) { return res.status(400).send({ status: false, msg: ' Invalid userId' }) }

        let bookDetails = await BookModel.findById(bookId).select({ __v: 0 })
        if (!bookDetails) { return res.status(400).send({ status: false, msg: " book document does not exist " }) }

        if (bookDetails.isDeleted === false) {

            let reviewDetails = await ReviewModel.find({ bookId: bookDetails._id, isDeleted: false }).select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1, })

            const bookDetailsWithReviewDetails = bookDetails.toObject()

            bookDetailsWithReviewDetails.reviewsData = reviewDetails

            return res.status(200).send({ status: true, data: bookDetailsWithReviewDetails })

        } else {
            return res.status(400).send({ status: false, msg: " book is deleted" })
        }
    } catch (err) {

        return res.status(500).send({ status: false, error: err.message })
    }
}


const updateBooks = async function (req, res) {
    try {
        const data = req.body
        const title = data.title
        const ISBN = data.ISBN
        const excerpt = data.excerpt
        const releasedAt = data.releasedAt

        if (Object.keys(data) == 0) { return res.status(400).send({ status: false, msg: 'data  is missing' }) }

        let bookId = req.params.bookId

        if (!isValidObjectId(bookId)) { return res.status(400).send({ status: false, msg: ' Invalid Format of userId' }) }

        let findId = await BookModel.findById(bookId)
        if (!findId) return res.status(404).send({ status: false, msg: "book not available" })

        let data2 = findId.isDeleted

        if (data2 === false) {
            let findTitle = await BookModel.findOne({ title: title })
            if (findTitle) return res.status(400).send({ status: false, msg: "Title is already given please choose another name" })

            let findIsbn = await BookModel.findOne({ ISBN: ISBN })
            if (findIsbn) return res.status(400).send({ status: false, msg: "Number is given to another book choose anothor book number" })

            let updateBook1 = await BookModel.findOneAndUpdate({ _id: bookId }, { title: title, ISBN: ISBN, excerpt: excerpt, releasedAt: releasedAt }, { new: true })

            res.status(200).send({ status: true, message: "success", data: updateBook1 })

        } else {
            return res.status(404).send({ status: false, msg: "Book is already deleted" })
        }

    } catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}


const deleteBooks = async function (req, res) {
    try {
        const bookId = req.params.bookId

        if (!isValidObjectId(bookId.trim())) {
            return res.status(400).send({ status: false, msg: "Invalid bookId" })
        }

        const bookId1 = await BookModel.findById(bookId)
        if (!bookId1) { return res.status(404).send({ status: false, msg: "bookId does not exist" }) }

        if (bookId1.isDeleted === false) {

            const deletebook = await BookModel.findOneAndUpdate({ _id: bookId }, { isDeleted: true, deletedAt: new Date() }, { new: true })

            res.status(200).send({ status: true, message: 'deleted successfully', data: deletebook })

        } else {
            { return res.status(400).send({ status: false, msg: "already deleted" }) }
        }

    } catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}



module.exports.createBook = createBook
module.exports.getBook = getBook
module.exports.getBookByParams = getBookByParams
module.exports.updateBooks = updateBooks
module.exports.deleteBooks = deleteBooks