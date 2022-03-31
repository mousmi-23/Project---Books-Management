const ReviewModel= require('../models/reviewModel')
const BookModel=require('../models/bookModel')
const mongoose=require('mongoose')
const isValid= function(value){

    if(typeof (value)== 'undefined' || typeof (value)== 'null'){return false}
    if(typeof (value)== 'string' && value.trim().length ==0){return false}
    return true
}


const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}


const createReview= async function(req,res){
     try{
        const data=req.body
        
        if(Object.keys(data)==0){return res.status(400).send("data is missing")}

       const bookId1=req.params.bookId

       if (!isValidObjectId(bookId1)) 
       { return res.status(400).send(' Invalid Format of bookId')}

       const bookDetails=await BookModel.findById(bookId1)
        if(!bookDetails){return res.status(400).send("bookId does not exist")}
        



        const{ reviewedBy,reviewedAt,rating,review}=data

        const req0=isValid(data.bookId)
        if(!req0){ return res.status(400).send("bookId is required")}

       let bookId=data.bookId.trim()
   
       if (!isValidObjectId(bookId)) 
       { return res.status(400).send(' Invalid Format of bookId')}

     let findBookid = await BookModel.findById(bookId)
    if (!findBookid) return res.status(400).send("Bookid is not valid")
       data.bookId=bookId

    

        const req1=isValid(reviewedBy)
        if(!req1){ return res.status(400).send("reviewedBy is required")}

        const req2=isValid(reviewedAt)
        if(!req2){ return res.status(400).send("reviewedAt is required")}

        const req3=isValid(rating)
        if(!req3){ return res.status(400).send("rating is required")}

        const req4=isValid(review)
        if(!req4){ return res.status(400).send("review is required")}

        if(rating < 1 ||  rating > 5)
        {
            return res.status(400).send("ratings should be in 1 to 5")
        }
        let isdeleteded = bookDetails.isDeleted
       if(bookId1 ===bookId){
        if (isdeleteded == false) {
            const saveData= await ReviewModel.create(data)
            const saveData1= await ReviewModel.find({ bookId:bookDetails._id, isDeleted: false }).select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })
            const saveData2= await ReviewModel.find({ bookId: bookDetails._id, isDeleted: false }).count()
            const  bookDetailsWithReviewDetails={
                _id:bookDetails._id,
                title:bookDetails.title,
                excerpt:bookDetails.excerpt,
                userId:bookDetails.userId,
                category:bookDetails.category,
              subcategory:bookDetails.subcategory,
              deleted:bookDetails.deleted,
              reviews:saveData2,
              deletedAt: bookDetails.deletedAt,
              releasedAt: bookDetails.releasedAt,
              createdAt:bookDetails.createdAt,
              updatedAt: bookDetails.updatedAt,
              reviewsData:saveData1
                
             }
            return res.status(201).send({status:true,data:bookDetailsWithReviewDetails})
        } else {

            return res.status(400).send({ status: false, msg: "book is already deleted" })
        }
    }else{ return res.status(400).send(" bookId does not match ")}
    }

    catch(err){
        res.status(500).send({error:err.message})
    }
        
    

}

const updatedReview= async function(req,res){
    try{
        const data=req.body
        const review=data.review
        const rating=data.rating
        const reviewedBy=data.reviewedBy
        const bookId=req.params.bookId
        const reviewId=req.params.reviewId

        if(Object.keys(data)==0){return res.status(400).send("data is missing")}

        if (!isValidObjectId(bookId)) 
        { return res.status(400).send(' Invalid Format of bookId')}

        if (!isValidObjectId(reviewId)) 
        { return res.status(400).send(' Invalid Format of reviewId')}
 
 


        const bookDetails= await BookModel.findById(bookId)
        if(!bookDetails){ return res.status(400).send("invalid bookId")}

        const FindReview= await ReviewModel.findById(reviewId)
        if(!FindReview){ return res.status(400).send("invalid reviewId")}
        

    
        if(bookId==FindReview.bookId){

         if(bookDetails.isDeleted ===false){


        if(FindReview.isDeleted ===false){

   const UpdateReview =await ReviewModel.findOneAndUpdate({_id:reviewId,bookId:bookId},{review:review,rating:rating,reviewedBy:reviewedBy},{new:true})
   const saveData1= await ReviewModel.find({ bookId: bookDetails._id, isDeleted: false }).select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })
   const saveData2= await ReviewModel.find({ bookId: bookDetails._id, isDeleted: false }).count()
   const  bookDetailsWithReviewDetails={
    _id:bookDetails._id,
    title:bookDetails.title,
    excerpt:bookDetails.excerpt,
    userId:bookDetails.userId,
    category:bookDetails.category,
  subcategory:bookDetails.subcategory,
  deleted:bookDetails.deleted,
  reviews:saveData2,
  deletedAt: bookDetails.deletedAt,
  releasedAt: bookDetails.releasedAt,
  createdAt:bookDetails.createdAt,
  updatedAt: bookDetails.updatedAt,
  reviewsData:saveData1
    
 }
    return res.status(202).send({status:true,data:bookDetailsWithReviewDetails})

        }else{
            return res.status(400).send("reviewData is already Deleted")
        }
    }else{
            return res.status(400).send("BookData is already Deleted")
        }
    }
