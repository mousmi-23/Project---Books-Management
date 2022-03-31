const UserModel = require('../models/userModel')
const BookModel=require('../models/bookModel')
const ReviewModel=require('../models/reviewModel')
const jwt = require('jsonwebtoken')


const mongoose=require('mongoose')

const isValid= function(value){

    if(typeof (value)== 'undefined' || typeof (value)== 'null'){return false}
    if(typeof (value)== 'string' && value.trim().length ==0){return false}
    return true

}
const isValidRequestBody = function (requestbody) {
    return Object.keys(requestbody).length > 0
}

const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}


const createBook= async function(req,res){

try
{
    const token = req.headers["x-api-key"]
    if (!token) { return res.status(404).send("token must be present") }

    const decodedToken = jwt.verify(token, 'Book-Management')
    if (!decodedToken) { return res.status(400).send("token is invalid") }

    const data =req.body
    if(Object.keys(data)==0){return res.status(400).send('data  is missing')}


    let userId = data.userId.trim()
// userId is required
   const req8= isValid(userId)
   if(!req8){ return res.status(400).send('userId is required')}

    if (!isValidObjectId(userId)) 
    { return res.status(400).send(' Invalid Format of userId')}
    

    const findUser = await UserModel.findById(userId)
   if (!findUser) { return res.status(400).send('user does not exist') }

        data.userId = data.userId.trim()



    
    //console.log(data)
    // const title=data.title.trim()
    // const excerpt=data.excerpt.trim()
    // const ISBN=data.ISBN.trim()
    // const category=data.category.trim()
    // const subcategory=data.subcategory.trim()
    const{title,excerpt,ISBN,category,subcategory,releasedAt}=data
    //if(!userId){return res.status(400).send("userID is required")} (by this trim is not handled)


    
    // title is required
    const req0= isValid(title)
    if(!req0){ return res.status(400).send('title is required')}

    // title should be unique
    const titleAlreadyUsed= await BookModel.findOne({title:title})
    if(titleAlreadyUsed){ return res.status(400).send('title should be unique')}

    
    // excerpt is required
    const req1= isValid(excerpt)
    if(!req1){ return res.status(400).send('excerpt is required')}

   // userId validation
  // const userId=data.userId.trim()
    // const User= await UserModel.findById(userId)
    // if(!User){ return res.status(400).send("invalid userId")}
   


    // ISBN is required
    const req3= isValid(ISBN)
    if(!req3){ return res.status(400).send('ISBN is required')}

    // ISBN should be unique
    const ISBNisAlreadyUsed= await BookModel.findOne({ISBN})
    if(ISBNisAlreadyUsed){ return res.status(400).send('ISBN should be unique')}

    
    const req4= isValid(category)
    if(!req4){ return res.status(400).send('category is required')}

    
    const req5= isValid(subcategory)
    if(!req5){ return res.status(400).send('subcategory is required')}

    const req6= isValid(releasedAt)
    if(!req6){ return res.status(400).send('releasedAt is required')}
  
  
    if(!(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/.test(releasedAt.trim())))
         return res.status(400).send({status:false,msg:"date format is not valid"})

         if (findUser._id != decodedToken.userId) {
            return res.status(400).send('user is not allowed to create Book')
        }

   
    const saveData=await BookModel.create(data);
    res.status(201).send({status:true,data:saveData})
}
catch(err){
    res.status(500).send({error:err.message})
}
}

