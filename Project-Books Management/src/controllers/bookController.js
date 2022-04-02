const bookModel = require("../models/bookModel")
const reviewModel = require("../models/reviewModel")
const userModel = require("../models/userModel")
const ObjectId = require('mongoose').Types.ObjectId


const isObjectId = function (isObjectId) {
    return ObjectId.isValid(isObjectId)
}


const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}


const isValidRequestValue = function (isValidRequestValue) {
    if (typeof isValidRequestValue === 'undefined' || isValidRequestValue === null) return false
    if (typeof isValidRequestValue === 'string' && isValidRequestValue.trim().length === 0) return false
    return true
}


const isString = function (isString) {
    if (typeof isString !== 'string') return false
    return true
}


const isValidRequestValueNotRequired = function (isValidRequestValue) {
    if (typeof isValidRequestValue === 'string' && isValidRequestValue.trim().length === 0) return false
    return true
}


const isNumber = function (isNumber) {
    if (typeof isNumber != 'number') return false
    return true
}


const isBoolean = function (isBoolean) {
    if (typeof isBoolean != 'boolean') return false
    return true
}

function validateDateFormat(date) {
    const validatePattern = /^(\d{4})(\/|-)(\d{1,2})(\/|-)(\d{1,2})$/;
    let dateValues = date.match(validatePattern);  // return array format with input , group , date etc.
    if (dateValues == null) return false;

    let dtYear = dateValues[1]; // array index get value
    let dtMonth = dateValues[3];
    let dtDay = dateValues[5];

    if (dtMonth < 1 || dtMonth > 12) return false;
    else if (dtDay < 1 || dtDay > 32) return false;
    return true;

    // here we check leap year also
}





