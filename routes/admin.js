var express = require('express');
//var router = express.Router();
var router = require('express-promise-router')();
var mongoose = require('mongoose');
//var Location = require('../models/Location');
const AdminController = require('../controllers/admin-controller');

//const pwd = process.env.MONGODB_PWD;
const url = "mongodb://localhost:27017/dms";
mongoose.connect(url, {
    useNewUrlParser:true,
    useUnifiedTopology:true
});

mongoose.set('useFindAndModify', false);



router.route('/').get(AdminController.adminPage);
// /* GET users listing. */
// router.get('/', function(req, res, next) {
//  Location.find().sort({rank:1})
//        .then(function(doc) {
//           res.render('admin', {title: 'Drawing Management System  - Administration', items: doc})
//        });
// });




router.route('/createLine').post(AdminController.createLine);
// router.post('/createLine', function(req, res, next) {
//     var item = {
//         line: req.body.line,
//         lineValue: req.body.line,
//         name: req.body.name
//     };

//     var data = new Location(item);
//     console.log(data);
//     data.save();

    
//     res.redirect('/admin');
// });


router.route('/createLocation').post(AdminController.createLocation);
// router.post('/createLocation', function(req, res, next) {
//     var SelectLine = req.body.SelectLine;
//     var InputLocation = req.body.InputLocation;

//     Location.countDocuments({line:SelectLine, loc:InputLocation}, function(err, count){
//         console.log('Count: %d', count);
//         if (err) {
//             console.log(err);
//             res.send('count: ' + err);
//         }
//         if(count == 0) {
//             Location.updateOne({line:SelectLine},{"$push":{loc:InputLocation}})
//                 .then(function(err, doc){
//                 if(err) {
//                     console.error('error, no entry found');
//                 }
//             });
//         } else {
//             res.send('Station already exists!');
//         }
//     });
// ////    } else {
// //        Location.update({line:line},{"$push":{loc:loc}})
// //           .then(function(err, doc){
// //                if(err) {
// //                    console.error('error, no entry found');
// //                }
// //            res.redirect('/admin');
// //        });
// //    }
// });

router.route('/createCategory').post(AdminController.createCategory);

router.route('/get-lines').get(AdminController.getLines);

// router.get('/get-lines', function(req, res, next) {
//   Location.find().sort({rank:1})
//         .then(function(doc) {
//            res.render('admin', {items: doc}) //render web page with "doc"
//         });
// });

router.route('/SelectLineForCategory').post(AdminController.SelectLineForCategory);
router.route('/editDrawingTitle').post(AdminController.editDrawingTitle);
router.route('/selectChange').get(AdminController.selectChange);
router.route('/loadTable').get(AdminController.loadTable);
router.route('/deleteLine').post(AdminController.deleteLine);
router.route('/deleteStation').post(AdminController.deleteStation);
router.route('/deleteCategory').post(AdminController.deleteCategory);
router.route('/stationSelectForDeleteCategory').post(AdminController.stationSelectForDeleteCategory);

module.exports = router;