const getBook = async function (req, res) {
    try {
        const queryParams = req.query
        const filterQueryParams = { isDeleted: false }
       
      // if(Object.keys(queryParams).length>0  && Object.values(queryParams)==0){ return res.status(400).send("please provide value to key")}
    
    


      let keys = Object.keys(queryParams);
      for(let i=0; i<keys.length; i++){
          if(!(queryParams[keys[i]])) return res.status(400).send({status:false, message:"Please provide proper filters"})
          queryParams[keys[i]]=queryParams[keys[i]].trim();
          if(!(queryParams[keys[i]])) return res.status(400).send({status:false, message:"Please provide proper filters"})
  
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
        res.status(500).send({ error: err.message })
    }
}


// const getBook = async function(req, res) {
//     try{
//           const data= req.query
//one more way//line138//find({$and:[data,{isDeleted:false}]})
//one more way//line138// let data2={ isDeleted:false,...data} //and then//find(data2)
//         const findBook = await BookModel.find(data).find({isDeleted : false}).select({_id:1,title:1,excerpt:1,userId:1,category:1,reviews:1,releasedAt:1}).sort({title:1})
//         console.log(findBook)
//         if(findBook.length==0){
//             return res.status(400).send({status:false,msg:"no books found"})
//         }
//         return res.status(200).send({status:true,msg:findBook})
//     }catch(err){
//     res.status(500).send({error:err.message})
// }
// }



const getBookByParams= async function(req,res){
try{

    let bookId=req.params.bookId

    if (!isValidObjectId(bookId)) 
    { return res.status(400).send(' Invalid Format of userId')}

    let bookDetails= await BookModel.findById(bookId)
    if(!bookDetails){return res.status(400).send(" invalid bookId ")}



    console.log(bookDetails)
  if(bookDetails.isDeleted === false){
    let reviewDetails2= await ReviewModel.find({bookId:bookDetails._id}).count()
    let reviewDetails= await ReviewModel.find({bookId:bookDetails._id}).select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })
    console.log(reviewDetails)


  const  bookDetailsWithReviewDetails={
      _id:bookDetails._id,
      title:bookDetails.title,
      excerpt:bookDetails.excerpt,
      userId:bookDetails.userId,
      category:bookDetails.category,
    subcategory:bookDetails.subcategory,
    deleted:bookDetails.deleted,
    reviews:reviewDetails2,
    deletedAt: bookDetails.deletedAt,
    releasedAt: bookDetails.releasedAt,
    createdAt:bookDetails.createdAt,    
    updatedAt: bookDetails.updatedAt,
    reviewsData:reviewDetails
      
   }
console.log(bookDetailsWithReviewDetails)

    return res.status(200).send({status:true,data:bookDetailsWithReviewDetails})
}else{
  return res.status(400).send(" book is deleted")
}


}catch(err){
    return res.status(500).send({error:err.message})
}
}

const updateBooks = async function (req, res) {
    const data = req.body
    const title = data.title
    const ISBN = data.ISBN
    const excerpt = data.excerpt
    const releasedAt = data.releasedAt

    if(Object.keys(data)==0){return res.status(400).send('data  is missing')}

   
    let bookId=req.params.bookId

    if (!isValidObjectId(bookId)) 
    { return res.status(400).send(' Invalid Format of userId')}

    let findId = await BookModel.findById(bookId)
    if (!findId) return res.status(404).send({ status: false, msg: "book not available" })

    let data2 = findId.isDeleted

    if (data2 === false) {
        let findTitle = await BookModel.findOne({ title:title })
        if (findTitle) return res.status(400).send("Title is already given please choose another name")
    
        let findIsbn = await BookModel.findOne({ ISBN:ISBN })
        if (findIsbn) return res.status(400).send("Number is given to another book choose anothor book number")

        let updateBook1 = await BookModel.findOneAndUpdate({ _id: bookId }, { title: title, ISBN: ISBN, excerpt: excerpt, releasedAt: releasedAt }, { new: true })
     //   if (!updateBook1) return res.status(404).send({ status: false, msg: "Book is not available" })
        res.status(200).send({ status: true, message: "success", data: updateBook1 })

    } else {
        return res.status(404).send({ status: false, msg: "Book is already deleted" })
    }


}




// const updateBooks= async function(req,res){
//     try{
//         const data=req.body
//         const bookId=req.params.bookId

//         const bookId2=await BookModel.findById(bookId)
//         if(!bookId2){return res.status(400).send("bookId does not exist")}

//     if (bookId2.isDeleted=== false) {
// const updateBook= await BookModel.findOneAndUpdate({_id:bookId},data,{new:true})

// return res.status(202).send({status:true,data:updateBook})
//     }else{
//         return res.status(404).send({ status: false, msg: "blog has been already deleted" })
//     }
    

//     }catch(err){
//         return res.status(500).send({error:err.message})
//     }

// }


const deleteBooks = async function (req,res){
    try{
        const bookId=req.params.bookId

        if(!isValidObjectId(bookId.trim())){
            return res.status(400).send({ status : false, msg : "Invalid bookId"})
        }
   
        const bookId1= await BookModel.findById(bookId)
        if(!bookId1){return res.status(404).send("bookId does not exist")}

        if(bookId1.isDeleted=== false){
            const deletebook = await BookModel.findOneAndUpdate({_id:bookId},{isDeleted:true,deletedAt: new Date()},{new:true})
            res.status(200).send({ status: true, message: 'deleted successfully',data:deletebook })
        }else{
            {return res.status(400).send("already deleted")}
        }

    }catch(err){
        return res.status(500).send({error:err.message})
    }
}