const createBooks = async function (req, res) {
    try {
        if (isValidRequestBody(req.query)) return res.status(400).send({ status: false, msg: "You can not pass query" })


        let requestBody = req.body
        if (!isValidRequestBody(requestBody)) return res.status(400).send({ status: false, msg: "please provide book details in request body" })


        let { title, excerpt, userId, ISBN, category, subcategory, reviews, isDeleted, deletedAt, releasedAt } = requestBody


        // title = title.replaceAll(" ", "")
        if (!isValidRequestValue(title)) return res.status(400).send({ status: false, msg: "please provide 'title' of user" })
        if (!isString(title)) return res.status(400).send({ status: false, msg: "please provide title in 'string' case only" })
        let alreadyTitleUse = await bookModel.find({ title: title })
        if (alreadyTitleUse.length > 0) return res.status(400).send({ status: false, msg: `Your 'title' '${title}' is already use` })
        //requestBody.title = title


        if (!isValidRequestValue(excerpt)) return res.status(400).send({ status: false, msg: "please provide 'excerpt' of user" })
        if (!isString(excerpt)) return res.status(400).send({ status: false, msg: "please provide excerpt in 'string' case only" })

        
        let user_id = userId.replaceAll(" ", "")
        if (!isValidRequestValue(user_id)) return res.status(400).send({ status: false, msg: "please provide 'userId' of user" })
        if (!isObjectId(user_id)) return res.status(400).send({ status: false, msg: "your user id must be a object Id" })
        let isUserPresent = await userModel.findById({ _id: user_id })
        if (!isUserPresent) return res.status(400).send({ status: false, msg: `Your 'userId' '${user_id}' is not present` })
        requestBody.userId = user_id


        ISBN = ISBN.replaceAll(" ", "")
        if (!isValidRequestValue(ISBN)) return res.status(400).send({ status: false, msg: "please provide 'ISBN' No. " })
        if (!isString(ISBN)) return res.status(400).send({ status: false, msg: "please provide ISBN in 'string' case only" })
        let alreadyISBNUse = await bookModel.find({ ISBN: ISBN })
        if (alreadyISBNUse.length > 0) return res.status(400).send({ status: false, msg: `Your 'ISBN' '${ISBN}' is already use` })
        requestBody.ISBN = ISBN


        if (!isValidRequestValue(category)) return res.status(400).send({ status: false, msg: "please provide 'category' " })
        if (!isString(category)) return res.status(400).send({ status: false, msg: "please provide category in 'string' case only" })


        if (!isValidRequestValue(subcategory)) return res.status(400).send({ status: false, msg: "please provide 'subcategory' " })
        if (!isString(subcategory)) return res.status(400).send({ status: false, msg: "please provide subcategory in 'string' case only" })


        if (reviews) {  // not accept accept only quote
            if (!isValidRequestValueNotRequired(reviews)) return res.status(400).send({ status: false, msg: "please provide proper reviews" })
            if (!isNumber(reviews)) return res.status(400).send({ status: false, msg: "please provide reviews in 'Number' case only" })
            if (reviews < 0) return res.status(400).send({ status: false, msg: "please provide reviews in more than 0 or 0 case only" })
        }


        if (isDeleted) {    // not accept only quote must be atleast one space or character
            if (!isValidRequestValueNotRequired(isDeleted)) return res.status(400).send({ status: false, msg: "please provide proper 'isDeleted' key " })
            if (!isBoolean(isDeleted)) return res.status(400).send({ status: false, msg: "please provide 'isDeleted' key in 'Boolean' case only" })
            if (isDeleted == true) return res.status(400).send({ status: false, msg: "You can not create Deleted Book" })
        }


        if (deletedAt) return res.status(400).send({ status: false, msg: "You can not pass 'deletedAt' key at time of create book record" })


        if (!isValidRequestValue(releasedAt)) return res.status(400).send({ status: false, msg: "please provide 'releasedAt' Date in 'YYYY-MM-DD' format " })
        if (!isString(releasedAt)) return res.status(400).send({ status: false, msg: "please provide releasedAt in 'string' case only" })
        if (!validateDateFormat(releasedAt)) return res.status(400).send({ status: false, msg: "Regx please provide 'releasedAt' Date in 'YYYY-MM-DD' format " })


        let bookData = await bookModel.create(requestBody)
        return res.status(201).send({ status: true, msg: bookData })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}




const getBooks = async function (req, res) {    // you have to pass proper value  without any space
    try {


        if (isValidRequestBody(req.body)) return res.status(400).send({ status: false, msg: "You can not pass request body" })
        let input = req.query


        let filters = Object.entries(input)
        if (Object.keys(input).length != 0) {
            let emptyInput = filters.filter((ele) => ele[1] == '')
            if (emptyInput.length != 0) return res.status(400).send({ status: false, msg: "You can not pass empty query" })
        }


        let filtersAsObject = []
        for (let i = 0; i < filters.length; i++) {
            let element = filters[i]
            let obj = {}
            obj[element[0]] = element[1]
            filtersAsObject.push(obj)
        }


        let conditions = [{ isDeleted: false }]
        let finalFilters = conditions.concat(filtersAsObject)


        // you can pass any filter combination
        //* handled two cases: (1) where client is using the filters (2) where client want to access all not deleted data


        if (Object.keys(input).length != 0) {
            let bookData = await bookModel.find({ $and: finalFilters }).select({
                title: 1,
                excerpt: 1,
                userId: 1,
                category: 1,
                reviews: 1,
                releasedAt: 1
            })


            //bookData.sort( (a,b)=> a.reviews-b.reviews) // sort only number
            bookData.sort((a, b) => (a.title > b.title) ? 1 : -1)// sort number & character both


            if (bookData.length == 0) return res.status(404).send({ status: false, msg: "no books found" })
            return res.status(200).send({ status: true, msg: "Books list", totalBooks: bookData.length, data: bookData })


        } else {
            let bookData = await bookModel.find({ $and: conditions }).select({
                title: 1,
                excerpt: 1,
                userId: 1,
                category: 1,
                reviews: 1,
                releasedAt: 1
            })

            //bookData.sort( (a,b)=> a.reviews-b.reviews) // sort only number
            bookData.sort((a, b) => (a.title > b.title) ? 1 : -1)// sort number & character both


            if (bookData.length == 0) return res.status(404).send({ status: false, msg: "no books found" })
            return res.status(200).send({ status: true, msg: "Books list", totalBooks: bookData.length, data: bookData })
        }
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}



const getAllBooks = async function (req, res) { // have to pass id without any space
    try {


        if (isValidRequestBody(req.query)) return res.status(400).send({ status: false, msg: "You can not pass query" })
        if (isValidRequestBody(req.body)) return res.status(400).send({ status: false, msg: "You can not pass request body" })


        bookId = req.params.bookId
        if (!isObjectId(bookId)) return res.status(400).send({ status: false, msg: "your book id must be a object Id" })
        let bookData = await bookModel.findById({ _id: bookId })
        if (!bookData) return res.status(404).send({ status: true, msg: "book is not present" })


        let bookDataWithReview = await reviewModel.find({ bookId: bookId }).select({ bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })//.populate('bookId')
        
        // this is universal no need to add indivisual
        let finalBookData = bookData.toObject()
        finalBookData.reviewsData = bookDataWithReview


        return res.status(200).send({ status: true, msg: "book data with review", data: finalBookData })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}




const updateBooks = async function (req, res) {
    try {
        if (isValidRequestBody(req.body)) return res.status(400).send({ status: false, msg: "You can not pass request body" })

        if (!isObjectId(req.params.bookId)) return res.status(400).send({ status: false, msg: "your book id must be a object Id" })


        let books = await bookModel.find({ _id: req.params.bookId, isDeleted: false })
        if (books.length <= 0) return res.status(404).send({ status: false, msg: "No books found may be your book is deleted" })


        let input = req.query
        let filters = Object.entries(input)


        if (Object.keys(input).length == 0) return res.status(400).send({ status: false, msg: "please provide update data in query" })
        if (Object.keys(input).length != 0) {
            let emptyInput = filters.filter((ele) => ele[1] == '')
            if (emptyInput.length != 0) {
                return res.status(400).send({ status: false, msg: "You can not pass empty query" })
            }
        }


        let newTitle = req.query.title
        let newExcerpt = req.query.excerpt
        let newReleaseAt = req.query.releasedAt
        let newISBN = req.query.ISBN


        // have to pass title without quote and space
        if (newTitle) {
            let data = await bookModel.find()
            for (let i = 0; i < data.length; i++) {
                if (newTitle == data[i].title)
                    return res.status(400).send({ status: false, msg: "You title is already present. it should be unique" })
            }
        }


        // have to pass title without quote and space
        if (newISBN) {
            let data = await bookModel.find()
            for (let i = 0; i < data.length; i++) {
                if (newISBN == data[i].ISBN)
                    return res.status(400).send({ status: false, msg: "You ISBN is already present. it should be unike" })
            }
        }


        let filterData = ['title', 'excerpt', 'releasedAt', 'ISBN']


        // this is DSA apporch   we can reduce this
        let count = 0
        for (let i = 0; i < Object.keys(input).length; i++) {
            if (filterData.includes(Object.keys(input)[i])) {
                if(Object.keys(input)[i]=='releasedAt'){
                    if (!validateDateFormat(Object.values(input)[i])) return res.status(400).send({ status: false, msg: "Regx please provide 'releasedAt' Date in 'YYYY-MM-DD' format " })
                }
             }
            else count++
        }
        if (count != 0) return res.status(400).send({ status: false, msg: `You can pass only '${filterData}' as a update in request query` })


        let updateBooks = await bookModel.findByIdAndUpdate(
            { _id: req.params.bookId },
            {
                $set: {
                    title: newTitle,
                    excerpt: newExcerpt,
                    releasedAt: new Date(), // current date with all
                    //releasedAt: newReleaseAt, // only date which user provide
                    ISBN: newISBN
                },
            },
            { new: true })

        return res.status(200).send({ status: true, updateBooks: updateBooks })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}




const deleteBook = async function (req, res) {
    try {


        if (isValidRequestBody(req.query)) return res.status(400).send({ status: false, msg: "You can not pass query" })
        if (isValidRequestBody(req.body)) return res.status(400).send({ status: false, msg: "You can not pass body" })


        if (!isObjectId(req.params.bookId)) return res.status(400).send({ status: false, msg: "your book id must be a object Id" })


        let books = await bookModel.find({ _id: req.params.bookId, isDeleted: false })
        if (books.length > 0) {
            const bookId = req.params.bookId


            //let deleteBook = await bookModel.findByIdAndDelete({_id:bookId},{isDeleted:true}) // delete hole document from collection  // not accept $set new true etc parameter
            let deleteBook = await bookModel.findByIdAndUpdate({ _id: bookId },
                { $set: { isDeleted: true, deletedAt: Date.now() } },
                { new: true })  // without set not show in postman but data delete in db


            return res.status(200).send({ status: true, msg: deleteBook })

        }
        return res.status(404).send({ status: false, msg: "No books found may be your book is deleted" })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}



module.exports.createBooks = createBooks
module.exports.getBooks = getBooks
module.exports.getAllBooks = getAllBooks
module.exports.updateBooks = updateBooks
module.exports.deleteBook = deleteBook