var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var categorySchema = new Schema({
    categoryName:String,
    obtainedBy:{
        stationName:String,
        stationID:{type: Schema.Types.ObjectId, ref: 'station'}
    },
    drawing:[{type: Schema.Types.ObjectId, ref: 'drawing'}]
}, {collection:'category'})

module.exports = mongoose.model('category', categorySchema);