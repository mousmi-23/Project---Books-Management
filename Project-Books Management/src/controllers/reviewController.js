const reviewModel = require("../models/reviewModel")
const bookModel = require("../models/bookModel")
const ObjectId = require("mongoose").Types.ObjectId

const isValid = function (value) {
    if (typeof (value) == 'undefined' || typeof (value) == 'null') return false
    if (typeof (value) == 'string' && value.trim().length == 0) return false
    return true
}

const isValidRequestBody = function (requestbody) {
    return Object.keys(requestbody).length > 0
}


const isObjectId = function (isObjectId) {
    return ObjectId.isValid(isObjectId)
} // can not pass same name with isObjectId == ObjectId


const isString = function (isString) {
    if (typeof isString !== 'string') return false
    return true
} // it is consider anything with in quote


const isNumber = function (isNumber) {
    if (typeof isNumber !== 'number') return false
    return true
}



const isBoolean = function (isBoolean) {
    if (typeof isBoolean !== 'boolean') return false
    return true
}


const createReview = async function (req, res) {
    try {


     


        let paramsBookId = req.params.bookId // make sure you pass object id in path var. without any quote else not consider
        if (!isObjectId(paramsBookId)) return res.status(400).send({ status: false, msg: "your path params book id must be a object Id" })
        let isBookPresent = await bookModel.findOne({ _id: paramsBookId, isDeleted: false })
        if (!isBookPresent) return res.status(400).send({ status: true, msg: "book is not present may be book is deleted" })
        // we can also handle indivisual    comming soon


        if (isValidRequestBody(req.query)) return res.status(400).send({ status: false, msg: "You can not pass query" })


        const data = req.body


        if (!isValidRequestBody(data)) return res.status(400).send({ status: false, message: "review data is missing in request body" })


        let { bookId, reviewedBy, reviewedAt, rating, review, isDeleted } = data


        let book_id = bookId.replaceAll(" ", "")
        if (!isValid(book_id)) return res.status(400).send({ status: false, message: "bookId is required" })
        if (!isObjectId(book_id)) return res.status(400).send({ status: false, msg: "your request body book id must be a object Id" })
        data.bookId = book_id // no need 


        if (paramsBookId !== book_id) return res.status(400).send({ status: false, msg: "make sure path variable book Id must be same your request body book Id" })
        // we can also allow different bookId  comming soon


        if (paramsBookId === book_id) {
            let _id = isBookPresent._id
            data.bookId = _id   // here we assign


            if (!isValid(reviewedBy)) return res.status(400).send({ status: false, message: "reviewedBy is required" })
            if (!isString(reviewedBy)) return res.status(400).send({ status: false, msg: "please provide reviewedBy in 'string' case only" })


            // if (!isValid(reviewedAt)) return res.status(400).send({ status: false, message: "reviewedAt is required" })


            if (!isValid(rating)) return res.status(400).send({ status: false, message: "rating is required" })
            if (!isNumber(rating)) return res.status(400).send({ status: false, message: "you can pass your rating in only number case" })
            if ((rating < 1 || rating > 5)) return res.status(400).send({ status: false, message: "ratings should be in 1 to 5" })


            // if (!isValid(review)) return res.status(400).send({ status: false, message: "review is required" })
            if (review.trim().length==0) { // not accept only quote but store in schema have to handle comming soon
                if (!isValid(review)) return res.status(400).send({ status: false, msg: "please provide proper 'review' key " })
                if (!isString(review)) return res.status(400).send({ status: false, msg: "please provide review in 'string' case only" })
            }


            if (isDeleted) {  // not accept only quote must be a space or character
                if (!isValid(isDeleted)) return res.status(400).send({ status: false, msg: "please provide proper 'isDeleted' key " })
                if (!isBoolean(isDeleted)) return res.status(400).send({ status: false, msg: "please provide 'isDeleted' key in 'Boolean' case only" })
                if (isDeleted == true) return res.status(400).send({ status: false, msg: "You can not create Deleted review" })
            }


            const saveData = await reviewModel.create(data)


            if (saveData) {
                let reviews = isBookPresent.reviews
                reviews = reviews + 1
                await bookModel.findOneAndUpdate({ _id: _id }, { reviews: reviews }, { new: true })
            }


            return res.status(201).send({ status: true, message: "Data Created Successfully", data: saveData })
            // here we not populate with book data we can see only review model populate comming soon

        }
    } catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}





