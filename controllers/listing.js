const Listing = require("../models/listing");


module.exports.index = async (req,res)=>{
  
    const allListings= await Listing.find({});
    
    res.render("listings/index.ejs",{allListings }); // /listings/index.ejs => gives error
    
}

module.exports.renderNewListing = ((req,res)=>{
    res.render("listings/new.ejs");
})

module.exports.showListing = async (req,res)=>{
    let {id} = req.params; // extracting id
    const listing = await Listing.findById(id).populate({path :"reviews" , populate :{path : "author"}}).populate("owner");//id
    if(!listing){
        req.flash("error" , "Listing you requested for is not exists");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}

module.exports.createNewListing = async (req, res) => {
    // if (!req.body.listing) {
    //     throw new ExpressError(400, "Send valid data for Listing");
    // }
    // result = listingsSchema.validate(req.body);
    // console.log(result);
    // if(result.error){
    //     throw new ExpressError(400,result.error);
    // }
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.image = {url , filename};
    console.log(req.user)
    newListing.owner = req.user._id;
    //with out using joi
    // if(!newListing.title){
    // throw new ExpressError(400,"Title is missing");
    // }
    await newListing.save();
    req.flash("success", "New Listing Added Successfully");
    res.redirect("/listings"); // Only one response here
}

module.exports.editListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
     req.flash("error" , "Listing you requested for is not exists");
     res.redirect("/listings");
 }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload" , "/upload/h_250,w_250");
    res.render("listings/edit.ejs",{listing , originalImageUrl});
 }

 module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;            
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send a Valid data for Listing");
    // }
    
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file != "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url , filename};
    await listing.save()
    }
    req.flash("success", "Listing updated Successfully");
    res.redirect(`/listings/${id}`);
 }

 module.exports.destroyListing = async (req,res)=>{
    let {id} = req.params;
    let deletedListing =  await Listing.findByIdAndDelete(id);
    req.flash("success", " Listing Deleted Successfully");
    // console.log(deletedListing);
    res.redirect("/listings");
    
}

module.exports.showBasedOnCategorie = async(req, res)=>{
   let {id}= req.params;
   
   let listings = await Listing.find();
   let listingsCategorie = listings.filter((listing)=>(listing.categorie == id));
  
   res.render("listings/categorie.ejs",{listingsCategorie , id});
}
module.exports.showBasedOnCountries = async(req, res)=>{
   let country= req.query.data;
   console.log(country);
  
   let listings = await Listing.find();
   let listingsCategorie = listings.filter((listing)=>(listing.country.toLocaleLowerCase() === country.toLocaleLowerCase()));
   
   res.render("listings/categorie.ejs",{listingsCategorie , id : country});
}