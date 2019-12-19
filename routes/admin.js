const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
var multer  = require('multer')
const upload = multer({

  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|JPG)$/)) {
      req.fileValidationError = 'goes wrong on the mimetype';
      return cb(null, false, new Error('goes wrong on the mimetype'));
    }


    cb(undefined, true)
  }
});
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
    console.log(req.file)
    const image1 = req.file.buffer
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
var cpUpload =upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 }])
router.post('/addProject', cpUpload, (req, res)=>{
  let errors = [];
    const{title, content} = req.body;
    console.log(req.files)
    const image1 = req.files['image1'] ? req.files['image1'][0].buffer : null;
    const image2 = req.files['image2'] ? req.files['image2'][0].buffer : null;
    const image3 = req.files['image3'] ? req.files['image3'][0].buffer : null;
    const image4 = req.files['image4'] ? req.files['image4'][0].buffer : null;
    if(!title || !content || !image1){
      errors.push({ msg: 'Please Fill All Data' });
      Project.find({}).then((data)=>{
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

router.post("/sentMail",async (req, res)=>{
  console.log(req.body);
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: 'moleculesenvirocare@gmail.com',
    from: 'admin@molecule',
    subject: 'Someone is asking about your product',
    text: `Name:${req.body.name}, email:${req.body.email}, Phone: ${req.body.phone}, Address:${req.body.address}, Message:${req.body.text}`,
  };
  await sgMail.send(msg).catch((err)=>console.log(err));
  await res.redirect('/contact')
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
