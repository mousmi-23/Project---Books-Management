const ReviewModel = require('../models/reviewModel')
const BookModel = require('../models/bookModel')
const mongoose = require('mongoose')

const isValid = function (value) {

    if (typeof (value) == 'undefined' || typeof (value) == 'null') { return false }
    if (typeof (value) == 'string' && value.trim().length == 0) { return false }
    return true
}

const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}


const createReview = async function (req, res) {
    try {
        const data = req.body

        if (Object.keys(data) == 0) { return res.status(400).send({ status: false, message: "data is missing" }) }

        const bookId1 = req.params.bookId

        if (!isValidObjectId(bookId1)) { return res.status(400).send({ status: false, message: ' Invalid Format of bookId' }) }

        const bookDetails = await BookModel.findById(bookId1)
        if (!bookDetails) { return res.status(400).send({ status: false, message: "bookId does not exist" }) }

        const { reviewedAt, rating, review } = data

        if (!isValid(data.bookId)) { return res.status(400).send({ status: false, message: "bookId is required" }) }


        let bookId = data.bookId.trim()
        if (!isValidObjectId(bookId)) { return res.status(400).send({ status: false, message: 'Invalid bookId' }) }

        let findBookid = await BookModel.findById(bookId)
        if (!findBookid) return res.status(400).send({ status: false, message: "Book document does not exist" })
        data.bookId = bookId

        if (!isValid(reviewedAt)) { return res.status(400).send({ status: false, message: "reviewedAt is required" }) }


        if (!isValid(rating)) { return res.status(400).send({ status: false, message: "rating is required" }) }


        if (!isValid(review)) { return res.status(400).send({ status: false, message: "review is required" }) }

        if (rating < 1 || rating > 5) {
            return res.status(400).send({ status: false, message: "ratings should be in 1 to 5" })
        }
        if (bookId1 === bookId) {
            if (bookDetails.isDeleted == false) {

                const saveData = await ReviewModel.create(data)

                let increasedreview = await BookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $inc: { reviews: +1 } }, { new: true })

                const saveData1 = await ReviewModel.find({ bookId: bookDetails._id, isDeleted: false }).select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })

                const bookDetailsWithReviewDetails = increasedreview.toObject()

                bookDetailsWithReviewDetails.reviewsData = saveData1

                return res.status(201).send({ status: true, data: bookDetailsWithReviewDetails })
            } else {

                return res.status(400).send({ status: false, msg: "book is already deleted" })
            }
        } else { return res.status(400).send({ status: false, message: " bookId does not match " }) }
    }

    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

const updatedReview = async function (req, res) {
    try {
        const data = req.body
        const review = data.review
        const rating = data.rating
        const reviewedBy = data.reviewedBy
        const bookId = req.params.bookId
        const reviewId = req.params.reviewId

        if (Object.keys(data) == 0) { return res.status(400).send({ status: false, message: "data is missing" }) }

        if (!isValidObjectId(bookId)) { return res.status(400).send({ status: false, message: ' Invalid Format of bookId' }) }

        if (!isValidObjectId(reviewId)) { return res.status(400).send({ status: false, message: ' Invalid Format of reviewId' }) }

        const bookDetails = await BookModel.findById(bookId)
        if (!bookDetails) { return res.status(400).send({ status: false, message: "invalid bookId" }) }

        const FindReview = await ReviewModel.findById(reviewId)
        if (!FindReview) { return res.status(400).send({ status: false, message: "invalid reviewId" }) }

        if (rating < 1 || rating > 5) {
            return res.status(400).send({ status: false, msg: "ratings should be in 1 to 5" })
        }
        if (bookId == FindReview.bookId) {

            if (bookDetails.isDeleted === false) {

                if (FindReview.isDeleted === false) {

                    const UpdateReview = await ReviewModel.findOneAndUpdate({ _id: reviewId, bookId: bookId }, { review: review, rating: rating, reviewedBy: reviewedBy }, { new: true })

                    const saveData1 = await ReviewModel.find({ bookId: bookDetails._id, isDeleted: false }).select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })

                    const bookDetailsWithReviewDetails = bookDetails.toObject()

                    bookDetailsWithReviewDetails.reviewsData = saveData1

                    return res.status(200).send({ status: true, message: "Updated review data successfully", data: bookDetailsWithReviewDetails })

                } else {
                    return res.status(400).send({ status: false, message: "reviewData is already Deleted" })
                }
            } else {
                return res.status(400).send({ status: false, message: "BookData is already Deleted" })
            }
        }
        else {
            return res.status(400).send({ status: false, message: " id does not match" })
        }
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


const deletedReview = async function (req, res) {
    try {

        const bookId = req.params.bookId
        const reviewId = req.params.reviewId

        if (!isValidObjectId(bookId)) { return res.status(400).send({ status: false, message: 'Invalid Format of bookId' }) }

        if (!isValidObjectId(reviewId)) { return res.status(400).send({ status: false, message: 'Invalid Format of reviewId' }) }

        const bookDetails = await BookModel.findById(bookId)
        if (!bookDetails) { return res.status(400).send({ status: false, message: "invalid bookId" }) }

        const findReview = await ReviewModel.findById(reviewId)
        if (!findReview) { return res.status(404).send({ status: false, message: "No Book Document found" }) }


        if (bookId == findReview.bookId) {

            if (bookDetails.isDeleted === false) {

                if (findReview.isDeleted === false) {

                    const deleteReview = await ReviewModel.findOneAndUpdate({ _id: reviewId }, { isDeleted: true, deleteAt: new Date() }, { new: true })

                    let deleteReview1 = await BookModel.findOneAndUpdate({ _id: bookDetails._id }, { $inc: { reviews: -1 } }, { new: true })

                    const saveData1 = await ReviewModel.find({ bookId: bookDetails._id, isDeleted: false }).select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })

                    const bookDetailsWithReviewDetails = deleteReview1.toObject()

                    bookDetailsWithReviewDetails.reviewsData = saveData1

                    return res.status(200).send({ status: true, msg: 'selected reviewData is deleted', data: bookDetailsWithReviewDetails })

                } else {
                    return res.status(400).send({ status: false, message: "Review Data is already Deleted" })
                }
            }
            else {
                return res.status(400).send({ status: false, message: "BookData is already Deleted" })
            }
        } else {
            return res.status(400).send({ status: false, message: " id does not match" })
        }
    } catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}


module.exports.createReview = createReview
module.exports.updatedReview = updatedReview
module.exports.deletedReview = deletedReview