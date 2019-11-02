const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
var multer  = require('multer')
var upload = multer({ dest: 'public/uploads/' });
const sgMail = require('@sendgrid/mail');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
// Load User model
const User = require('../models/User');
const Product = require('../models/Product');
const Project = require('../models/Project');
let errors = [];
// Login Page
router.get('/', ensureAuthenticated, (req, res) => {
          Product.find({}).then((data)=>{
            res.render('dash',{product:data,errors:errors});
          });
          
        });

// Register Page
router.get('/project', ensureAuthenticated, (req, res) => {
  Project.find({}).then((data)=>{
    res.render('project_admin',{project:data,errors:errors});
  });
});

//Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register
router.post('/register', (req, res) => {
  // const { name, email, password, password2 } = { "admin","admin@moleculeec.com", "admin@qwerty123", "admin@qwerty123" };
  const name = "admin";
  const email = "admin@moleculeec.com";
  const password = "admin@qwerty123";
  const password2 = "admin@qwerty123";

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    // res.render('register', {
    //   errors,
    //   name,
    //   email,
    //   password,
    //   password2
    // });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        // res.render('register', {
        //   errors,
        //   name,
        //   email,
        //   password,
        //   password2
        // });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                // res.redirect('/users/login');
                return "Aditya"
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});
//Product
router.post('/addProduct',upload.single('image1'),(req, res)=>{
  let errors = [];
    const{title, type, capacity, tank} = req.body;
    const image1 = req.file.filename
    console.log(image1)
    if(!title || !type || !capacity || !tank || !image1){
      errors.push({ msg: 'Please Fill All Data' });
      Product.find({}).then((data)=>{
        res.render('dash',{product:data,errors});
      })
      
    }else{
      new Product({title, type, capacity, tank, image1}).save().then((data)=>{
        req.flash(
          'success_msg',
          'Data Inserted!'
        );
        res.redirect('/admin')
      }).catch((err)=>console.log(err))
    }
});
router.get('/deleteProduct/:id',(req, res)=>{
  Product.remove({ _id: req.params.id }).then((data)=>{
        res.redirect('/admin')
      }).catch((err)=>
  console.log(err))
})

// Project
var cpUpload = upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image23', maxCount: 1 }, { name: 'image4', maxCount: 1 }])
router.post('/addProject', cpUpload, (req, res)=>{
  let errors = [];
    const{title, content, image1, image2, image3, image4} = req.body;
    if(!title || !content || !image1){
      errors.push({ msg: 'Please Fill All Data' });
      Project.find({}).then((data)=>{
        console.log(data)
        res.render('project_admin',{project:data,errors});
      })
      
    }else{
      new Project({title,content, image1, image2, image3, image4}).save().then((data)=>{
        req.flash(
          'success_msg',
          'Data Inserted!'
        );
        res.redirect('/admin/project')
      }).catch((err)=>console.log(err))
    }
});
router.get('/deleteProject/:id',(req, res)=>{
  Project.remove({ _id: req.params.id }).then((data)=>{
        res.redirect('/admin/project')
      }).catch((err)=>
  console.log(err))
});

router.post("/sentMail",(req, res)=>{
  console.log(req.body);
  sgMail.setApiKey('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');
  console.log(process.env.SENDGRID_API_KEY)
  const msg = {
    to: 'adityavadityav@gmail.com',
    from: 'admin@molecule',
    subject: 'Someone is asking about your product',
    text: `Name:${req.body.name}, email:${req.body.email}, Phone: ${req.body.phone}, Address:${req.body.address}, Message:${req.body.text}`,
  };
  sgMail.send(msg).catch((err)=>console.log(err));
  res.redirect('/contact')
})
// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/admin/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/admin/login');
});

module.exports = router;
