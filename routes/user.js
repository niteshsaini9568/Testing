const express= require("express");
const router = express.Router({mergeParams : true});
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middileware.js");

const userController = require("../controllers/user.js");
const user = require("../models/user.js");


router
.route("/signup")
.get(userController.renderSignUp)
.post( wrapAsync(userController.signUp));


router.route("/login")
.get(userController.renderLogin)
.post(saveRedirectUrl, passport.authenticate("local",{failureRedirect : "/login" , failureFlash : true}) , wrapAsync(userController.login));



router.get("/logout",userController.logout)

module.exports = router;
