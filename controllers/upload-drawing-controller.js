var Station = require('../models/Station');
var Drawing = require('../models/Drawing');
var Location = require('../models/Location');
var path = require('path');
var fs = require('fs');
var multer = require('multer');
var os = require('os');
var moment = require('moment');

const osPath = os.homedir();

module.exports = {
    uploadDrawingPage: async(req, res, next) =>{
        const docOfLocation = await Location.find(null, {lineValue:1, _id:0}, {sort: {lineValue:1}});
        res.render('upload-drawing',{
            title: 'Drawing Management System  - Administration',
            locationItems: docOfLocation
        });
    },


    uploadDrawing: async(req, res, next) => {
        //console.log(req, 'I am req@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');

        var isPDF = false;
        var isCAD = false;
        var numberOfDocument = 0;

        function checkTheNumberOfFileSend(files){
            var numOfFile = Object.keys(files).length;

            if(numOfFile == 2){
                numberOfDocument = 2; 
            }else if(numOfFile == 1){
                numberOfDocument = 1;
            }

            //console.log(Object.keys(files).length);
        }


        function getFileExtension(files){

            if(numberOfDocument == 2){
                isPDF = true;
                isCAD = true;
            }else if(numberOfDocument == 1 && Object.keys(files).toString() == 'uploadedFile_PDF'){
                isPDF = true;
            }else if(numberOfDocument == 1 && Object.keys(files).toString() == 'uploadedFile_CAD'){
                isCAD = true;
            }
        }


       function checkAnyIdenticalFileInDBAndAdding(){
            try{
                getFileExtension(req.files);
                var pdfStatus = isPDF;
                var cadStatus = isCAD;
                var inputFileNameFromUser = req.body.inputFileName.trim();
                var drawingNumberFromUser = req.body.drawingNumber.trim();
                var drawingVersionFromUser = req.body.drawingVersion.toUpperCase().trim();
                var selectLine = req.body.SelectLineForDrawing;
                var selectStation = req.body.SelectStationForDrawing;
                var selectCategory = req.body.SelectCategoryForDrawing;
                var approvedDate = req.body.approvedDate.trim();
    
                var checkDrawingData = {
                    //inputFileName: inputFileNameFromUser,
                    drawingNumber: drawingNumberFromUser,
                    version: drawingVersionFromUser,
                    lineName:selectLine,
                    stationName:selectStation,
                    categoryName:selectCategory
                }

                Drawing.findOne(checkDrawingData, (err, checkDrawing)=> {
                    if(err){
                        res.send(err);
                    }else{

                        if(checkDrawing == null){

                            function addData(){
                                var newDrawingData = {
                                    inputFileName: inputFileNameFromUser,
                                    PDF_FileNameInNAS:PDF_FileName,
                                    CAD_FileNameInNAS:CAD_FileName,
                                    drawingNumber: drawingNumberFromUser,
                                    version: drawingVersionFromUser,
                                    draftsman: req.body.draftsman.trim(),
                                    isPDF: pdfStatus,
                                    isCAD: cadStatus,
                                    lineName:selectLine,
                                    stationName:selectStation,
                                    categoryName:selectCategory,
                                    pathForPDF: thePathForPDF,
                                    pathForCAD: thePathForCAD,
                                    createdDate: createdDate,
                                    lastUpdated: createdDate,
                                    longDate: longDate,
                                    approvedDate : approvedDate
                                }
            
                                var newDrawingSchema = new Drawing(newDrawingData);
                                newDrawingSchema.save();
                            }

                            var thePathForPDF = 'N/A';
                            var thePathForCAD = 'N/A';
                            var PDF_FileName = 'N/A';
                            var CAD_FileName = 'N/A';
                            //var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                            var date = new Date();
                            var createdDate = date.toString();
                            var longDate = moment().format('DD[/]MM[/]YYYY');
                            //var longDate = date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();

                            if(numberOfDocument == 2){
                                var fileInTemp_PDF = path.join(osPath, 'DMS', 'Line', req.files['uploadedFile_PDF'][0].filename);
                                var fileInTemp_CAD = path.join(osPath, 'DMS', 'Line', req.files['uploadedFile_CAD'][0].filename);
                                var destFilePath_PDF = path.join(osPath, 'DMS', 'Line', selectLine, selectStation, selectCategory, req.files['uploadedFile_PDF'][0].filename);
                                var destFilePath_CAD = path.join(osPath, 'DMS', 'Line', selectLine, selectStation, selectCategory, req.files['uploadedFile_CAD'][0].filename);
                                fs.renameSync(fileInTemp_PDF, destFilePath_PDF);
                                fs.renameSync(fileInTemp_CAD, destFilePath_CAD);

                                if(os.type() === 'Windows_NT'){
                                    thePathForPDF = destFilePath_PDF;
                                    thePathForCAD = destFilePath_CAD;
                                }else{
                                    thePathForPDF = destFilePath_PDF.substring(1);
                                    thePathForCAD = destFilePath_CAD.substring(1);
                                }
                                
                                PDF_FileName = path.basename(destFilePath_PDF, path.extname(req.files['uploadedFile_PDF'][0].originalname));
                                CAD_FileName = path.basename(destFilePath_CAD, path.extname(req.files['uploadedFile_CAD'][0].originalname));

                                addData();
                                res.send('Add two new PDF and CAD');
                            }else if(numberOfDocument == 1){
                                if(pdfStatus){
                                    var fileInTemp_PDF = path.join(osPath, 'DMS', 'Line', req.files['uploadedFile_PDF'][0].filename);
                                    var destFilePath_PDF = path.join(osPath, 'DMS', 'Line', selectLine, selectStation, selectCategory, req.files['uploadedFile_PDF'][0].filename);
                                    fs.renameSync(fileInTemp_PDF, destFilePath_PDF);

                                    if(os.type() === 'Windows_NT'){
                                        thePathForPDF = destFilePath_PDF;
                                    }else{
                                        thePathForPDF = destFilePath_PDF.substring(1);
                                    }
                                    PDF_FileName = path.basename(destFilePath_PDF, path.extname(req.files['uploadedFile_PDF'][0].originalname));
                                    addData();
                                    res.send('Add a new PDF');
                                }else{
                                    var fileInTemp_CAD = path.join(osPath, 'DMS', 'Line', req.files['uploadedFile_CAD'][0].filename);
                                    var destFilePath_CAD = path.join(osPath, 'DMS', 'Line', selectLine, selectStation, selectCategory, req.files['uploadedFile_CAD'][0].filename);
                                    fs.renameSync(fileInTemp_CAD, destFilePath_CAD);

                                    if(os.type() === 'Windows_NT'){
                                        thePathForCAD = destFilePath_CAD;
                                    }else{
                                        thePathForCAD = destFilePath_CAD.substring(1);
                                    }
                                    
                                    CAD_FileName = path.basename(destFilePath_CAD, path.extname(req.files['uploadedFile_CAD'][0].originalname));
                                    addData();
                                    res.send('Add a new CAD');
                                }
                            }
                        }else{

                            if(checkDrawing.isPDF == true && checkDrawing.isCAD == true){
                                if(numberOfDocument == 2){
                                    var fileInTemp_PDF = path.join(osPath, 'DMS', 'Line', req.files['uploadedFile_PDF'][0].filename);
                                    var fileInTemp_CAD = path.join(osPath, 'DMS', 'Line', req.files['uploadedFile_CAD'][0].filename);
                                    fs.unlinkSync(fileInTemp_PDF);
                                    fs.unlinkSync(fileInTemp_CAD);
                                    //var notice = 'The PDF and CAD version of ' + drawingNumberFromUser + ' have already existed. You cannot upload PDF and CAD files again for this drawing.';
                                    res.send('PDF and CAD existed');
                                }else if(numberOfDocument == 1){
                                    if(pdfStatus){
                                        var fileInTemp_PDF = path.join(osPath, 'DMS', 'Line', req.files['uploadedFile_PDF'][0].filename);
                                        fs.unlinkSync(fileInTemp_PDF);
                                        //var notice = 'The PDF version of ' + drawingNumberFromUser + ' have already existed.';
                                        //console.log(notice);
                                        res.send('Only PDF existed');
                                    }else{
                                        var fileInTemp_CAD = path.join(osPath, 'DMS', 'Line', req.files['uploadedFile_CAD'][0].filename);
                                        fs.unlinkSync(fileInTemp_CAD);
                                        //var notice = 'The CAD version of ' + drawingNumberFromUser + ' have already existed.';
                                        //console.log(notice);
                                        res.send('Only CAD existed');
                                    }
                                }
                            }else if(checkDrawing.isPDF == true && checkDrawing.isCAD == false){
                                function addCAD(){
                                    var theDrawing = {
                                        drawingNumber: drawingNumberFromUser,
                                        version: drawingVersionFromUser,
                                        isPDF: true,
                                        isCAD: false,
                                        lineName:selectLine,
                                        stationName:selectStation,
                                        categoryName:selectCategory
                                    };

                                    var fileInTemp_CAD = path.join(osPath, 'DMS', 'Line', req.files['uploadedFile_CAD'][0].filename);
                                    var destFilePath_CAD = path.join(osPath, 'DMS', 'Line', selectLine, selectStation, selectCategory, req.files['uploadedFile_CAD'][0].filename);
                                    var thePathForCAD = '';
                                    if(os.type() === 'Windows_NT'){
                                        thePathForCAD = destFilePath_CAD;
                                    }else{
                                        thePathForCAD = destFilePath_CAD.substring(1);
                                    }
                                    //var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                                    var date = new Date();
                                    var lastUpdated = date.toString();
                                    var longDate = moment().format('DD[/]MM[/]YYYY');
                                    //var longDate = date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();

                                    var theUpdatedDate = {
                                        isCAD: true,
                                        CAD_FileNameInNAS:path.basename(destFilePath_CAD, path.extname(req.files['uploadedFile_CAD'][0].originalname)),
                                        pathForCAD: thePathForCAD,
                                        lastUpdated: lastUpdated,
                                        longDate: longDate
                                    };


                                    Drawing.findOneAndUpdate(theDrawing, theUpdatedDate, (err)=> {
                                        fs.renameSync(fileInTemp_CAD, destFilePath_CAD);
                                        //console.log('Data has been updated.');  
                                    });
                                }
                                
                                if(numberOfDocument == 2){
                                    //var notice = 'PDF version of ' + drawingNumberFromUser + ' existed. But CAD version have been upload.';
                                    //console.log(notice);

                                    var fileInTemp_PDF = path.join(osPath, 'DMS', 'Line', req.files['uploadedFile_PDF'][0].filename);
                                    fs.unlinkSync(fileInTemp_PDF);
                                    addCAD();
                                    res.send('PDF existed but CAD uploaded');
                                }else if(numberOfDocument == 1){
                                    if(pdfStatus){
                                        var fileInTemp_PDF = path.join(osPath, 'DMS', 'Line', req.files['uploadedFile_PDF'][0].filename);
                                        fs.unlinkSync(fileInTemp_PDF);
                                        //var notice = 'The PDF version of ' + drawingNumberFromUser + ' existed. You cannot upload again.' 
                                        //console.log(notice);
                                        res.send('PDF existed and cannot upload again');
                                    }else{
                                        addCAD();
                                        //var notice = 'The CAD version of ' + drawingNumberFromUser + ' has been uploaded now.' 
                                        //console.log(notice);
                                        res.send('Only CAD uploaded');
                                    }
                                }
                            }else if(checkDrawing.isPDF == false && checkDrawing.isCAD == true){

                                function addPDF(){
                                    var theDrawing = {
                                        drawingNumber: drawingNumberFromUser,
                                        version: drawingVersionFromUser,
                                        isPDF: false,
                                        isCAD: true,
                                        lineName:selectLine,
                                        stationName:selectStation,
                                        categoryName:selectCategory
                                    };

                                    var fileInTemp_PDF = path.join(osPath, 'DMS', 'Line', req.files['uploadedFile_PDF'][0].filename);
                                    var destFilePath_PDF = path.join(osPath, 'DMS', 'Line', selectLine, selectStation, selectCategory, req.files['uploadedFile_PDF'][0].filename);
                                    var thePathForPDF = '';
                                    if(os.type() === 'Windows_NT'){
                                        thePathForPDF = destFilePath_PDF;
                                    }else{
                                        thePathForPDF = destFilePath_PDF.substring(1);
                                    }
                                    //var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                                    var date = new Date();
                                    var lastUpdated = date.toString();
                                    var longDate = moment().format('DD[/]MM[/]YYYY');
                                    //var longDate = date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();

                                    var theUpdatedDate = {
                                        isPDF: true,
                                        PDF_FileNameInNAS:path.basename(destFilePath_PDF, path.extname(req.files['uploadedFile_PDF'][0].originalname)),
                                        pathForPDF: thePathForPDF,
                                        lastUpdated: lastUpdated,
                                        longDate: longDate
                                    };


                                    Drawing.findOneAndUpdate(theDrawing, theUpdatedDate, (err)=> {
                                        fs.renameSync(fileInTemp_PDF, destFilePath_PDF);
                                        //console.log('Data has been updated.');  
                                    });
                                }

                                if(numberOfDocument == 2){
                                    //var notice = 'There is already a CAD version of ' + drawingNumberFromUser + '. But PDF version have been upload.';
                                    //console.log(notice);

                                    var fileInTemp_CAD = path.join(osPath, 'DMS', 'Line', req.files['uploadedFile_CAD'][0].filename);
                                    fs.unlinkSync(fileInTemp_CAD);

                                    addPDF();
                                    res.send('CAD existed but PDF uploaded');
                                }else if(numberOfDocument == 1){
                                    if(pdfStatus){
                                        addPDF();
                                        res.send('Only PDF uploaded');
                                    }else{
                                        var fileInTemp_CAD = path.join(osPath, 'DMS', 'Line', req.files['uploadedFile_CAD'][0].filename);
                                        fs.unlinkSync(fileInTemp_CAD);
                                        //var notice = 'The CAD version of ' + drawingNumberFromUser + ' has already been uploaded. You cannot upload again.' 
                                        //console.log(notice);
                                        res.send('CAD existed and cannot upload again')
                                    }
                                }
                            }
                        }
                    }
                });

            }catch(e){
                res.send(e);
            }  
        }
        

        //const dest = path.join(os.homedir(), 'DMS', selectLine, selectStation, selectCategory);
        const dest = path.join(osPath, 'DMS', 'Line');

        const storage = multer.diskStorage({
            destination:dest,
            filename: (req, file, cb)=>{
                cb(null, file.originalname.replace(path.extname(file.originalname), '') + '_version_' + req.body.drawingVersion.toUpperCase().trim() + '_' + Date.now() + path.extname(file.originalname).toLowerCase());
                //cb(null, req.body.inputFileName.trim() + '_version_' + req.body.drawingVersion.toUpperCase().trim() + '_' + Date.now() + path.extname(file.originalname).toLowerCase());
            }
        });

        function checkFileType(file, cb){
            if(file.fieldname == 'uploadedFile_PDF'){
                const filetypes = /pdf/;

                const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
                const mimetype = filetypes.test(file.mimetype);

                if(extname && mimetype){
                    return cb(null, true);
                }else{
                    cb('The type of file(s) is/are not supported.', false);
                }
            }else{
                const filetypes = /dgn|dwg|octet-stream/;

                const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
                const mimetype = filetypes.test(file.mimetype);

                if(extname && mimetype){
                    return cb(null, true);
                }else{
                    cb('The type of file(s) is/are not supported.', false);
                }
            }
        }

        const opts = {
            storage: storage,
            fileFilter: function (req, file, cb){
                checkFileType(file, cb);
            }
        };

        //const upload = multer(opts).single('uploadedFile_PDF');
        const upload = multer(opts).fields([{name: 'uploadedFile_PDF', maxCount: 1}, {name: 'uploadedFile_CAD', maxCount: 1}]);
        upload(req, res, (err)=> {
            if(err){
                res.send(err);
                //console.log(err);
            }else{ 
                checkTheNumberOfFileSend(req.files);

                if(numberOfDocument != 0){
                    checkAnyIdenticalFileInDBAndAdding();
                    //res.redirect('dms');
                }else{
                    res.send('You did not select any file.');
                }
            }
            
        });
    },

    SelectLineForDrawing: async(req, res, next) =>{
        var lineValue = req.body.SelectLineForDrawing;

        var stationName = await Location.findOne({line: lineValue}, {loc:1});

        //var stationArray = stationName.loc.map(item => item.stationName);
        var stationArray = stationName.loc.map(function(eachArrayElement){
            return eachArrayElement.stationName;
        });
        res.send(stationArray);
    },

    SelectStationForDrawing: async(req, res, next) =>{
        var stationValue = req.body.SelectStationForDrawing;

        var categoryObject = await Station.findOne({stationName: stationValue}, {category:1});

        var categoryArray = categoryObject.category.map(function(eachArrayElement){
            return eachArrayElement.categoryName;
        });

        res.send(categoryArray);
    }
}