else{
        return res.status(400).send(" id does not match")
    }
       
    
    }catch(err){
        return res.status(500).send({error:err.message})
    }
}


const deletedReview= async function(req,res){
try{  


    const bookId=req.params.bookId
    const reviewId=req.params.reviewId

    if (!isValidObjectId(bookId)) 
    { return res.status(400).send(' Invalid Format of bookId')}

    if (!isValidObjectId(reviewId)) 
    { return res.status(400).send(' Invalid Format of reviewId')}

    
    const bookDetails= await BookModel.findById(bookId)
    if(!bookDetails){ return res.status(400).send("invalid bookId")}

    
    const FindReview= await ReviewModel.findById(reviewId)
    if(!FindReview){ return res.status(400).send("invalid reviewId")}
    


    if(bookId==FindReview.bookId){
     if(bookDetails.isDeleted ===false){
    if(FindReview.isDeleted ===false){

        const deleteReview =await ReviewModel.findOneAndUpdate({_id:reviewId},{isDeleted:true,deleteAt:new Date()},{new:true})
        
         const saveData1= await ReviewModel.find({ bookId: bookDetails._id, isDeleted: false }).select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })
         const saveData2= await ReviewModel.find({ bookId: bookDetails._id, isDeleted: false }).count()
         const  bookDetailsWithReviewDetails={
          _id:bookDetails._id,
          title:bookDetails.title,
          excerpt:bookDetails.excerpt,
          userId:bookDetails.userId,
          category:bookDetails.category,
        subcategory:bookDetails.subcategory,
        deleted:bookDetails.deleted,
        reviews:saveData2,
        deletedAt: bookDetails.deletedAt,
        releasedAt: bookDetails.releasedAt,
        createdAt:bookDetails.createdAt,
        updatedAt: bookDetails.updatedAt,
        reviewsData:saveData1
          
       }

              return res.status(202).send({status:true,msg:'selected reviewData is deleted',data:bookDetailsWithReviewDetails})
     
             }else{
                 return res.status(400).send("reviewData is already Deleted")
             }
          }
          else{
                 return res.status(400).send("BookData is already Deleted")
             }
            }else{
                return res.status(400).send(" id does not match")
            }

 
  }catch(err){
    return res.status(500).send({error:err.message})
}
}






module.exports.createReview=createReview
module.exports.updatedReview=updatedReview
module.exports.deletedReview=deletedReview


// const ReviewModel = require('../models/reviewModel')
// const BookModel = require('../models/bookModel')

// const isValid = function (value) {

//     if (typeof (value) == 'undefined' || typeof (value) == 'null') { return false }
//     if (typeof (value) == 'string' && value.trim().length == 0) { return false }
//     return true
// }

// const isValidRequestBody = function (requestbody) {
//     return Object.keys(requestbody).length > 0
// }

// const createReview = async function (req, res) {
//     try {
       
//         let requestBody = req.body;

//         if (!isValidRequestBody(requestBody)) {
//             return res.status(400).send({ status : false, message : "Invalid request Parameters. Please provide Review Details" })
//         }

//         const bookId1 = req.params.bookId

//         const bookId2 = await BookModel.findById(bookId1)
//         if (!bookId2) {
//             return res.status(400).send({ status : false, message : "Book Id does not exist"}) 
//         }

