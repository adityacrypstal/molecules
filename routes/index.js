const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Product = require("../models/Product");
const Project = require("../models/Project");
var fs = require("fs");
const PDF2Pic = require("pdf2pic");

const pdf2pic = new PDF2Pic({
  density: 100,           // output pixels per inch
  savename: "untitled",   // output file name
  savedir: "./images",    // output file location
  format: "png",          // output file format
  size: "600x600"         // output size in pixels
});



let errors = [];
// Welcome Page
router.get("/", (req, res) => {
  Project.find({}).limit(4).sort('-created').then(data => {
    res.render("index", { projects: data, errors: errors });
  });
});
router.get("/about", (req, res) => res.render("about"));
router.get("/products", (req, res) => {
  Product.find({}).then(data => {
    res.render("products", { products: data });
  });
});
router.get("/project", (req, res) => {
  Project.find({}).then(data => {
    res.render("projects", { projects: data, errors: errors });
  });
});
router.get("/contact", (req, res) => res.render("contact"));
// router.get('/about',(req, res) => res.render('about'));
router.get("/testing", async (req, res) => {
  console.log("testing");
  pdf2pic.convert("public/test.pdf").then((resolve) => {
    console.log("image converter successfully!",resolve);
   
    // return resolve;
  });
});
router.get('/sitemap.xml', function(req, res) {
  res.sendFile('public/sitemap.xml');
});
module.exports = router;
