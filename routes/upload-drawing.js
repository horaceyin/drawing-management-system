var express = require('express');
//var router = express.Router();
var router = require('express-promise-router')();
var mongoose = require('mongoose');
const UploadDrawingController = require('../controllers/upload-drawing-controller');

//const pwd = process.env.MONGODB_PWD;
const url = "mongodb://localhost:27017/dms";
mongoose.connect(url, {
    useNewUrlParser:true,
    useUnifiedTopology:true
});


router.route('/').get(UploadDrawingController.uploadDrawingPage);
router.route('/').post(UploadDrawingController.uploadDrawing);
router.route('/SelectLineForDrawing').post(UploadDrawingController.SelectLineForDrawing);
router.route('/SelectStationForDrawing').post(UploadDrawingController.SelectStationForDrawing);

module.exports = router;