const updatedReview = async function (req, res) {
    try {


        let paramsBookId = req.params.bookId // make sure you pass object id in path var. without any quote else not consider
        if (!isObjectId(paramsBookId)) return res.status(400).send({ status: false, msg: "your path params book id must be a object Id" })
        let isBookPresent = await bookModel.findOne({ _id: paramsBookId, isDeleted: false })
        if (!isBookPresent) return res.status(400).send({ status: true, msg: "book is not present may be book is deleted" })
        // we can also handle indivisual    comming soon


        let paramsReviewId = req.params.reviewId // make sure you pass object id in path var. without any quote else not consider
        if (!isObjectId(paramsReviewId)) return res.status(400).send({ status: false, msg: "your path params review id must be a object Id" })  // not consider last char if char than put char
        let isReviewPresent = await reviewModel.findOne({ _id: paramsReviewId, isDeleted: false })
        if (!isReviewPresent) return res.status(400).send({ status: true, msg: "Review is not present may be review is deleted" })
        // we can also handle indivisual    comming soon


        if (isValidRequestBody(req.query)) return res.status(400).send({ status: false, msg: "You can not pass query" })


        const data = req.body
        const newReview = data.review
        const newRating = data.rating
        const newReviewedBy = data.reviewedBy


        // work only string
        if (newReview.trim().length==0) { // not accept only quote but store in schema have to handle comming soon
            if (!isValid(newReview)) return res.status(400).send({ status: false, msg: "please provide proper 'review' key " })
            if (!isString(newReview)) return res.status(400).send({ status: false, msg: "please provide review in 'string' case only" }) // no need
        }


        if (newRating) { // not accept only quote but store in schema have to handle comming soon
            if (!isValid(newRating)) return res.status(400).send({ status: false, msg: "please provide proper 'rating' key " })
            if (!isNumber(newRating)) return res.status(400).send({ status: false, msg: "please provide rating in 'number' case only" })
            if ((newRating < 1 || newRating > 5)) return res.status(400).send({ status: false, message: "ratings should be in 1 to 5" })
        }


        if (newReviewedBy.trim().length==0) { // not accept only quote but store in schema have to handle comming soon
            if (!isValid(newReviewedBy)) return res.status(400).send({ status: false, msg: "please provide proper 'reviewedBy' key " })
            if (!isString(newReviewedBy)) return res.status(400).send({ status: false, msg: "please provide reviewedBy in 'string' case only" }) // no need
        }


        const updateReview = await reviewModel.findOneAndUpdate({ _id: paramsReviewId },
            {
                $set: {
                    review: newReview,
                    rating: newRating,
                    reviewedBy: newReviewedBy
                }
            }, { new: true })

        return res.status(200).send({ status: true, message: "Data Updated Successfully", data: updateReview })
    } catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}



const deletedReview = async function (req, res) {
    try {

        if (isValidRequestBody(req.query)) return res.status(400).send({ status: false, msg: "You can not pass query" })
//        if (isValidRequestBody(req.body)) return res.status(400).send({ status: false, msg: "You can not pass request body" })

        if (isValidRequestBody(req.body)) return res.status(400).send({ status: false, msg: "You can not pass body" })
        const bookId = req.params.bookId
        const reviewId = req.params.reviewId


        const findBook = await bookModel.findById(bookId)
        if (!findBook) return res.status(400).send({ status: false, message: "book id is not present" })


        if (findBook.isDeleted === false) {
            
            const findReview = await reviewModel.findById(reviewId)


            if (!findReview) return res.status(400).send({ status: false, message: " ReviewId is not present" })


            if (findReview.isDeleted === false) {

                const deleteReview = await reviewModel.findOneAndUpdate({ _id: reviewId }, { isDeleted: true }, { new: true })  // deleteAt: Date.now() not in schema
                return res.status(202).send({ status: true, message: "Data Deleted Successfully", data: deleteReview })
            } 
            
            else return res.status(400).send({ status: false, message: "reviewData is already Deleted" })

        }


        else return res.status(400).send({ status: false, message: "BookData is already Deleted" })


    } catch (err) {
        return res.status(500).send({ error: err.message })
    }
}


module.exports.createReview = createReview
module.exports.updatedReview = updatedReview
module.exports.deletedReview = deletedReview

