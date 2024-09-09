const express = require("express");
const router = express.Router();

const Listing = require("../models/listing.js");
const wrapAsyn = require("../utils/wrapAsync.js");
const {listingsSchema , reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const {isLoggedIn , isOwner , validateListing} = require("../middileware.js");
const {storage} = require("../cloudConfig.js");

const listingController = require("../controllers/listing.js");
const multer = require("multer");
const upload = multer({storage});





//index Route(Using then and catch method)
// router.get("/listings",(req,res)=>{
//     let allListings;
//   Listing.find({}).then((result)=>{
//         allListings = result;
//         res.render("listings/index.ejs",{allListings}); // /listings/index.ejs => gives error

//    }).catch(err =>{console.log(err)})
     
// })

router.get("/new",isLoggedIn, listingController.renderNewListing);
router.get("/countries",wrapAsyn(listingController.showBasedOnCountries));

router
.route("/")
.get(wrapAsyn(listingController.index))
.post(isLoggedIn , upload.single('listing[image]') ,validateListing,wrapAsyn(listingController.createNewListing));


router
.route("/:id")
.get(wrapAsyn(listingController.showListing))
.put( isLoggedIn,isOwner,upload.single('listing[image]') , validateListing ,wrapAsyn(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsyn(listingController.destroyListing))

// index Route(using async and await keyword)


//New Route // here New Route is added before Show Route because if write it after Show then when the request is send it consider loaclhost:8080/listings/NEW --> here new is consider as id hence show route will get as a response.



//Create Route 
// router.post("/listings",wrapAsyn(async (req,res)=>{

//     // const listings = req.body.listing; //-->another way of accessing form data.
//     // console.log(listings);
//     if(!req.body.listing){
//         throw new ExpressError(400,"Send a Valid data for Listing");
//     }

//     const newListing = new Listing(req.body.listing);
//     // console.log(newListing);
//     await newListing.save();
//     res.redirect("/listings");
    

// }));

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsyn(listingController.editListing));

router.get("/categorie/:id",wrapAsyn(listingController.showBasedOnCategorie) );


//upadate Route

//Delete  Route


module.exports = router;