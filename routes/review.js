const express= require("express");
const router = express.Router({mergeParams : true});
const wrapAsyn = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview , isLoggedIn , isReviewAuthor} = require("../middileware.js");

const reviewController = require("../controllers/review.js");

// ------- Reviews --------
//post Review Route
router.post("/", isLoggedIn , validateReview , wrapAsyn(reviewController.createReview));

//Delete Review Route
router.delete("/:review_id" ,isLoggedIn,isReviewAuthor,wrapAsyn(reviewController.destroyReview))

// router.post("/listings/:id/reviews", (req, res, next) => {
//     console.log('Middleware: Request Body:', req.body);
//     next();
//   }, validateReview, wrapAsyn(async (req, res) => {
//     let listing = await Listing.findById(req.params.id);
//     let newReview = new Review(req.body.review);
//     listing.reviews.push(newReview);
//     await newReview.save();
//     await listing.save();
//     res.redirect(`/listings/${listing._id}`);
//   }));


module.exports = router;