const express=require('express');
const router=express.Router();
const UserController=require('../controllers/userController')
const BookController=require('../controllers/bookController')
const ReviewController=require('../controllers/reviewController')
const Middleware=require('../middleware/middleware')
const removeUploadedFiles = require('multer/lib/remove-uploaded-files');


// creating User
router.post('/register',UserController.createUser )

// login the User and creating jwt token
router.post('/login',UserController.loginUser )

// creating the book
router.post('/books', BookController.createBook )

// get all the books
router.get('/books', Middleware.authentication, BookController.getBook)

// get books by Id
router.get('/books/:bookId', Middleware.authentication, BookController.getBookByParams)

// update books
router.put('/books/:bookId', Middleware.authentication, Middleware.authorization, BookController.updateBooks)

// delete books
router.delete('/books/:bookId', Middleware.authentication, Middleware.authorization, BookController.deleteBooks)

// creating review for books
router.post('/books/:bookId/review', ReviewController.createReview)

// update a Review Details for books
router.put('/books/:bookId/review/:reviewId', ReviewController.updatedReview)

// delete a Review Details for books
router.delete('/books/:bookId/review/:reviewId', ReviewController.deletedReview)


module.exports=router;