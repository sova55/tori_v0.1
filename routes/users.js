//users.js in routes/users.js
const express = require('express');
const router = express.Router();
const User = require("../models/user");
const Product = require("../models/product");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { render } = require('ejs');
const {ensureAuthenticated} = require("../config/auth.js");
const e = require('express');
//login handle
router.get('/login',(req,res)=>{
    res.render('login');
})
router.get('/register',(req,res)=>{
    res.render('register')
    })

router.get('/addProduct', ensureAuthenticated,(req,res) => {
    res.render('addProduct')
            
    
    })    
//Register handle
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
    successRedirect : '/dashboard',
    failureRedirect : '/users/login',
    failureFlash : true,
    })(req,res,next);

  })
  //register post handle
  router.post('/register',(req,res)=>{
    const {name,email, password, password2} = req.body;
    let errors = [];
    console.log(' Name ' + name+ ' email :' + email+ ' pass:' + password);
    if(!name || !email || !password || !password2) {
        errors.push({msg : "Please fill in all fields"})
    }
    //check if match
    if(password !== password2) {
        errors.push({msg : "passwords dont match"});
    }
    
    //check if password is more than 6 characters
    if(password.length < 6 ) {
        errors.push({msg : 'password atleast 6 characters'})
    }
    if(errors.length > 0 ) {
    res.render('register', {
        errors : errors,
        name : name,
        email : email,
        password : password,
        password2 : password2})
     } else {
        //validation passed
       User.findOne({email : email}).exec((err,user)=>{
        console.log(user);   
        if(user) {
            errors.push({msg: 'email already registered'});
            res.render('register',{errors,name,email,password,password2})  
           } else {
            const newUser = new User({
                name : name,
                email : email,
                password : password
            });
    
            //hash password
            bcrypt.genSalt(10,(err,salt)=> 
            bcrypt.hash(newUser.password,salt,
                (err,hash)=> {
                    if(err) throw err;
                        //save pass to hash
                        newUser.password = hash;
                    //save user
                    newUser.save()
                    .then((value)=>{
                        console.log(value)
                        req.flash('success_msg','You have now registered!')
                    res.redirect('/users/login');
                    })
                    .catch(value=> console.log(value));
                      
                }));
             }
       })
    }
    })
//logout
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','Now logged out');
    res.redirect('/users/login');
 })

//products 

router.post('/addProduct', (req,res) => {
    const {title, description, category, location, images, asking_price, delivery_type, 
    name, phone_number} = req.body;
    let errors = [];
    console.log('testi');
    if(!title || !description || !category || !location || !images || !asking_price 
        || !delivery_type || !name || !phone_number ) {
            errors.push({msg: 'Please fill in all fields'});
    }
    else { 
        Product.findOne({title : title}).exec((err,product)=> {
            console.log(product);
            if (product) {
                error.push({msg: 'product name already added'});
            }
            else {
                const newProduct = new Product({
                    title : title,
                    description : description,
                    category : category,
                    location : location,
                    images : images,
                    asking_price : asking_price,
                    delivery_type : delivery_type,
                    name : name,
                    phone_number : phone_number
                });
                newProduct.save();
                res.redirect('/dashboard');
            }

        })

    }


})

router.get('/Products', function (req,res) {
    Product.find({}, function (err,data) {
        res.render('products', {
            user : req.user,
            data : data
        })
    })
})

router.post('/delete', function(req, res, next) {
    var id = req.body.id;
        Product.findByIdAndRemove(id).exec();
    res.redirect('/users/Products');
   });

router.post('/update', function (req,res,next) {
    var id = req.body.id;
    Product.findById(id, function (err,doc) {
        if (err) {return err;}
        doc.title = 'Testi';
    })

})








module.exports  = router;