const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Admin = require('../models/AdminModel');
const User = require('../models/UserModel');
const bcrypt = require('bcrypt');

// Admin Login Stategy 
passport.use('adminLogin',new LocalStrategy({usernameField:'email',passReqToCallback:true},async (req,email,password,done)=>{
    const adminData = await Admin.findOne({email:email,status:true});
    if(adminData){
        if(await bcrypt.compare(password,adminData.password)){
            return done(null,adminData);
        }else{
            req.flash('error',"Invalid Password");
            return done(null,false);
        }
    }else{
        req.flash('error',"Invalid Email");
        return done(null,false);
    }
}));

// user Login Stategy 
passport.use('userLogin',new LocalStrategy({usernameField:'email',passReqToCallback:true},async (req,email,password,done)=>{
    const userData = await User.findOne({email:email,status:true});
    if(userData){
        if(await bcrypt.compare(password,userData.password)){
            return done(null,userData);
        }else{
            req.flash('error',"Invalid Password");
            return done(null,false);
        }
    }else{
        req.flash('error',"Invalid Email");
        return done(null,false);
    }
}));

passport.serializeUser((user,done)=>{
    return done(null,user.id);
})

passport.deserializeUser(async(id,done)=>{
    const adminData = await Admin.findById(id);
    if(adminData){
        return done(null,adminData);
    }else{
        const userData = await User.findById(id);
        if(userData){
            return done(null,userData);
        }else{
            return done(null,false);
        }
    }
});

passport.setAuthUser = async (req,res,next)=>{
    if(req.isAuthenticated()){
        res.locals.adminData = req.user;
    }
    next()
};

passport.checkLogin = async(req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/admin');
}

module.exports = passport;