//         const { bookId, reviewedBy, reviewedAt, rating, review } = requestBody

     
//         if (!isValid(bookId)) {
//              return res.status(400).send({ status : false, message : "Book Id is required"}) 
//         }

//         let findBookid = await BookModel.findById(requestBody.bookId)
//         if (!findBookid) {
//             return res.status(400).send({  status : false, message : "Book Id is not valid"})
//         }

//         if (!isValid(reviewedBy)) {
//              return res.status(400).send({ status : false, message : "reviewedBy is required"}) 
//         }

//         if (!isValid(reviewedAt)) { 
//             return res.status(400).send({ status : false, message : "reviewedAt is required"}) 
//         }

//         if (!isValid(rating)) { 
//             return res.status(400).send({ status : false, message : "rating is required"})
//         }
 
//         if (!isValid(review)) {
//             return res.status(400).send({ status : false, message : "review is required"})
//         }

//         if (rating < 1 || rating > 5) {
//             return res.status(400).send({ status : false, message : "ratings should be in 1 to 5"})
//         }

//         let checkDelete = bookId2.isDeleted

//         if(bookId1 === bookId) {
//             return res.status(400).send(" Book Id does not match with Params Book Id")
//         }
//         if (checkDelete == false) {

//             const saveData = await ReviewModel.create(requestBody)
//             const saveData1= await ReviewModel.find({ bookId:bookDetails._id, isDeleted: false }).select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })
//             const saveData2= await ReviewModel.find({ bookId: bookDetails._id, isDeleted: false }).count()
//             const  bookDetailsWithReviewDetails = {
//               _id:bookDetails._id,
//               title:bookDetails.title,
//               excerpt:bookDetails.excerpt,
//               userId:bookDetails.userId,
//               category:bookDetails.category,
//               subcategory:bookDetails.subcategory,
//               deleted:bookDetails.deleted,
//               reviews:saveData2,
//               deletedAt: bookDetails.deletedAt,
//               releasedAt: bookDetails.releasedAt,
//               createdAt:bookDetails.createdAt,
//               updatedAt: bookDetails.updatedAt,
//               reviewsData:saveData1
//             }
//             return res.status(201).send({ status : true, message : "Review Data Created Successfully", data: saveData })
//         } else {

//             return res.status(400).send({ status : false, message : "Book is already deleted" })
//         }
//     } catch (err) {
//         res.status(500).send({ status : false, error : err.message })
//     }
// }

// const updatedReview = async function (req, res) {
//     try {
//         const data = req.body
//         const review = data.review
//         const rating = data.rating
//         const reviewedBy = data.reviewedBy
//         const bookId = req.params.bookId
//         const reviewId = req.params.reviewId

//         if (!isValidRequestBody(data)) {
//             return res.status(400).send({ status : false, message : "Invalid request Parameters. Please provide Review Details for Update a Review Details" })
//         }

//         const findBook = await BookModel.findById(bookId)
//         if (!findBook) { 
//             return res.status(400).send({ status : false, message : "Invalid Book Id" }) 
//         }

//         if (findBook.isDeleted === false) {

//             const findReview = await ReviewModel.findById(reviewId)
//             if (!findReview) { 
//                 return res.status(400).send({ status : false, message : "Invalid Review Id" })
//             }

//             if (findReview.isDeleted === false) {

//                 const UpdateReview = await ReviewModel.findOneAndUpdate({ _id : reviewId }, { reviewedBy : reviewedBy, rating : rating, review : review }, { new: true })
//                 {
//                     return res.status(202).send({ status: true, message : "Data Updated Successfully", data: UpdateReview })
//                 }
//             } else {
//                 return res.status(400).send({ status : false, message : "Review Data is already Deleted" })
//             }
//         } else {
//             return res.status(400).send( {status : false, message : "Book Data is already Deleted" })
//         }

//     } catch (err) {
//         return res.status(500).send({ status : false , message : err.message })
//     }
// }


// const deletedReview = async function (req, res) {
//     try {
//         const bookId = req.params.bookId
//         const reviewId = req.params.reviewId

//         const findBook = await BookModel.findById(bookId)
//         if (!findBook) { 
//             return res.status(400).send({ status : false, message : "Invalid Book Id"}) 
//         }