module.exports.createBook=createBook
module.exports.getBook=getBook
module.exports.getBookByParams=getBookByParams
module.exports.updateBooks=updateBooks
module.exports.deleteBooks=deleteBooks


// const UserModel = require('../models/userModel')
// const BookModel = require('../models/bookModel')
// const ReviewModel = require('../models/reviewModel')
// const { default: mongoose } = require('mongoose')
// const validate = require('validator');
// const ObjectId = require('mongoose').Types.ObjectId


// const isValid = function (value) {

//     if (typeof (value) == 'undefined' || typeof (value) == 'null') { return false }
//     if (typeof (value) == 'string' && value.trim().length == 0) { return false }
//     return true

// }

// const isValidRequestBody = function (requestbody) {
//     return Object.keys(requestbody).length > 0
// }

// const isValidObjectId = function (ObjectId) {
//     return mongoose.Types.ObjectId.isValid(ObjectId)
// }

// // const isObjectId = function (isObjectId) {
// //     return ObjectId.isValid(isObjectId)
// // }

// const createBook = async function (req, res) {
//     try {
//         let requestBody = req.body;

//         if (!isValidRequestBody(requestBody)) {
//             return res.status(400).send({ status: false, message: "Invalid request Parameters. Please provide Book Details" })
//         }

//         let { title, excerpt, ISBN, category, subcategory, releasedAt, userId } = requestBody
//         //if(!userId){return res.status(400).send("userID is required")} (by this trim is not handled)

//         // title is required
//         if (!isValid(title)) {
//              return res.status(400).send({status : false , message :'title is required'})
//             }

//         // title should be unique
//         const titleAlreadyUsed = await BookModel.findOne({ title: title })
//         if (titleAlreadyUsed) {
//              return res.status(400).send({ status : false , message :'title should be unique'}) 
//             }

//         // excerpt is required
//         if (!isValid(excerpt)) { 
//             return res.status(400).send({status : false , message : 'excerpt is required'}) 
//         }

//         // userId is required
//         if (!isValid(userId)) {
//              return res.status(400).send({status : false , message : 'userId is required'})
//         }

//         // userId validation
//         userId =requestBody.userId.trim()

//         const User = await UserModel.findById(userId)
//         console.log(User)
//         if (!User) { return res.status(400).send({status : false , message : 'invalid userId'}) }
//         userId = User._id
//         requestBody.userId = userId

//         // ISBN is required
//         if (!isValid(ISBN)) { 
//             return res.status(400).send({ status : false , message : 'ISBN is required'}) 
//         }

//         // ISBN should be unique
//         const ISBNisAlreadyUsed = await BookModel.findOne({ ISBN })
//         if (ISBNisAlreadyUsed) { 
//             return res.status(400).send({status : false , message : 'ISBN should be unique'})
//          }

//         if (!isValid(category)) { 
//             return res.status(400).send({status : false , message : 'category is required'})
//          }

//         if (!isValid(subcategory)) { 
//             return res.status(400).send({status : false , message : 'subcategory is required'}) 
//         }

//         if (!isValid(releasedAt)) {
//              return res.status(400).send({status : false , message : 'releasedAt is required'})
//         }

//         const saveData = await BookModel.create(requestBody);
//         res.status(201).send({ status: true, message : 'Book Created Successfully', data: saveData })
//     }
//     catch (err) {
//         res.status(500).send({ status : false , error: err.message })
//     }
// }


// const getBook = async function (req, res) {
//     try {
//         const queryParams = req.query
//         console.log(queryParams)
//         const filterQueryParams = { isDeleted: false }

//         if (isValidRequestBody(queryParams)) {
//             const { userId, category, subcategory } = queryParams

//             if (isValid(userId) && isValidObjectId(userId)) {
//                 filterQueryParams["userId"] = userId.trim()
//             }

//             if (isValid(category)) {
//                 filterQueryParams["category"] = category.trim()
//             }

//             if (isValid(subcategory)) {
//                 filterQueryParams["subcategory"] = subcategory.trim()
//             }
//         }
//         const findBook = await BookModel.find(filterQueryParams).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 }).sort({ title: 1 }).count()
//         const findBook1 = await BookModel.find(filterQueryParams).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 }).sort({ title: 1 })
        
