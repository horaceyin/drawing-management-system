var express = require("express");
var router = require("express-promise-router")();
//var router = express.Router();
var mongoose = require("mongoose");
const DMSController = require("../controllers/dms-controller");
var path = require("path");
var os = require("os");

const osPath = os.homedir();

const homedirBackSlash = path.join(
  "/download",
  osPath,
  "DMS",
  "Line",
  ":line",
  ":station",
  ":category",
  ":fileName"
);
var temp = homedirBackSlash.replace(/ /g, "%20");
var homedirForwardSlash = temp.replace(/\\/g, "/");

//const pwd = process.env.MONGODB_PWD;
const url = "mongodb://localhost:27017/dms";
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

/* GET users listing. */
router.route("/").get(DMSController.DMS_Page);

router
  .route("/getDrawingByLineAndStation")
  .post(DMSController.getDrawingByLineAndStation);
router.route("/drawingName").post(DMSController.getDrawingWithName);
router.route(homedirForwardSlash).get(DMSController.downloadFile);
router.route("/getDrawingByAjax").post(DMSController.getDrawingByAjax);
router
  .route("/getDrawingByMultiSelect")
  .post(DMSController.getDrawingByMultiSelect);

router.route("/disableLine").post(DMSController.disableLine);
router.route("/disableStation").post(DMSController.disableStation);
router.route("/disableCategory").post(DMSController.disableCategory);
router.route("/getMultiStation").post(DMSController.getMultiStation);
router.route("/getMultiCategory").post(DMSController.getMultiCategory);

module.exports = router;