//         if (findBook.isDeleted === false) {
//             const findReview = await ReviewModel.findById(reviewId)

//             if (!findReview) {
//                  return res.status(400).send({ status : false, message : "Invalid Review Id"})
//                 }
//             if (findReview.isDeleted === false) {

//                 const deleteReview = await ReviewModel.findOneAndUpdate({ _id : reviewId }, { isDeleted : true, deleteAt : new Date() }, { new : true }) 
//                 {
//                    return res.status(202).send({ status : true, message : "Data Deleted Successfully", data : deleteReview })
//                 }
//             } else {
//                 return res.status(400).send({ status : false, message : "Review Data is already Deleted"})
//             }
//         }
//         else {
//             return res.status(400).send({ status : false, message : "Book Data is already Deleted"})
//         }


//     } catch (err) {
//         return res.status(500).send({ error: err.message })
//     }
// }


// module.exports.createReview = createReview
// module.exports.updatedReview = updatedReview
// module.exports.deletedReview = deletedReview


// // const ReviewModel= require('../models/reviewModel')
// // const BookModel=require('../models/bookModel')

// // const isValid= function(value){

// //     if(typeof (value)== 'undefined' || typeof (value)== 'null'){return false}
// //     if(typeof (value)== 'string' && value.trim().length ==0){return false}
// //     return true
// // }
// // const createReview= async function(req,res){
// //      try{
// //         const data=req.body
        
// //         if(Object.keys(data)==0){return res.status(400).send("data is missing")}

// //        const bookId1=req.params.bookId

// //        const bookDetails=await BookModel.findById(bookId1)
// //         if(!bookDetails){return res.status(400).send("bookId does not exist")}
        



// //         const{bookId, reviewedBy,reviewedAt,rating,review}=data

// //         const req0=isValid(bookId)
// //         if(!req0){ return res.status(400).send("bookId is required")}


// //      let findBookid = await BookModel.findById(bookId)
// //     if (!findBookid) return res.status(400).send("Bookid is not valid")

// //         const req1=isValid(reviewedBy)
// //         if(!req1){ return res.status(400).send("reviewedBy is required")}

// //         const req2=isValid(reviewedAt)
// //         if(!req2){ return res.status(400).send("reviewedAt is required")}

// //         const req3=isValid(rating)
// //         if(!req3){ return res.status(400).send("rating is required")}

// //         const req4=isValid(review)
// //         if(!req4){ return res.status(400).send("review is required")}

// //         if(rating < 1 ||  rating > 5)
// //         {
// //             return res.status(400).send("ratings should be in 1 to 5")
// //         }
// //         let isdeleteded = bookDetails.isDeleted
// //        if(bookId1 ===bookId){
// //         if (isdeleteded == false) {
// //             const saveData= await ReviewModel.create(data)
// //             const saveData1= await ReviewModel.find({ bookId:bookDetails._id, isDeleted: false }).select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })
// //             const saveData2= await ReviewModel.find({ bookId: bookDetails._id, isDeleted: false }).count()
// //             const  bookDetailsWithReviewDetails={
// //                 _id:bookDetails._id,
// //                 title:bookDetails.title,
// //                 excerpt:bookDetails.excerpt,
// //                 userId:bookDetails.userId,
// //                 category:bookDetails.category,
// //               subcategory:bookDetails.subcategory,
// //               deleted:bookDetails.deleted,
// //               reviews:saveData2,
// //               deletedAt: bookDetails.deletedAt,
// //               releasedAt: bookDetails.releasedAt,
// //               createdAt:bookDetails.createdAt,
// //               updatedAt: bookDetails.updatedAt,
// //               reviewsData:saveData1
                
// //              }
// //             return res.status(201).send({status:true,data:bookDetailsWithReviewDetails})
// //         } else {

// //             return res.status(400).send({ status: false, msg: "book is already deleted" })
// //         }
// //     }else{ return res.status(400).send(" bookId does not match ")}
// //     }

// //     catch(err){
// //         res.status(500).send({error:err.message})
// //     }
        
    

// // }

// // const updatedReview= async function(req,res){
// //     try{
// //         const data=req.body
// //         const review=data.review
// //         const rating=data.rating
// //         const reviewedBy=data.reviewedBy
// //         const bookId=req.params.bookId
// //         const reviewId=req.params.reviewId

