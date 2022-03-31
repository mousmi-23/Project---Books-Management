const express=require('express');
const router=express.Router();
const UserController=require('../controllers/userController')
const BookController=require('../controllers/bookController')
const ReviewController=require('../controllers/reviewController')
const Middleware=require('../middleware/middleware')





router.post('/register',UserController.createUser )

router.post('/login',UserController.loginUser )

router.post('/books',BookController.createBook )

router.get('/books', BookController.getBook)

router.get('/books/:bookId', BookController.getBookByParams)

router.put('/books/:bookId',Middleware.authentication,Middleware.authorization, BookController.updateBooks)

router.delete('/books/:bookId',Middleware.authentication,Middleware.authorization, BookController.deleteBooks)

router.post('/books/:bookId/review',ReviewController.createReview)

router.put('/books/:bookId/review/:reviewId',ReviewController.updatedReview)

router.delete('/books/:bookId/review/:reviewId',ReviewController.deletedReview)



module.exports=router;




// const express = require('express');
// const router = express.Router();
// const UserController= require("../controllers/userController")
// const BookController= require("../controllers/bookController")
// const ReviewController= require("../controllers/reviewController")
// //const Mw = require("../middleware/auth")


// router.get("/test-me", function (req, res) {
//     res.send("My first ever api!")
// })


// // creating User
// router.post("/register", UserController.createUser)

// // login the User and creating jwt token
// router.post("/login", UserController.loginUser)

// // creating the book
// router.post("/books", BookController.createBook)

// // get all the books
// router.get("/books", BookController.getBook)

// // get books by Id
// router.get("/Books/:BookId", BookController.GetBookByParams)

// // update books
// router.put("/books/:bookId", BookController.updateBooks)

// // delete books
// router.delete("/books/:bookId", BookController.deleteBook)

// // creating review for books
// router.post("/books/:bookId/review", ReviewController.createReview)

// // update a Review Details
// router.put("/books/:bookId/review/:reviewId", ReviewController.updatedReview)

// // delete a Review Details
// router.delete("/books/:bookId/review/:reviewId", ReviewController.deletedReview)

// module.exports = router;