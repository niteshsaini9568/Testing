const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingsSchema , reviewSchema} = require("./schema.js");



module.exports.isLoggedIn = (req, res, next)=>{
    // console.log(res.locals.redirectUrl)
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        
        req.flash("error" , "You must be logged in!");
       return res.redirect("/login");
    }

    next();
};


module.exports.saveRedirectUrl = (req, res , next)=>{
    if( req.session.redirectUrl){
         res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req , res, next)=>{
    let {id} = req.params;            
    
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this Listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

//validation of Listing from Server side using joi package
module.exports.validateListing = (req,res,next)=>{
    let {error} = listingsSchema.validate(req.body);
    
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        // console.log(errMsg);
        throw new ExpressError(400,errMsg);
    }else {
        next();
    }
}
//validation of review from Server side using Joi 
module.exports.validateReview = (req, res, next) => {
    //   console.log('Request Body:', req.body);
      const { error } = reviewSchema.validate(req.body);
    
      if (error) {
        console.log('Validation Error:', error.details);
        const errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
      } else {
        next();
      }
    };

    module.exports.isReviewAuthor = async (req , res, next)=>{
        let {id , review_id} = req.params;            
        
        let review = await Review.findById(review_id);
        if(!review.author.equals(res.locals.currUser._id)){
            req.flash("error", "You are not the Author of this Review");
            return res.redirect(`/listings/${id}`);
        }
        next();
    }