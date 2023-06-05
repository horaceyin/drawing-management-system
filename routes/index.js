var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var Location = require("../models/Location");

//const pwd = process.env.MONGODB_PWD;
const url = "mongodb://localhost:27017/dms";
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// app is running on port 8080

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

// router.get('/admin', function(req, res, next) {
//   Location.find().sort({rank:1})
//         .then(function(doc) {
//           //console.log(doc + "HERE");
//            res.render('admin', {title: 'Drawing Management System  - Administration', items: doc}) //render web page with "doc"
//    });
// });

module.exports = router;
