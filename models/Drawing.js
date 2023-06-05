var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var drawingSchema = new Schema({
    inputFileName:String,
    PDF_FileNameInNAS:String,
    CAD_FileNameInNAS:String,
    drawingNumber:String,
    version:String,
    draftsman:String,
    isPDF:{type:Boolean, default:false},
    isCAD:{type:Boolean, default:false},
    reserved:{type:Boolean, default:false},
    reservedBy:{type:String, default:'N/A'},
    lineName:String,
    stationName:String,
    categoryName:String,
    pathForPDF:String,
    pathForCAD:String,
    createdDate:String,
    lastUpdated:String,
    longDate:String,
    JSON_Date:{type:Date, default:Date.now},
    approvedDate:String
}, {collection:'drawing'})

module.exports = mongoose.model('drawing', drawingSchema);