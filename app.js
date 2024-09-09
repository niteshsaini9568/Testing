if(process.env.NODE_ENV != "production"){
require("dotenv").config();
}




const express= require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");

 const flash = require("connect-flash");
 const LocalStratagy = require("passport-local");
 const User = require("./models/user.js");


const listingsRoute = require("./routes/listing.js");
const reviewsRoute = require("./routes/review.js");
const usersRoute = require("./routes/user.js");




const passport = require("passport");

const dbUrl =process.env.ATLASDB_URL;

const app = express();

main()
.then(()=>{console.log("the connection has been made successfully")})
.catch((err)=>{console.log("in connection :::",err)});


async function main(){
    await mongoose.connect(dbUrl);
}

app.use(express.urlencoded({extended : true}));
app.set("view engine" , "ejs");
app.set("views", path.join(__dirname,"/views"));

app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs" , ejsMate);
app.use(express.static(path.join(__dirname,"public")));


const store= MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error" , ()=>{
    console.log("ERROR in MONGO SESSION STORE" , err);
});

const sessionOption = {
    
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() +  7 * 24 * 60 * 60 * 1000,
        maxAge :  7 * 24 * 60 * 60,
        httpOnly : true

    }
}



app.use(session(sessionOption));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratagy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.successMessage = req.flash("success");
    res.locals.errorMessage = req.flash("error");
    res.locals.currUser = req.user;
    next();
})



app.use("/listings",listingsRoute);  
app.use("/listings/:id/reviews",reviewsRoute);
app.use("/", usersRoute);


//handling page  not found Error 
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
})

//handing error throw middleware
app.use((err, req, res, next) => {
    
    const { statusCode = 500, message = "Something went wrong" } = err;
    console.log(err);
    res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080, ()=>{
    console.log("listiening at 8080 port ");
});
//