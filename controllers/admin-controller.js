var Location = require('../models/Location');
var Station = require('../models/Station');
var Drawing = require('../models/Drawing');
var moment = require('moment');
var fs = require('fs');
var path = require('path');
var os = require('os');

const osPath = os.homedir();

module.exports = {
    adminPage: async(req, res, next) => {
        const docOfLocation = await Location.find().sort({rank:1});
        const lineArray = await Location.find(null, {lineValue: 1, _id: 0}, {sort: {lineValue: 1}});
        res.render('admin', {title: 'Drawing Management System  - Administration', items: docOfLocation, lineArray:lineArray});
    },

    //已有check有無一樣line
    createLine: async(req, res, next) => {

        const dmsPath = path.join(osPath, 'DMS');
        const dmsLinePath = path.join(osPath, 'DMS', 'Line');
        //const tempPath = path.join(os.homedir(), 'DMS', 'Temp');
        var newLinePath;

        function openLineFile(lineValue){
            newLinePath = path.join(osPath, 'DMS', 'Line', lineValue);
            fs.mkdirSync(newLinePath);
        }

        try{
            var checkLine = await Location.findOne({line:req.body.InputLine});

            if(checkLine == null){

                if(fs.existsSync(dmsLinePath)){
                    //console.log('DMS Folder is already created.');
                    openLineFile(req.body.InputLine);
                }else{
                    if(fs.existsSync(dmsPath)){
                        fs.mkdirSync(dmsLinePath);
                    }else{
                        fs.mkdirSync(dmsPath);
                        fs.mkdirSync(dmsLinePath);
                    }
                    openLineFile(req.body.InputLine);
                }

                var items = {
                    line: req.body.InputLine.trim(),
                    lineValue: req.body.InputLine.trim(),
                    name: req.body.InputLineName.trim(),
                    path: newLinePath
                };

                var data = new Location(items);
                const newLine = await data.save();

                res.send('line created');
            }else{
                res.send('The line existed');
            }
            
        }catch(e){
            res.send('Error: ' + e);
        }
    },

    createLocation: async(req, res, next) => {

        var newStationPath;

        function openStationFile(selectLine, stationName){
            newStationPath = path.join(osPath, 'DMS', 'Line', selectLine, stationName);
            fs.mkdirSync(newStationPath);
        }

        try{
            var selectLine = req.body.SelectLine;
            var inputLocation = req.body.InputLocation.trim();
            var newStationData = {
                stationName: inputLocation
            }
            
            var checkStation = await Station.findOne(newStationData);

            if(checkStation == null){
                var lineObject = await Location.findOne({line:selectLine});
                //console.log(lineObject, 'you are great');

                openStationFile(selectLine, inputLocation);

                var newStationSchema = new Station(newStationData);
                newStationSchema.belongTo = selectLine;
                newStationSchema.path = newStationPath;
                var newStation = await newStationSchema.save();

                //console.log(newStation, 'new station created from', selectLine);

                var linkName = '/dms/' + selectLine + '/' + inputLocation;

                var newStation = {
                    stationName: inputLocation,
                    link: linkName
                }

                await Location.findOneAndUpdate({line:selectLine}, {"$push":{loc:newStation}});

                res.send('New station created');
            }else{
                res.send('Station existed');
            }
            //const numOfDocument = await Location.countDocuments({line:SelectLine, loc:InputLocation});
            //console.log(numOfDocument, 'ans');

        }catch(e){
            //console.log(e);
            res.send('Error: ' + e);
        }
    },

    createCategory: async(req, res, next) => {

        var newCategoryPath;

        function openCategoryFile(InputCategory){
            newCategoryPath = path.join(osPath, 'DMS', 'Line', selectLine, selectStation, InputCategory);
            fs.mkdirSync(newCategoryPath);
        }

        try{
            var selectLine = req.body.SelectLineForCategory;
            var selectStation = req.body.SelectLocationForCategory;
            var InputCategory = req.body.InputCategory.trim();


            var checkStationData = {
                belongTo:selectLine,
                stationName:selectStation
            }

            var checkStation = await Station.findOne(checkStationData);

            if(checkStation != null){

                var newCategoryDataChecking = {
                    'category.categoryName': InputCategory,
                    belongTo:selectLine,
                    stationName:selectStation
                }

                var checkCategoryInAStation = await Station.findOne(newCategoryDataChecking);

                if(checkCategoryInAStation == null){

                    openCategoryFile(InputCategory);

                    var newCategoryData = {
                        categoryName: InputCategory,
                        path: newCategoryPath
                    }

                    await Station.findOneAndUpdate({stationName:selectStation, belongTo:selectLine}, {"$push":{category:newCategoryData}});

                    var x = {
                        line: selectLine,
                        'loc.stationName': selectStation
                    }

                    var linkName = '/dms/' + selectLine + '/' + selectStation + '/' + InputCategory;
                    var y = {
                        categoryName:InputCategory,
                        link:linkName
                    }

                    await Location.findOneAndUpdate(x, {"$push":{'loc.$.category': y}});
                    res.send('Category created');
                }else{
                    res.send('Category existed');
                }
            }
            
        }catch(err){
            res.send('Error: ' + err);
        }
    },

    deleteLine: async(req, res, next) =>{
        const TrashPath = path.join(osPath, 'DMS', 'Trash');
        const lineDeletedPath = path.join(osPath, 'DMS', 'Trash', 'LineDeleted');

        if(fs.existsSync(TrashPath) === false){
            fs.mkdirSync(TrashPath);
        }

        if(fs.existsSync(lineDeletedPath) === false){
            fs.mkdirSync(lineDeletedPath);
        }
        
        const deleteLineSelect = req.body.deleteLineSelect;

        const lineObject = await Location.findOne({line: deleteLineSelect});

        if(lineObject == null){
            res.send('Line does not exist');
        }else{
            const drawingObject = await Drawing.findOne({lineName: deleteLineSelect});

            if(drawingObject != null){
                await Drawing.deleteMany({lineName: deleteLineSelect});
            }

            const stationObject = await Station.findOne({belongTo: deleteLineSelect});

            if(stationObject != null){
                await Station.deleteMany({belongTo: deleteLineSelect});
            }

            await Location.deleteOne({line: deleteLineSelect});

            var lineDeletedFileName = deleteLineSelect + '_Deleted_Date_' + moment().format('YYYYMMDD[_Time_]kkmmss');

            var oldPathForLineFile = path.join(osPath, 'DMS', 'Line', deleteLineSelect);
            var newPathForLineDeleted = path.join(osPath, 'DMS', 'Trash', 'LineDeleted', lineDeletedFileName);
            fs.renameSync(oldPathForLineFile, newPathForLineDeleted);
            res.send('Line Deleted');

        }
    },

    deleteStation: async(req, res, next) =>{
        const TrashPath = path.join(osPath, 'DMS', 'Trash');
        const StationDeletedPath = path.join(osPath, 'DMS', 'Trash', 'StationDeleted');

        if(fs.existsSync(TrashPath) === false){
            fs.mkdirSync(TrashPath);
        }

        if(fs.existsSync(StationDeletedPath) === false){
            fs.mkdirSync(StationDeletedPath);
        }

        const deleteLineSelected = req.body.deleteLineSelected;
        const deleteStationSelected = req.body.deleteStationSelected;

        const stationObject = await Station.findOne({belongTo: deleteLineSelected, stationName: deleteStationSelected});

        if(stationObject == null){
            res.send('Station does not exist');
        }else{
            const drawingObject = await Drawing.findOne({lineName: deleteLineSelected, stationName: deleteStationSelected});

            if(drawingObject != null){
                await Drawing.deleteMany({lineName: deleteLineSelected, stationName: deleteStationSelected});
            }

            await Station.deleteOne({belongTo: deleteLineSelected, stationName: deleteStationSelected});
            await Location.findOneAndUpdate({line: deleteLineSelected}, {$pull: {loc: {stationName: deleteStationSelected}}});

            var stationDeletedFileName = deleteLineSelected + '_' + deleteStationSelected + '_Deleted_Date_' + moment().format('YYYYMMDD[_Time_]kkmmss');

            var oldPathForStationFile = path.join(osPath, 'DMS', 'Line', deleteLineSelected, deleteStationSelected);
            var newPathForStationDeleted = path.join(osPath, 'DMS', 'Trash', 'StationDeleted', stationDeletedFileName);
            fs.renameSync(oldPathForStationFile, newPathForStationDeleted);
            res.send('Station Deleted');
        }
    },

    deleteCategory: async(req, res, next) =>{

        const TrashPath = path.join(osPath, 'DMS', 'Trash');
        const CategoryDeletedPath = path.join(osPath, 'DMS', 'Trash', 'CategoryDeleted');

        if(fs.existsSync(TrashPath) === false){
            fs.mkdirSync(TrashPath);
        }

        if(fs.existsSync(CategoryDeletedPath) === false){
            fs.mkdirSync(CategoryDeletedPath);
        }

        const deleteLineSelected = req.body.deleteLineSelected;
        const deleteStationSelected = req.body.deleteStationSelected;
        const deleteCategorySelected = req.body.deleteCategorySelected;

        const categoryObject = await Station.findOne({stationName: deleteStationSelected, 'category.categoryName': deleteCategorySelected}, {stationName:1, 'category.$': 1});

        if(categoryObject == null){
            res.send('Category does not exist');
        }else{
            const drawingObject = await Drawing.findOne({lineName: deleteLineSelected, stationName: deleteStationSelected, categoryName: deleteCategorySelected});

            if(drawingObject != null){
                await Drawing.deleteMany({lineName: deleteLineSelected, stationName: deleteStationSelected, categoryName: deleteCategorySelected});
            }

            await Station.findOneAndUpdate({belongTo: deleteLineSelected, stationName: deleteStationSelected}, {$pull: {category: {categoryName: deleteCategorySelected}}});

            var x = {
                line: deleteLineSelected,
                'loc.stationName': deleteStationSelected
            }

            await Location.findOneAndUpdate(x, {$pull: {'loc.$.category': {categoryName: deleteCategorySelected}}});

            var categoryDeletedFileName = deleteLineSelected + '_' + deleteStationSelected + '_' + deleteCategorySelected + '_Deleted_Date_' + moment().format('YYYYMMDD[_Time_]kkmmss');

            var oldPathForCategoryFile = path.join(osPath, 'DMS', 'Line', deleteLineSelected, deleteStationSelected, deleteCategorySelected);
            var newPathForCategoryDeleted = path.join(osPath, 'DMS', 'Trash', 'CategoryDeleted', categoryDeletedFileName);
            fs.renameSync(oldPathForCategoryFile, newPathForCategoryDeleted);
            res.send('Category Deleted');
        }

    },

    stationSelectForDeleteCategory: async(req, res, next) =>{
        var stationValue = req.body.stationSelectForDeleteCategory;

        var categoryObject = await Station.findOne({stationName: stationValue}, {category:1});

        var categoryArray = categoryObject.category.map(function(eachArrayElement){
            return eachArrayElement.categoryName;
        });

        res.send(categoryArray);
    },

    getLines: async(req, res, next) => {
        const docOfLines = await Location.find().sort({rank:1});
        res.render('admin', {items: docOfLines}) //render web page with "doc"
    },

    SelectLineForCategory: async(req, res, next) => {
        var lineValue = req.body.SelectLineForCategory;

        var stationName = await Location.findOne({line: lineValue}, {loc:1, _id:0, 'loc.stationName':1});
        //console.log(stationName,'^^^^^^^^^^^^^^^^^^^^');

        //var stationArray = stationName.loc.map(item => item.stationName);
        var stationArray = stationName.loc.map(function(item){
            return item.stationName;
        });

        stationArray.sort();

        //console.log(stationArray,'*******************');
        res.send(stationArray);
    },

    editDrawingTitle: async(req, res, next) =>{
        const drawingNumberFromUser = req.body.drawingNumber;
        const drawingVersion = req.body.drawingVersion;
        const newDrawingTitleFromUser = req.body.newDrawingTitle;

        var theDrawing = await Drawing.findOne({drawingNumber: drawingNumberFromUser, version: drawingVersion});

        if(theDrawing == null){
            var result = false
            res.send(result);
        }else{
            var theUpdatedDrawing = await Drawing.findOneAndUpdate(
                {drawingNumber: drawingNumberFromUser, version: drawingVersion},
                {inputFileName: newDrawingTitleFromUser},
                {new: true}
            );
            var result = true;
            res.send(result);
        }
    },

    selectChange: async(req, res, next) =>{
        var lineArray = await Location.find(null, {lineValue: 1, _id: 0});
        res.send(lineArray);
    },

    loadTable: async(req, res, next) =>{
        var tableData = await Location.find(null, {lineValue: 1, name: 1, loc: 1, _id: 0, 'loc.stationName': 1}, {sort: {lineValue: 1}});
        res.send(tableData);
    }
}