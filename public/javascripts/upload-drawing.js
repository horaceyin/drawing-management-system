$(document).ready(function(){
    document.querySelector('#customFile_PDF').addEventListener('change',function(e){
        var fileName_PDF = document.getElementById("customFile_PDF").files[0].name;
        
        // var nextSibling = e.target.nextElementSibling;
        // nextSibling.innerText = fileName_PDF;
        document.getElementById('myFileName_PDF').innerText = fileName_PDF;
    });
      
        document.querySelector('#customFile_CAD').addEventListener('change',function(e){
        var fileName_CAD = document.getElementById("customFile_CAD").files[0].name;
      
        // var nextSibling = e.target.nextElementSibling
        // nextSibling.innerText = fileName_CAD;
        document.getElementById('myFileName_CAD').innerText = fileName_CAD;
    });

    $('#SelectLineForDrawing').change(function(){
        var emptySelected = '<option value="">' + '----------------' + '</option>';
        $('#SelectCategoryForDrawing').empty().prepend(emptySelected).attr('disabled', 'disabled');
        var lineValue = $(this).val();

        if(lineValue != ''){
            var defaultSelected = '<option value="">' + '--Select the station--' + '</option>';
            $('#SelectStationForDrawing').empty().prepend(defaultSelected).removeAttr('disabled');

            $.ajax({
                url:'/upload-drawing/SelectLineForDrawing',
                method:'POST',
                data:{SelectLineForDrawing: lineValue},
                success:function(StationArray){
                    StationArray.sort();
                    var stationOptions = '';

                    StationArray.forEach(function(stationName){
                        stationOptions += '<option value ="' + stationName + '">' + stationName + '</option>';
                    });

                    $('#SelectStationForDrawing').append(stationOptions);
                }
            });
        }else{
            $('#SelectStationForDrawing').empty().prepend(emptySelected).attr('disabled', 'disabled');
            $('#SelectCategoryForDrawing').empty().prepend(emptySelected).attr('disabled', 'disabled');

        }
    });

    $('#SelectStationForDrawing').change(function(){
        var stationValue = $(this).val();

        if(stationValue != ''){
            var defaultSelected = '<option value="">' + '--Select the category--' + '</option>';
            $('#SelectCategoryForDrawing').empty().prepend(defaultSelected).removeAttr('disabled');

            $.ajax({
                url:'/upload-drawing/SelectStationForDrawing',
                method:'POST',
                data:{SelectStationForDrawing: stationValue},
                success:function(categoryArray){
                    categoryArray.sort();
                    var categoryOptions = '';

                    categoryArray.forEach(function(categoryName){
                        categoryOptions += '<option value ="' + categoryName + '">' + categoryName + '</option>';
                    });

                    $('#SelectCategoryForDrawing').append(categoryOptions);

                }
            })
        }else{
            var emptySelected = '<option value="">' + '----------------' + '</option>';
            $('#SelectCategoryForDrawing').empty().prepend(emptySelected).attr('disabled', 'disabled');
        }
    });

    $("#datepicker").datepicker({ 
        autoclose: true, 
        todayHighlight: true
    });

    function clearAllField(){
        $('#customFile_PDF, #customFile_CAD').val(null);
        document.getElementById('myFileName_PDF').innerText = 'Choose PDF file';
        document.getElementById('myFileName_CAD').innerText = 'Choose CAD file';
        $('#inputFileName, #drawingNumber, #drawingVersion, #draftsman, #approvedDate, #SelectLineForDrawing').val('');
        var emptySelected = '<option value="">----------------</option>';
        $('#SelectStationForDrawing, #SelectCategoryForDrawing').empty().prepend(emptySelected).prop("disabled", true);
    }

    $('#uploadButton').click(function(event){
        event.preventDefault();

        const inputFileName = $('#inputFileName').val().trim();
        const drawingNumber = $('#drawingNumber').val().trim();
        const drawingVersion = $('#drawingVersion').val().trim().toUpperCase();
        const draftsman = $('#draftsman').val().trim();
        const uploadedFile_PDF = $('#customFile_PDF')[0].files[0];
        const uploadedFile_CAD = $('#customFile_CAD')[0].files[0];
        const approvedDate = $('#approvedDate').val().trim();
        const SelectLineForDrawing = $('#SelectLineForDrawing').val();
        const SelectStationForDrawing = $('#SelectStationForDrawing').val();
        const SelectCategoryForDrawing = $('#SelectCategoryForDrawing').val();

        if(inputFileName == '' || drawingNumber == '' || drawingVersion == '' || draftsman == '' || approvedDate == '' || SelectLineForDrawing == '' || SelectStationForDrawing == '' || SelectCategoryForDrawing == ''){
            const notice = 'All fields are required. Please try again.';
            $('#alertMessage').hide().attr('class', 'alert alert-warning').html(notice).fadeIn();
        }else if(moment(approvedDate, 'DD/MM/YYYY',true).isValid() == false){
            const notice = 'The approved date should be in the format of DD/MM/YYYY or a valid date.';
            $('#alertMessage').hide().attr('class', 'alert alert-warning').html(notice).fadeIn();
        }else if(uploadedFile_PDF == undefined && uploadedFile_CAD == undefined){
            const notice = 'Uploading file is required. Please try again.';
            $('#alertMessage').hide().attr('class', 'alert alert-warning').html(notice).fadeIn();
        }else{
            const formData = new FormData($('#fileUploadForm')[0]);
            //console.log(formData,'onon');

            $("#uploadButton").prop("disabled", true);
    
            $.ajax({
                url:'/upload-drawing',
                type: 'POST',
                data : formData,
                cache: false,
                processData: false,
                contentType: false,
                mimeType: 'multipart/form-data',
                success: function(result){
                    if(result == 'PDF and CAD existed'){

                        const notice = '<b>' + drawingNumber + '</b> of PDF and CAD version have already existed.<br>You cannot upload PDF and CAD files of the drawing again.';
                        $('#alertMessage').hide().attr('class', 'alert alert-info').html(notice).fadeIn();
                        $("#uploadButton").prop("disabled", false);

                    }else if(result == 'Only PDF existed'){

                        const notice = '<b>' + drawingNumber + '</b> of PDF version has already existed.<br>But you can upload a CAD file of the drawing.';
                        $('#alertMessage').hide().attr('class', 'alert alert-info').html(notice).fadeIn();
                        $("#uploadButton").prop("disabled", false);

                    }else if(result == 'Only CAD existed'){

                        const notice = '<b>' + drawingNumber + '</b> of CAD version has already existed.<br>But you can upload a PDF file of the drawing.';
                        $('#alertMessage').hide().attr('class', 'alert alert-info').html(notice).fadeIn();
                        $("#uploadButton").prop("disabled", false);

                    }else if(result == 'PDF existed but CAD uploaded'){

                        const notice = '<b>' + drawingNumber + '</b> of PDF version existed.<br>But the drawing of CAD version at<br><br>' +
                                       '&nbsp;Number:&nbsp; <b>' + drawingNumber + '</b><br>' + 
                                       '&nbsp;&nbsp;Version:&nbsp; <b>' + drawingVersion + '</b><br><br>' + 
                                       'has been uploaded.';
                        $('#alertMessage').hide().attr('class', 'alert alert-success').html(notice).fadeIn();
                        $("#uploadButton").prop("disabled", false);
                        clearAllField();

                    }else if(result == 'PDF existed and cannot upload again'){

                        const notice = '<b>' + drawingNumber + '</b> of PDF version existed.<br><b>You cannot upload again.</b>';
                        $('#alertMessage').hide().attr('class', 'alert alert-info').html(notice).fadeIn();
                        $("#uploadButton").prop("disabled", false);

                    }else if(result == 'Only CAD uploaded'){

                        const notice = 'The drawing of CAD version at<br><br>' + 
                                       '&nbsp;Number:&nbsp; <b>' + drawingNumber + '</b><br>' + 
                                       '&nbsp;&nbsp;Version:&nbsp; <b>' + drawingVersion + '</b><br><br>' +
                                       'has been uploaded now.';
                        $('#alertMessage').hide().attr('class', 'alert alert-success').html(notice).fadeIn();
                        $("#uploadButton").prop("disabled", false);
                        clearAllField();

                    }else if(result == 'CAD existed but PDF uploaded'){

                        const notice = '<b>' + drawingNumber + '</b> of CAD version existed.<br>But the drawing of PDF version at<br><br>' +
                                       '&nbsp;Number:&nbsp; <b>' + drawingNumber + '</b><br>' + 
                                       '&nbsp;&nbsp;Version:&nbsp; <b>' + drawingVersion + '</b><br><br>' + 
                                       'has been uploaded.';
                        $('#alertMessage').hide().attr('class', 'alert alert-success').html(notice).fadeIn();
                        $("#uploadButton").prop("disabled", false);
                        clearAllField();

                    }else if(result == 'Only PDF uploaded'){

                        const notice = 'The drawing of PDF version at<br><br>' + 
                                       '&nbsp;Number:&nbsp; <b>' + drawingNumber + '</b><br>' + 
                                       '&nbsp;&nbsp;Version:&nbsp; <b>' + drawingVersion + '</b><br><br>' +
                                       'has been uploaded now.';
                        $('#alertMessage').hide().attr('class', 'alert alert-success').html(notice).fadeIn();
                        $("#uploadButton").prop("disabled", false);
                        clearAllField();

                    }else if(result == 'CAD existed and cannot upload again'){

                        const notice = '<b>' + drawingNumber + '</b> of CAD version existed.<br><b>You cannot upload again.</b>';
                        $('#alertMessage').hide().attr('class', 'alert alert-info').html(notice).fadeIn();
                        $("#uploadButton").prop("disabled", false);

                    }else if(result == 'Add two new PDF and CAD'){

                        const notice = 'The new drawing of PDF and CAD version at<br><br>' + 
                                       '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Title:&nbsp; <b>' + inputFileName + '</b><br>' +
                                       '&nbsp;Number:&nbsp; <b>' + drawingNumber + '</b><br>' + 
                                       '&nbsp;&nbsp;Version:&nbsp; <b>' + drawingVersion + '</b><br><br>' +
                                       'has been uplaoded.';
                        
                        $('#alertMessage').hide().attr('class', 'alert alert-success').html(notice).fadeIn();
                        $("#uploadButton").prop("disabled", false);
                        clearAllField();

                    }else if(result == 'Add a new PDF'){

                        const notice = 'The new drawing of PDF version at<br><br>' + 
                                       '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Title:&nbsp; <b>' + inputFileName + '</b><br>' +
                                       '&nbsp;Number:&nbsp; <b>' + drawingNumber + '</b><br>' + 
                                       '&nbsp;&nbsp;Version:&nbsp; <b>' + drawingVersion + '</b><br><br>' +
                                       'has been uplaoded.';
                        
                        $('#alertMessage').hide().attr('class', 'alert alert-success').html(notice).fadeIn();
                        $("#uploadButton").prop("disabled", false);
                        clearAllField();

                    }else if(result == 'Add a new CAD'){
                        const notice = 'The new drawing of CAD version at<br><br>' + 
                                       '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Title:&nbsp; <b>' + inputFileName + '</b><br>' +
                                       '&nbsp;Number:&nbsp; <b>' + drawingNumber + '</b><br>' + 
                                       '&nbsp;&nbsp;Version:&nbsp; <b>' + drawingVersion + '</b><br><br>' +
                                       'has been uplaoded.';
                        
                        $('#alertMessage').hide().attr('class', 'alert alert-success').html(notice).fadeIn();
                        $("#uploadButton").prop("disabled", false);
                        clearAllField();
                    }
                }
            });
        }

    }); 
});