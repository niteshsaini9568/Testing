const Review = require("../models/review");
const Listing = require("../models/listing");

module.exports.createReview = async (req,res)=>{
    // console.log("in post route of review")
    // console.log(req.params.id);
    if(!req.params.id){
        throw new ExpressError(500, "Something went wrong");
    }
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("Review added Successfully");
    req.flash("success", "New Review Added Successfully");
    res.redirect(`/listings/${listing._id}`);

}

module.exports.destroyReview = async (req,res)=>{
    let {id , review_id} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull : {reviews : review_id}});
    await Review.findByIdAndDelete(review_id);
    req.flash("success", "Review Deleted Successfully");
    res.redirect(`/listings/${id}`);
}