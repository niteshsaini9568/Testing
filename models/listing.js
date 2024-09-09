const mongoose =  require("mongoose");
const Schema =mongoose.Schema;
const Review = require("./review.js");



const listingSchema =  new Schema({
    title :{
        type : String,
        required : true
    },
    description :{
        type : String,
        
    },
    image :{
        url : {
            type : String
        },
        filename : String
    },
    price :{
        type : Number
        
    },
    location : String,
    country : String,
    reviews : [{
        type : Schema.Types.ObjectId,
        ref : "Review"
    }
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    categorie:{
        type:String,
        enum : ["Trending","Rooms","Iconic City" , "Mountains","Camping","Farms","Castles","Amazing Pools","Arctic","Domes","Boats"]
    }
});


listingSchema.post("findOneAndDelete" , async (listing)=>{
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}});
    }
    
})

const Listing = mongoose.model("Listing" , listingSchema);

module.exports = Listing;