// //         if(Object.keys(data)==0){return res.status(400).send("data is missing")}


// //         const bookDetails= await BookModel.findById(bookId)
// //         if(!bookDetails){ return res.status(400).send("invalid bookId")}
// //         if(bookId==reviewId){
// //          if(bookDetails.isDeleted ===false){
// //         const FindReview= await ReviewModel.findById(reviewId)
// //         if(!FindReview){ return res.status(400).send("invalid reviewId")}

       

// //         if(FindReview.isDeleted ===false){

// //    const UpdateReview =await ReviewModel.findOneAndUpdate({_id:reviewId,bookId:bookId},{review:review,rating:rating,reviewedBy:reviewedBy},{new:true})
// //    const saveData1= await ReviewModel.find({ bookId: bookDetails._id, isDeleted: false }).select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })
// //    const saveData2= await ReviewModel.find({ bookId: bookDetails._id, isDeleted: false }).count()
// //    const  bookDetailsWithReviewDetails={
// //     _id:bookDetails._id,
// //     title:bookDetails.title,
// //     excerpt:bookDetails.excerpt,
// //     userId:bookDetails.userId,
// //     category:bookDetails.category,
// //   subcategory:bookDetails.subcategory,
// //   deleted:bookDetails.deleted,
// //   reviews:saveData2,
// //   deletedAt: bookDetails.deletedAt,
// //   releasedAt: bookDetails.releasedAt,
// //   createdAt:bookDetails.createdAt,
// //   updatedAt: bookDetails.updatedAt,
// //   reviewsData:saveData1
    
// //  }
// //     return res.status(202).send({status:true,data:bookDetailsWithReviewDetails})

// //         }else{
// //             return res.status(400).send("reviewData is already Deleted")
// //         }
// //     }else{
// //             return res.status(400).send("BookData is already Deleted")
// //         }
// //     }else{
// //         return res.status(400).send(" id does not match")
// //     }
    
// //     }catch(err){
// //         return res.status(500).send({error:err.message})
// //     }
// // }


// // const deletedReview= async function(req,res){
// // try{  


// //     const bookId=req.params.bookId
// //     const reviewId=req.params.reviewId

    
// //     const bookDetails= await BookModel.findById(bookId)
// //     if(!bookDetails){ return res.status(400).send("invalid bookId")}

// //     if(bookDetails.reviewsData._id==reviewId){
// //      if(bookDetails.isDeleted ===false){
// //     const FindReview= await ReviewModel.findById(reviewId)
// //     if(!FindReview){ return res.status(400).send("invalid reviewId")}
// //     if(FindReview.isDeleted ===false){

// //         const deleteReview =await ReviewModel.findOneAndUpdate({_id:reviewId},{isDeleted:true,deleteAt:new Date()},{new:true})
        
// //          const saveData1= await ReviewModel.find({ bookId: bookDetails._id, isDeleted: false }).select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })
// //          const saveData2= await ReviewModel.find({ bookId: bookDetails._id, isDeleted: false }).count()
// //          const  bookDetailsWithReviewDetails={
// //           _id:bookDetails._id,
// //           title:bookDetails.title,
// //           excerpt:bookDetails.excerpt,
// //           userId:bookDetails.userId,
// //           category:bookDetails.category,
// //         subcategory:bookDetails.subcategory,
// //         deleted:bookDetails.deleted,
// //         reviews:saveData2,
// //         deletedAt: bookDetails.deletedAt,
// //         releasedAt: bookDetails.releasedAt,
// //         createdAt:bookDetails.createdAt,
// //         updatedAt: bookDetails.updatedAt,
// //         reviewsData:saveData1
          
// //        }

// //               return res.status(202).send({status:true,msg:'selected reviewData is deleted',data:bookDetailsWithReviewDetails})
     
// //              }else{
// //                  return res.status(400).send("reviewData is already Deleted")
// //              }
// //           }
// //           else{
// //                  return res.status(400).send("BookData is already Deleted")
// //              }
// //             }else{
// //                 return res.status(400).send(" id does not match")
// //             }

 
// //   }catch(err){
// //     return res.status(500).send({error:err.message})
// // }
// // }






// // module.exports.createReview=createReview
// // module.exports.updatedReview=updatedReview
// // module.exports.deletedReview=deletedReview