//         if (Array.isArray(findBook1) && findBook1.length == 0) {
//             return res.status(404).send({ status: false, message: "No Books Found" })
//         }
//         return res.status(201).send({ status: true, message: "Books Find Successfully", count: findBook, data: findBook1 })
//     }

//     catch (err) {
//         res.status(500).send({ error: err.message })
//     }
// }


// const GetBookByParams = async function(req,res){
//     try{
    
//         let bookId = req.params.bookId;
        
//         // if (!isValidRequestBody(bookId)) {
//         //     return res.status(400).send({ status: false, message: "Invalid request Parameters. Please provide Book Id" })
//         // }
//         if (isValidObjectId(bookId)) {
//             return res.status(400).send({ status : false, message : "Enter valid Book id",})
//         }
//         let bookDetails = await BookModel.findById(bookId)
//         console.log(bookDetails)
//         if(!bookDetails) {
//             return res.status(400).send({status:false,msg :"No book exist with this Book id"})
//         }
//         console.log(bookDetails)
      
//         let reviewDetails = await ReviewModel.find({ bookId : bookDetails._id }).select({ isDeleted : false })
//         console.log(reviewDetails)
     
//         let finalBookData = bookDetails.toObject()
//         finalBookData.reviewData = reviewDetails

//         // const  bookDetailsWithReviewDetails = {

//         //   _id : bookDetails._id,
//         //   title : bookDetails.title,
//         //   excerpt : bookDetails.excerpt,
//         //   userId : bookDetails.userId,
//         //   category : bookDetails.category,
//         //   subcategory : bookDetails.subcategory,
//         //   isDeleted : bookDetails.isDeleted,
//         //   reviews : bookDetails.reviews,
//         // //   deletedAt : bookDetails.deletedAt,
//         // //   releasedAt : bookDetails.releasedAt,
//         // //   createdAt : bookDetails.createdAt,
//         // //   updatedAt : bookDetails.updatedAt,
//         //   reviewsData : reviewDetails
//         // }
//         //reviewData = reviewsData.reviews
//         //reviewData = reviewsData + 1
//         //await reviewData.findOneAndUpdate({id : reviewId},{reviews : reviewData},{new : true})
//         //res.send(reviewData : reviewData)

//         console.log(finalBookData)
    
//         return res.status(200).send({ status : true, message : "Receive Review data Successfully in Book Document", data : finalBookData})
    
//     }catch(err) { 
//         return res.status(500).send({ status : false, message : err.message})
//     }
// }


// const updateBooks = async function (req, res) {
//     try {
//     const data = req.body
//     const data1 = req.params.bookId
//     const title = data.title
//     const ISBN = data.ISBN
//     const excerpt = data.excerpt
//     const releasedAt = data.releasedAt

//     if (!isValidRequestBody(data)) {
//         return res.status(400).send({ status: false, message: "Invalid request Parameters. Please provide the data for update a pervious book data" })
//     }

//     if (!isValidObjectId(data1)) {
//         return res.status(400).send({ status : false, message : "Enter valid Book id",})
//     }

//     let findId = await BookModel.findById(data1)
//     if (!findId) {
//        return res.status(404).send({ status: false, message : "No book exist with this Book Id" })
//     }

//     let data2 = findId.isDeleted

//     if (data2 === false) {
//         let findTitle = await BookModel.findOne({ title : title })
//         if (findTitle) {
//             return res.status(400).send({ status: false, message : "Title is already given please choose another name"})
//         }
//         let findIsbn = await BookModel.findOne({ ISBN : ISBN })
//         if (findIsbn) {
//             return res.status(400).send({ status: false, message : "ISBN Number is given to another book choose anothor book number"})
//         }
//         let updateBook1 = await BookModel.findOneAndUpdate({ _id: data1 }, { title: title, ISBN: ISBN, excerpt: excerpt, releasedAt: releasedAt }, { new: true })
//         {
//             return res.status(200).send({ status: true, message : "Data Updated Successfully", data : updateBook1 })
//         }
//     } else {
//         return res.status(404).send({ status: false, message : "Book document is already deleted" })
//     }
  
// } catch(err) {
//     return res.status(500).send({ status: false, message : err.message })
// }
// }


// const deleteBook = async function(req, res) {
//     try {
//        const bookId = req.params.bookId
    
