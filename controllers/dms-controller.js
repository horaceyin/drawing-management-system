var Location = require('../models/Location');
var Station = require('../models/Station');
var Drawing = require('../models/Drawing');
var path = require('path');
var os = require('os');

const osPath = os.homedir();

module.exports = {
    DMS_Page: async(req, res, next) =>{
        const menuList = await Location.find(null, {_id: 0, line: 1, loc: 1, 'loc.stationName': 1}, {sort: {line: 1}});

        for(var i = 0; i < menuList.length; i++){
            menuList[i].loc.sort();
        }
        res.render('dms', {items:menuList});
    },
    
    getDrawing: async(req, res, next) =>{

        const clickLine = req.params.clickLine;
        const clickStation = req.params.clickStation;
        const clickCategory = '---------------------------------';

        var drawing = {
            lineName: clickLine,
            stationName: clickStation
            //categoryName: clickCategory
        }

        const theDrawing = await Drawing.find(drawing);

        const docOfLocation = await Location.find().sort({rank:1});

        res.render('dms', {drawing: theDrawing, line: clickLine, station: clickStation, category: clickCategory, items: docOfLocation});
        //res.render('dms', {drawing: theDrawing, items: docOfLocation});
    },

    getDrawingWithName:async(req, res, next) =>{
        const temp = '--------------------------------------------------------------------------------------';
        const searchDrawingName = req.body.searchDrawingName.trim();

        const drawingsWithName = await Drawing.find({inputFileName: new RegExp(searchDrawingName, 'i')});
        const docOfLocation = await Location.find().sort({rank:1});

        if(Object.keys(drawingsWithName).length > 0){
            res.render('dms', {drawing: drawingsWithName, line:temp, station:temp, category:temp, items: docOfLocation});
        }else{
            res.send('no such drawing file.');
        }
    },

    downloadFile: async(req, res, next) =>{

        var fileName;
        var FileNameInDMS = req.params.fileName;
        var extensionName = path.extname(FileNameInDMS);

        if(FileNameInDMS.includes('_version_')){
            var fileNameSplit = FileNameInDMS.split('_version_');
            fileName = fileNameSplit[0] + extensionName;
        }else{
            fileName = FileNameInDMS;
        }
        
        var downloadPath = path.join(osPath, 'DMS', 'Line', req.params.line, req.params.station, req.params.category, req.params.fileName);
        
        res.download(downloadPath, fileName);


    }, 

    //Ajax testing
    getDrawingByAjax:async(req, res, next) =>{
        const searchDrawingName = req.body.searchDrawingName.trim().replace('(', '\\(').replace(')', '\\)');
        const drawingsWithName = await Drawing.find({inputFileName: new RegExp(searchDrawingName, 'i')}, null, {sort:{inputFileName:1}});
        drawingsWithName.unshift(null);

        if(drawingsWithName.length === 1){
            drawingsWithName[0] = false;
        }else{
            drawingsWithName[0] = true;
        }

        res.send(drawingsWithName);
    },

    //Get drawing by line and station using Ajax
    getDrawingByLineAndStation: async(req, res, next) =>{
        const theStation = req.body.station;
        const theLine = req.body.line;

        var theDrawing = await Drawing.find({lineName: theLine, stationName: theStation}, null, {sort:{inputFileName:1}});
        
        theDrawing.unshift(null);

        if(theDrawing.length === 1){
            theDrawing[0] = false;
        }else{
            theDrawing[0] = true;
        }

        res.send(theDrawing);
        //console.log(theDrawing,'fsdfsdf');
    },

    getDrawingByMultiSelect: async(req, res, next) =>{
        const multiQueryArray = JSON.parse(req.body.multiQueryArray);
        var returnObject = {};

        //console.log(multiQueryArray,'multi-query');

        for(var i = 0; i < multiQueryArray.length; i++){
            const conditions = multiQueryArray[i].split('?');
            var theDrawing;
            var key;

            if(conditions.length === 1){
                key = conditions[0];
                theDrawing = await Drawing.find({lineName: conditions[0]});
            }else if(conditions.length === 2){
                key = conditions[0] + ' > ' + conditions[1];
                theDrawing = await Drawing.find({
                    lineName: conditions[0],
                    stationName: conditions[1]
                });
            }else if(conditions.length === 3){
                key = conditions[0] + ' > ' + conditions[1] + ' > ' + conditions[2];
                theDrawing = await Drawing.find({
                    lineName: conditions[0],
                    stationName: conditions[1],
                    categoryName: conditions[2]
                })
            }

            returnObject[key] = theDrawing;
        }

        res.send(returnObject);
    },

    disableLine: async(req, res, next) =>{
        const allOptionsArray = JSON.parse(req.body.allOptionsArray);
        var disableLineArray = [];

        for(var i = 0; i < allOptionsArray.length; i++){
            const theLine = await Location.findOne({line: allOptionsArray[i].key});
            const theDrawing = await Drawing.findOne({lineName: allOptionsArray[i].key});

            if(theLine.loc[0] === undefined || theDrawing == null ){
                disableLineArray.push({
                    key: allOptionsArray[i].key,
                    group: allOptionsArray[i].group
                });
            }
        }
        res.send(disableLineArray);
    },

    disableStation: async(req, res, next) =>{
        const allStationOptions = JSON.parse(req.body.allStationOptionsArray);
        var disableStationArray = [];

        for(var i = 0; i < allStationOptions.length; i++){
            const theStation = await Station.findOne({
                stationName: allStationOptions[i].key,
                belongTo: allStationOptions[i].group
            });

            const theDrawing = await Drawing.findOne({
                lineName: allStationOptions[i].group,
                stationName: allStationOptions[i].key
            })

            if(theStation.category[0] === undefined || theDrawing == null){
                disableStationArray.push({
                    key: allStationOptions[i].key,
                    group: allStationOptions[i].group
                });
            }
        }
        res.send(disableStationArray);
    },

    disableCategory: async(req, res, next) =>{
        const allCategoryOptions = JSON.parse(req.body.allCategoryOptionsArray);
        var disableCategoryArray = [];

        for(var i = 0; i < allCategoryOptions.length; i++){
            const theDrawing = await Drawing.findOne({
                lineName: allCategoryOptions[i].lineName,
                stationName: allCategoryOptions[i].stationName,
                categoryName: allCategoryOptions[i].categoryName,
            });

            if(theDrawing == null){
                disableCategoryArray.push({
                    key: allCategoryOptions[i].key,
                    group: allCategoryOptions[i].group
                });
            }
        }
        //console.log(disableCategoryArray, 'asdasdsadafaf');
        res.send(disableCategoryArray);
    },

    getMultiStation: async(req, res, next) =>{
        const theMultiLineArray = JSON.parse(req.body.selectedLineArray);
        theMultiLineArray.unshift(null);

        if(theMultiLineArray.length === 1){
            theMultiLineArray[0] = false;
        }else{
            theMultiLineArray[0] = true;
        }

        var theMultiStationWithLineKey = {};

        if(theMultiLineArray.shift()){
            for(var i = 0; i < theMultiLineArray.length; i++){
                
                var stationName = await Location.findOne({line: theMultiLineArray[i]}, {loc:1});
                
    
                var stationArray = stationName.loc.map(function(item){
                    return item.stationName;
                });
    
                stationArray.forEach(function(stationValue){
                    theMultiStationWithLineKey[stationValue] = {
                        value: stationValue,
                        group: theMultiLineArray[i],
                        selected: false,
                        disabled: false,
                        description: 'From ' + theMultiLineArray[i]
                    };
                });
            } 
            //console.log(theMultiStationWithLineKey);
            res.send(theMultiStationWithLineKey);
        }else{
            theMultiStationWithLineKey['empty'] = true;
            //console.log(theMultiStationWithLineKey);
            res.send(theMultiStationWithLineKey);
        }
    },

    getMultiCategory: async(req, res, next) =>{
        const theMultiStationArray = JSON.parse(req.body.selectedStationArray);
        theMultiStationArray.unshift(null);

        if(theMultiStationArray.length === 1){
            theMultiStationArray[0] = false;
        }else{
            theMultiStationArray[0] = true;
        }
        var theMultiCategoryWithLineKey = {};

        if(theMultiStationArray.shift()){
            for(var i = 0; i < theMultiStationArray.length; i++){
                
                var categoryName = await Station.findOne({stationName: theMultiStationArray[i]});
                
    
                var categoryArray = categoryName.category.map(function(item){
                   return {
                        categoryName: item.categoryName,
                        groupName: categoryName.belongTo + ' > ' + categoryName.stationName
                    };
                });
    
                categoryArray.forEach(function(categoryValue){
                    theMultiCategoryWithLineKey[categoryValue.categoryName + '*' + theMultiStationArray[i]] = {
                        value: categoryValue.categoryName,
                        group: categoryValue.groupName,
                        selected: false,
                        disabled: false,
                        description: 'From ' + categoryValue.groupName
                    };
                });
            } 
            //console.log(theMultiCategoryWithLineKey);
            res.send(theMultiCategoryWithLineKey);
        }else{
            theMultiCategoryWithLineKey['empty'] = true;
            //console.log(theMultiCategoryWithLineKey);
            res.send(theMultiCategoryWithLineKey);
        }
    }
}