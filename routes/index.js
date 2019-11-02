const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Project = require('../models/Project');

// Welcome Page
router.get('/', (req, res) => res.render('index'));
router.get('/about',(req, res) => res.render('about'));
router.get('/products',(req, res) => {
    Product.find({}).then((data)=>{
        console.log(data)
    res.render('products',{products:data});
  });});
router.get('/contact',(req, res) => res.render('contact'));
// router.get('/about',(req, res) => res.render('about'));

module.exports = router;
