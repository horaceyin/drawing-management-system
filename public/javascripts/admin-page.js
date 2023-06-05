function loadTable(){
    $.ajax({
        url:'/admin/loadTable',
        method: 'GET',
        success: function(lineAndStationArray){
            var theBodyOfTable = '';
            $('#lineStationTableBody').empty();

            for(var i = 0; i < lineAndStationArray.length; i++){
                if(lineAndStationArray[i].loc.length == 0){
                    theBodyOfTable += '<tr>' + 
                                            '<td>' + lineAndStationArray[i].lineValue + '</td>' +
                                            '<td>' + lineAndStationArray[i].name + '</td>' +
                                            '<td>N/A</td>' + 
                                      '</tr>';
                }else{
                    var stationNameArray = lineAndStationArray[i].loc.map(function(stationNameItem){
                        return stationNameItem.stationName;
                    });
                    stationNameArray.sort();
    
                    theBodyOfTable += '<tr>' + 
                                            '<td>' + lineAndStationArray[i].lineValue + '</td>' +
                                            '<td>' + lineAndStationArray[i].name + '</td>' +
                                            '<td>' + stationNameArray.join(', ') + '</td>' + 
                                      '</tr>';
                }   
            }

            $('#lineStationTableBody').append(theBodyOfTable);
        }
    })
}

