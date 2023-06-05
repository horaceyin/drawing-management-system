var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var locationDataSchema = new Schema({
    line:{
        type:String,
        required:true
    },
    lineValue:{
        type:String
    },
    name:{
        type:String
    },
    loc:[{
        stationName:String, 
        link:String,
        category:[{
            categoryName:String,
            link:String
        }]
    }],
    path:{
        type:String
    }
}, {collection:'location'});

// var locationDataSchema = new Schema({
//     line:{
//         type:String,
//         required:true
//     },
//     lineValue:{
//         type:String
//     },
//     name:{
//         type:String
//     },
//     station:[{
//         type:String
//     }],
//     loc:[{
//         type: Schema.Types.ObjectId,
//         ref: 'station'
//     }]
// }, {collection:'location'});


module.exports = mongoose.model('location', locationDataSchema);