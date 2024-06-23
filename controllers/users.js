const User = require("../models/user");


module.exports.renderSignUpForm = (req,res) => {
    res.render("./users/signup.ejs");
};


module.exports.signup = async(req,res) => {
    try{
        let {username, email, password} = req.body; 
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        // console.log(registeredUser);
        req.login(registeredUser,(err) => {          //we use this method to login the user automatically after signup
            if(err) {
                return next(err);
            }
            req.flash("success", "Welcome to WanderLust");
            res.redirect("/listings");
        })
    }catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req,res) => {
    res.render("./users/login.ejs");
};

module.exports.login = async(req,res) => {
    req.flash("success","Welcome back to wanderLust");
    let redirectUrl = res.locals.redirectUrl || "/listings";  //we use this because once we logout and login through main(all listings) route that shows page not found thats whay we use two conditions
    res.redirect(redirectUrl);  //here it will redirect the page into required url once user login
};

module.exports.logout = (req,res,next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    })
};