$(document).ready(function(){
    loadTable();
    //$('.alert').hide();
    $('#SelectLineForCategory').change(function(){
        var lineValue = $(this).val();
        $('#InputCategory').val('').attr('disabled', 'disabled');
        if(lineValue != ''){
            var defaultSelected = '<option value="">' + '--Select the station--' + '</option>';
            $('#SelectLocationForCategory').empty().prepend(defaultSelected).removeAttr('disabled');

            $.ajax({
                url:'/admin/SelectLineForCategory',
                method:'POST',
                data:{SelectLineForCategory:lineValue},
                success: function(stationArray){
                    stationArray.sort();
                    var stationOptions = '';

                    stationArray.forEach(function(stationName){
                        stationOptions += "<option value='" + stationName + "'>" + stationName + "</option>"
                    });

                    $('#SelectLocationForCategory').append(stationOptions);
                }
            });
        }else{
            var emptySelected = '<option value="">' + '----------------' + '</option>';
            $('#SelectLocationForCategory').empty().prepend(emptySelected).attr('disabled', 'disabled');
            $('#InputCategory').val('').attr('disabled', 'disabled');
        }
    });

    $('#SelectLocationForCategory').change(function(){
        var stationValue = $(this).val();

        if(stationValue != ''){
            $('#InputCategory').removeAttr('disabled');
        }else{
            $('#InputCategory').val('').attr('disabled', 'disabled');
        }
    });

    $('#SelectLine').change(function(){
        var lineValue = $(this).val();

        if(lineValue != ''){
            $('#InputLocation').removeAttr('disabled');
        }else{
            $('#InputLocation').attr('disabled', 'disabled');
        }
    });
    
    $('#lineSelectForDeleteStation').change(function(){
        var lineValue = $(this).val();

        if(lineValue != ''){
            $('#deleteLocation').removeAttr('disabled');
        }else{
            $('#deleteLocation').attr('disabled', 'disabled');
        }
    });

    $('#editButton').click(function(){
        var drawingNumber = $('#drawingNumber').val().trim();
        var drawingVersion = $('#drawingVersion').val().trim().toUpperCase();
        var newDrawingTitle = $('#newDrawingTitle').val().trim();

        if(drawingNumber != '' && newDrawingTitle != '' && drawingVersion != ''){
            $.ajax({
                url:'/admin/editDrawingTitle',
                method:'POST',
                data:{drawingNumber: drawingNumber, drawingVersion: drawingVersion, newDrawingTitle: newDrawingTitle},
                success: function(result){
                    if(result){
                        const notice = 'The title of drawing: <b>' + drawingNumber + ' with version ' + drawingVersion +  '</b> have been updated to <br><b>' + newDrawingTitle + '</b>.';
                        $('#drawingNumber, #drawingVersion, #newDrawingTitle').val('');
                        $('#editDrawingAlert').hide().attr('class', 'alert alert-success').html(notice).fadeIn();
                    }else{
                        const notice = 'No any drawing called <b>' + drawingNumber + ' with version ' + drawingVersion + '</b>.<br>Please try again.';
                        $('#editDrawingAlert').hide().attr('class', 'alert alert-danger').html(notice).fadeIn();
                    }
                }
            });
        }else if(drawingNumber == '' || drawingVersion == '' || newDrawingTitle == ''){
            const notice = 'Drawing number, version and new drawing title <b>must require</b>.';
            $('#editDrawingAlert').hide().attr('class', 'alert alert-warning').html(notice).fadeIn();
        }
    });

    $('#createLineButton').click(function(event){
        var lineAbbreviation = $('#InputLine').val().trim();
        var InputLineName = $('#InputLineName').val().trim();

        if(lineAbbreviation == '' || InputLineName == ''){
            const notice = 'Line abbreviation and line name <b>must require</b>.';
            $('#createLineAlert').hide().attr('class', 'alert alert-warning').html(notice).fadeIn();
        }else{
            var validpattern = new RegExp('^[A-Z\d()]{3,6}$');

            if(lineAbbreviation.match(validpattern)){
                $.ajax({
                    url:'/admin/createLine',
                    type: 'POST',
                    data : {InputLine: lineAbbreviation, InputLineName: InputLineName},
                    success: function(result){
                        if(result == 'line created'){

                            $.ajax({
                                url:'/admin/selectChange',
                                type:'GET',
                                success: function(lineArray){
                                    var lineValueArray = lineArray.map(function(eachItem){
                                        const eachLineValue = eachItem.lineValue;
                                        return eachLineValue;
                                    });
                                    lineValueArray.sort();
                                    var lineArrayForSelect = lineValueArray.map(function(eachItem){
                                        var option = '<option value="' + eachItem + '"> ' + eachItem + ' </option>';
                                        return option;
                                    });
                                    lineArrayForSelect.unshift('<option value="">--Select the line--</option>');
                                    $('#SelectLine, #SelectLineForCategory, #deleteLineSelect, #lineSelectForDeleteStation, #lineSelectForDeleteCategory').empty().prepend(lineArrayForSelect);
                                }
                            });
                            $('#InputLine, #InputLineName').val('');

                            const notice = '<b>' + InputLineName + '</b> was created.<br>' + 
                                           'Line abbreviation: &nbsp;<b>' + lineAbbreviation + '</b>';
                            $('#createLineAlert').hide().attr('class', 'alert alert-success').html(notice).fadeIn();
                            loadTable();
                        }else if(result == 'The line existed'){
                            const notice = '<b>' + lineAbbreviation + ': ' + InputLineName + '</b> existed. Please try again.';
                            $('#createLineAlert').hide().attr('class', 'alert alert-info').html(notice).fadeIn();
                        }else{
                            $('#createLineAlert').hide().attr('class', 'alert alert-warning').html(result).fadeIn();
                        }
                    }
                });
            }else{
                const notice = 'Line abbreviation must be in format of <b>XXX</b> or <b>XXX(X)</b>.';
                $('#createLineAlert').hide().attr('class', 'alert alert-warning').html(notice).fadeIn();
            }
        }
    });

    $('#createStationButton').click(function(){
        var lineSelected = $('#SelectLine').val();

        if(lineSelected == ''){
            const notice = 'Please select line abbreviation first.';
            $('#createStationAlert').hide().attr('class', 'alert alert-warning').html(notice).fadeIn();
        }else{
            var stationName = $('#InputLocation').val().trim();
            if(stationName == ''){
                const notice = 'Please provide station abbreviation.';
                $('#createStationAlert').hide().attr('class', 'alert alert-warning').html(notice).fadeIn();
            }else{
                var validpattern = new RegExp('^[A-Z]{1,3}$');

                if(stationName.match(validpattern)){
                    $.ajax({
                        url:'/admin/createLocation',
                        type: 'POST',
                        data: {SelectLine: lineSelected, InputLocation:stationName},
                        success: function(result){
                            if(result == 'New station created'){
                                $('#InputLocation').val('').prop('disabled', true);
                                $('#SelectLine').val('');
                                const notice = '<b>' + stationName + '</b> was created.';
                                $('#createStationAlert').hide().attr('class', 'alert alert-success').html(notice).fadeIn();
                                loadTable();
                            }else if(result == 'Station existed'){
                                const notice = '<b>' + stationName + '</b> existed. Please try again.';
                                $('#createStationAlert').hide().attr('class', 'alert alert-info').html(notice).fadeIn();
                            }else{
                                $('#createStationAlert').hide().attr('class', 'alert alert-warning').html(result).fadeIn();
                            }
                        }
                    });
                }else{
                    const notice = 'Station abbreviation must be in format of <b>XXX</b>.';
                    $('#createStationAlert').hide().attr('class', 'alert alert-warning').html(notice).fadeIn();
                }
            }
        }
    });

    $('#createCategoryButton').click(function(){
        var lineSelected = $('#SelectLineForCategory').val();

        if(lineSelected == ''){
            const notice = 'Please select line abbreviation first.';
            $('#createCategoryAlert').hide().attr('class', 'alert alert-warning').html(notice).fadeIn();
        }else{
            var stationSelected = $('#SelectLocationForCategory').val();

            if(stationSelected == ''){
                const notice = 'Please select station abbreviation.';
                $('#createCategoryAlert').hide().attr('class', 'alert alert-warning').html(notice).fadeIn();
            }else{
                var InputCategory = $('#InputCategory').val().trim();

                if(InputCategory == ''){
                    const notice = 'Category name require.';
                    $('#createCategoryAlert').hide().attr('class', 'alert alert-warning').html(notice).fadeIn();
                }else{
                    $.ajax({
                        url:'/admin/createCategory',
                        type: 'POST',
                        data: {SelectLineForCategory: lineSelected, SelectLocationForCategory: stationSelected, InputCategory: InputCategory},
                        success: function(result){
                            if(result == 'Category created'){
                                $('#InputCategory').val('').prop('disabled', true);

                                var emptySelected = '<option value="">' + '----------------' + '</option>';
                                $('#SelectLocationForCategory').empty().prepend(emptySelected).attr('disabled', 'disabled');

                                $('#SelectLineForCategory').val('');
                                const notice = '<b>' + InputCategory + '</b> was created at <b>' + stationSelected + '</b>.';
                                $('#createCategoryAlert').hide().attr('class', 'alert alert-success').html(notice).fadeIn();
                            }else if(result == 'Category existed'){
                                const notice = '<b>' + InputCategory + '</b> existed at <b>' + stationSelected + '</b>.<br>Please try again.';
                                $('#createCategoryAlert').hide().attr('class', 'alert alert-warning').html(notice).fadeIn();
                            }else{
                                $('#createCategoryAlert').hide().attr('class', 'alert alert-warning').html(result).fadeIn();
                            }
                        }
                    });
                }
            }
        }
    });

    $('#deleteLineButton').click(function(){
        const deleteLineSelect = $('#deleteLineSelect').val();

        if(deleteLineSelect == ''){
            const notice = 'Please select the line abbreviation you want to delect.';
            $('#deleteLineAlert').hide().attr('class', 'alert alert-warning').html(notice).fadeIn();
        }else{
            $.ajax({
                url:'/admin/deleteLine',
                type:'POST',
                data:{deleteLineSelect: deleteLineSelect},
                success:function(result){
                    if(result == 'Line does not exist'){
                        const notice = 'The line abbreviation you pick up does not exist.';
                        $('#deleteLineAlert').hide().attr('class', 'alert alert-warning').html(notice).fadeIn();
                    }else if(result == 'Line Deleted'){
                        const notice = '<b>' + deleteLineSelect + '</b> is deleted.<br>All corresponding files or drawings are removed.';
                        $('#deleteLineAlert').hide().attr('class', 'alert alert-success').html(notice).fadeIn();

                        $("#SelectLine option[value='" + deleteLineSelect + "']").remove();
                        $("#SelectLineForCategory option[value='" + deleteLineSelect + "']").remove();
                        $("#deleteLineSelect option[value='" + deleteLineSelect + "']").remove();
                        $("#lineSelectForDeleteStation option[value='" + deleteLineSelect + "']").remove();
                        $("#lineSelectForDeleteCategory option[value='" + deleteLineSelect + "']").remove();

                        var emptySelected = '<option value="">' + '----------------' + '</option>';
                        $('#SelectLocationForCategory').empty().prepend(emptySelected).attr('disabled', 'disabled');
                        $('#stationSelectForDeleteStation, #stationSelectForDeleteCategory, #categorySelectForDeleteCategory').empty().prepend(emptySelected).attr('disabled', 'disabled');


                        $('#deleteLineSelect, #InputLocation, #InputCategory, #SelectLineForCategory, #lineSelectForDeleteCategory').val('');
                        $('#InputLocation, #InputCategory').prop('disabled', true);
                        loadTable();
                    }
                }
            });
        }
    });

    $('#lineSelectForDeleteStation').change(function(){
        var lineValue = $(this).val();
        if(lineValue != ''){
            var defaultSelected = '<option value="">' + '--Select the station--' + '</option>';
            $('#stationSelectForDeleteStation').empty().prepend(defaultSelected).removeAttr('disabled');

            $.ajax({
                url:'/admin/SelectLineForCategory',
                method:'POST',
                data:{SelectLineForCategory:lineValue},
                success: function(stationArray){
                    stationArray.sort();
                    var stationOptions = '';

                    stationArray.forEach(function(stationName){
                        stationOptions += "<option value='" + stationName + "'>" + stationName + "</option>"
                    });

                    $('#stationSelectForDeleteStation').append(stationOptions);
                }
            });
        }else{
            var emptySelected = '<option value="">' + '----------------' + '</option>';
            $('#stationSelectForDeleteStation').empty().prepend(emptySelected).attr('disabled', 'disabled');
        }
    });

    $('#deleteStationButton').click(function(){
        var lineSelected = $('#lineSelectForDeleteStation').val();

        if(lineSelected == ''){
            const notice = 'Please select line abbreviation first.';
            $('#deleteStationAlert').hide().attr('class', 'alert alert-warning').html(notice).fadeIn();
        }else{
            var stationSelected = $('#stationSelectForDeleteStation').val();

            if(stationSelected == ''){
                const notice = 'Please select station abbreviation you want to delete.';
                $('#deleteStationAlert').hide().attr('class', 'alert alert-warning').html(notice).fadeIn();
            }else{
                $.ajax({
                    url:'/admin/deleteStation',
                    type: 'POST',
                    data: {deleteLineSelected: lineSelected, deleteStationSelected: stationSelected},
                    success:function(result){
                        if(result == 'Station does not exist'){
                            const notice = 'The station abbreviation you pick up does not exist.';
                            $('#deleteStationAlert').hide().attr('class', 'alert alert-warning').html(notice).fadeIn();
                        }else if(result == 'Station Deleted'){
                            const notice = '<b>' + stationSelected + '</b> from <b>' + lineSelected + '</b>' + ' is deleted.<br>All corresponding files or drawings are removed.';
                            $('#deleteStationAlert').hide().attr('class', 'alert alert-success').html(notice).fadeIn();

                            $("#SelectLocationForCategory option[value='" + stationSelected + "']").remove();
                            $('#SelectLocationForCategory, #InputCategory').val('');
                            $('#InputCategory').prop('disabled', true);

                            $("#stationSelectForDeleteStation option[value='" + stationSelected + "']").remove();
                            $("#stationSelectForDeleteCategory option[value='" + stationSelected + "']").remove();
                            $('#lineSelectForDeleteStation, #stationSelectForDeleteCategory').val('');
                            var emptySelected = '<option value="">' + '----------------' + '</option>';
                            $('#stationSelectForDeleteStation, #categorySelectForDeleteCategory').empty().prepend(emptySelected).attr('disabled', 'disabled');
                            loadTable();
                        }
                    }
                });
            }
        }
    });

    $('#deleteCategoryButton').click(function(){
        var lineSelected = $('#lineSelectForDeleteCategory').val();

        if(lineSelected == ''){
            const notice = 'Please select line abbreviation first.';
            $('#deleteCategoryAlert').hide().attr('class', 'alert alert-warning').html(notice).fadeIn();
        }else{
            var stationSelected = $('#stationSelectForDeleteCategory').val();

            if(stationSelected == ''){
                const notice = 'Please select station abbreviation and the category you want to delete.';
                $('#deleteCategoryAlert').hide().attr('class', 'alert alert-warning').html(notice).fadeIn();
            }else{
                var categorySelected = $('#categorySelectForDeleteCategory').val();

                if(categorySelected == ''){
                    const notice = 'Please select the category you want to delete.';
                    $('#deleteCategoryAlert').hide().attr('class', 'alert alert-warning').html(notice).fadeIn();
                }else{
                    $.ajax({
                        url: '/admin/deleteCategory',
                        type: 'POST',
                        data: {deleteLineSelected: lineSelected, deleteStationSelected: stationSelected, deleteCategorySelected: categorySelected},
                        success: function(result){
                            if(result == 'Category does not exist'){
                                const notice = 'The category you pick up does not exist';
                                $('#deleteCategoryAlert').hide().attr('class', 'alert alert-warning').html(notice).fadeIn();
                            }else if(result == 'Category Deleted'){
                                const notice = '<b>' + categorySelected + '</b> from <b>' + stationSelected + '</b>' + ' is deleted.<br>All corresponding drawings are removed.';
                                $('#deleteCategoryAlert').hide().attr('class', 'alert alert-success').html(notice).fadeIn();

                                $('#lineSelectForDeleteCategory').val('');
                                var emptySelected = '<option value="">' + '----------------' + '</option>';
                                $('#stationSelectForDeleteCategory, #categorySelectForDeleteCategory').empty().prepend(emptySelected).attr('disabled', 'disabled');
                                loadTable();

                            }
                        }
                    });
                }
            }
        }
    });

    $('#lineSelectForDeleteCategory').change(function(){
        var lineValue = $(this).val();
        if(lineValue != ''){
            var defaultSelected = '<option value="">' + '--Select the station--' + '</option>';
            $('#stationSelectForDeleteCategory').empty().prepend(defaultSelected).removeAttr('disabled');

            $.ajax({
                url:'/admin/SelectLineForCategory',
                method:'POST',
                data:{SelectLineForCategory:lineValue},
                success: function(stationArray){
                    stationArray.sort();
                    var stationOptions = '';

                    stationArray.forEach(function(stationName){
                        stationOptions += "<option value='" + stationName + "'>" + stationName + "</option>"
                    });

                    $('#stationSelectForDeleteCategory').append(stationOptions);
                    var emptySelected = '<option value="">' + '----------------' + '</option>';
                    $('#categorySelectForDeleteCategory').empty().prepend(emptySelected).attr('disabled', 'disabled');
                }
            });
        }else{
            var emptySelected = '<option value="">' + '----------------' + '</option>';
            $('#stationSelectForDeleteCategory, #categorySelectForDeleteCategory').empty().prepend(emptySelected).attr('disabled', 'disabled');
        }
    });

    $('#stationSelectForDeleteCategory').change(function(){
        var stationValue = $(this).val();
        if(stationValue != ''){
            var defaultSelected = '<option value="">' + '--Select the station--' + '</option>';
            $('#categorySelectForDeleteCategory').empty().prepend(defaultSelected).removeAttr('disabled');

            $.ajax({
                url:'/admin/stationSelectForDeleteCategory',
                method:'POST',
                data:{stationSelectForDeleteCategory:stationValue},
                success: function(categoryArray){
                    categoryArray.sort();
                    var categoryOptions = '';

                    categoryArray.forEach(function(categoryName){
                        categoryOptions += "<option value='" + categoryName + "'>" + categoryName + "</option>"
                    });

                    $('#categorySelectForDeleteCategory').append(categoryOptions);
                }
            });
        }else{
            var emptySelected = '<option value="">' + '----------------' + '</option>';
            $('#categorySelectForDeleteCategory').empty().prepend(emptySelected).attr('disabled', 'disabled');
        }
    });
})