//        if(!isValidObjectId(bookId.trim())){
//             return res.status(400).send({ status : false, msg : "Invalid bookId"})
//           }
//        const bookId1 = await BookModel.findById(bookId)
//        if(!bookId1){
//            return res.status(404).send({ status : false, msg : "Book Id does not exists"})
//     }
//        if(bookId1.isDeleted === false) {
//         const deleteBook = await BookModel.findOneAndUpdate({ _id : bookId}, {isDeleted : true,  deletedAt : new Date()}, {new : true})

//         return res.status(200).send({ status : true, msg : "Data deleted successfully", data : deleteBook})
//     } else {
//         return res.status(400).send({ status : false, msg : "Data already deleted"})
//     }
  
//     }  catch(err) {
//         return res.status(500).send({ status: false, msg: err.message })
//     }
// }


// module.exports.createBook = createBook
// module.exports.getBook = getBook
// module.exports.GetBookByParams = GetBookByParams
// module.exports.updateBooks = updateBooks
// module.exports.deleteBook = deleteBook







// //chakrapani
// // const updateBook = async function(req,res){
// //     let bookId = req.params.bookId;
// //     if(!bookId) return res.status(400).send({status:false,msg:'enter the book id to find'})
// //     if(!ObjectId.isValid(bookId)) return res.status(400).send({status:false,msg:'bookId is not valid'})
// //     let data = await bookModel.findOne({_id:bookId,isDeleted:false})
// //     if(!data) return res.status(400).send({status:false,msg:'book with bookId was not found'})
    
// //     let updateDetails = req.body;
// //     if(Object.keys(updateDetails).includes('title')){
// //         let dupTitle = await bookModel.findOne({title:updateDetails.title,isDeleted:false})
// //         if(dupTitle) return res.status(400).send({status:false,msg:`book with ${updateDetails.title} is already present.`})
// //     }

// //     if(Object.keys(updateDetails).includes('ISBN')){
// //         let dupISBN = await bookModel.findOne({ISBN:updateDetails.ISBN,isDeleted:false})
// //         if(dupISBN) return res.status(400).send({status:false,msg:`book with ${updateDetails.ISBN} is already present.`})
// //     }
// //     if(Object.keys(updateDetails).includes('releasedAt')){
// //         if(!(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/.test(updateDetails.releasedAt))){
// //             return res.status(400).send({status:false,msg:"released Date is not valid"})
// //         }
// //     }
    
// //     let updatedBook = await bookModel.findOneAndUpdate({_id:bookId,isDeleted:false}, {$set:{title:updateDetails.title, excerpt:updateDetails.excerpt,releasedAt:updateDetails.releasedAt,ISBN:updateDetails.ISBN}},{new:true})

// //     return res.status(201).send({status:true,msg:"success",data:updatedBook})
// // }


// // Sonu
// //const updateBooks = async function (req, res) {
//     //     try {
    
    
//     //         if (!isObjectId(req.params.bookId))
//     //          return res.status(400).send({ status: false, msg: "your book id must be a object Id" })
    
    
//     //         let books = await BookModel.find({ _id: req.params.bookId, isDeleted: false })
//     //         if (books.length <= 0) 
//     //         return res.status(404).send({ status: false, msg: "No books found" })
    
    
//     //         let input = req.query
//     //         let filters = Object.entries(input)
    
    
//     //         if (Object.keys(input).length == 0) 
//     //         return res.status(400).send({ status: false, msg: "please provide update data in query" })
    
//     //         if (Object.keys(input).length != 0) {
//     //             let emptyInput = filters.filter((ele) => ele[1] == '')
//     //             if (emptyInput.length != 0) {
//     //                 return res.status(400).send({ status: false, msg: "You can not pass empty query" })
//     //             }
//     //         }
    
    
//     //         let newTitle = req.query.title
//     //         let newExcerpt = req.query.excerpt
//     //         let newReleaseAt = req.query.releasedAt
//     //         let newISBN = req.query.ISBN
    
    
//     //         let updateBooks = await BookModel.findByIdAndUpdate(
//     //             { _id: req.params.bookId },
//     //             {
//     //                 $set: {
//     //                     title: newTitle,
//     //                     excerpt: newExcerpt,
//     //                     releasedAt: newReleaseAt, //Date.now(),
//     //                     ISBN: newISBN
//     //                 },
//     //             },
//     //             { new: true })
    
//     //         return res.status(200).send({ status: true, updateBooks: updateBooks })
//     //     }
//     //     catch (err) {
//     //         return res.status(500).send({ status: false, msg: err.message })
//     //     }
//     // }


//     //