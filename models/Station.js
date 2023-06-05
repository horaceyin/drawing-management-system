var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var stationSchema = new Schema({
    stationName:String,
    belongTo:String,
    category:[{
        categoryName:String,
        path:String
    }],
    path:String
}, {collection:'station'})

module.exports = mongoose.model('station', stationSchema);