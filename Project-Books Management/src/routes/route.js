const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController")
const bookController = require("../controllers/bookController")
const reviewController = require("../controllers/reviewController")
const middleWear = require("../middlewear/auth")


router.get("/test-me", function (req, res) {
    res.send("*****My Third Project*****")
})


// user API
router.post("/register", userController.createUser)

router.post("/login", userController.loginUser)


// book API
router.post("/books", middleWear.authentication, middleWear.authorization, bookController.createBooks)

router.get("/books", middleWear.authentication, bookController.getBooks)

router.get("/books/:bookId", middleWear.authentication, bookController.getAllBooks)

router.put("/books/:bookId", middleWear.authentication, middleWear.authorization, bookController.updateBooks)

router.delete("/books/:bookId", middleWear.authentication, middleWear.authorization, bookController.deleteBook)


// Review API
router.post("/books/:bookId/review", reviewController.createReview)

router.put("/books/:bookId/review/:reviewId", reviewController.updatedReview)

router.delete("/books/:bookId/review/:reviewId", reviewController.deletedReview)


module.exports = router;
