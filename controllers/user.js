const User = require("../models/user");

module.exports.renderSignUp =  (req,res)=>{
    res.render("users/signup.ejs")
}

module.exports.signUp = async(req , res , next)=>{
    try {
        
        let {username , password , email} = req.body;
        const newUser = new User({email , username});
        const registeredUser=await User.register(newUser , password);
        console.log(registeredUser);
        req.login(registeredUser ,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","welcome to wanderlust");
            res.redirect("/listings");
        })
        
    }catch(err){
        req.flash("error","User already Exists");
        res.redirect("/signup");
    }
}

module.exports.renderLogin = (req,res)=>{
    res.render("users/login.ejs")
}

module.exports.login = async (req, res)=>{
    console.log(req.body);
    req.flash("success" , "Welcome back to wanderlust");
    // console.log(res.locals.redirectUrl)
    let redirectUrl = res.locals.redirectUrl || "/listings"
    // console.log(redirectUrl);
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res,next)=>{
    req.logOut((err)=>{
     if(err){
         return next(err);
     }
     req.flash("success", "You suucessfully loged out");
     res.redirect("/listings");
    })
 }