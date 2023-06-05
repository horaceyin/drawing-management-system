function showDrawingOnTable(drawingArray, getType){
    var theBodyOfTable = '';
        $('#drawingTable').DataTable().destroy();
        $('#drawingTableBody').empty();
        $('#drawingTable tfoot th').empty();
        //$('#drawingTable').hide();
        $('#haha').val('').hide();

        if(getType == 'menu'){
            drawingArray.forEach(function(drawingItem){
                theBodyOfTable += '<tr>' +
                                        '<td scope="row">' + drawingItem.inputFileName + '</td>' +
                                        '<td scope="row">' + drawingItem.drawingNumber + '</td>' +
                                        '<td scope="row">' + drawingItem.version + '</td>' +
                                        '<td scope="row">' + drawingItem.draftsman + '</td>' +
                                        '<td scope="row">' + drawingItem.approvedDate + '</td>' +
                                        '<td scope="row">' + drawingItem.longDate + '</td>' +
                                        '<td scope="row">' + drawingItem.lineName + ' > ' + drawingItem.stationName + '</td>' +
                                        // '<td scope="row">' + 'Test-6' + '</td>' + 
                                        '<td>';
                
                if(drawingItem.isPDF){
                    theBodyOfTable += '<a href="/dms/download/' + drawingItem.pathForPDF + '" style="color: Dodgerblue;"><i class="far fa-file-pdf"></i></a>';
                }else{
                    theBodyOfTable += '&nbsp;&nbsp;&nbsp;';
                }
    
                theBodyOfTable += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
                
                if(drawingItem.isCAD){
                    theBodyOfTable += '<a href="/dms/download/' + drawingItem.pathForCAD + '" style="color: Dodgerblue;"><i class="fas fa-drafting-compass"></i></a>';
                }
                theBodyOfTable += '</td></tr>';
            });
        }else if(getType == 'inputText'){
            drawingArray.forEach(function(drawingItem){
                theBodyOfTable += '<tr>' +
                                        '<td scope="row">' + drawingItem.inputFileName + '</td>' +
                                        '<td scope="row">' + drawingItem.drawingNumber + '</td>' +
                                        '<td scope="row">' + drawingItem.version + '</td>' +
                                        '<td scope="row">' + drawingItem.draftsman + '</td>' +
                                        '<td scope="row">' + drawingItem.approvedDate + '</td>' +
                                        '<td scope="row">' + drawingItem.longDate + '</td>' +
                                        '<td scope="row">' + drawingItem.lineName + ' > ' + drawingItem.stationName + ' > ' + drawingItem.categoryName + '</td>' +
                                        // '<td scope="row">' + 'Test-6' + '</td>' + 
                                        '<td>';
                
                if(drawingItem.isPDF){
                    theBodyOfTable += '<a href="/dms/download/' + drawingItem.pathForPDF + '" style="color: Dodgerblue;"><i class="far fa-file-pdf"></i></a>';
                }else{
                    theBodyOfTable += '&nbsp;&nbsp;&nbsp;';
                }
    
                theBodyOfTable += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
                
                if(drawingItem.isCAD){
                    theBodyOfTable += '<a href="/dms/download/' + drawingItem.pathForCAD + '" style="color: Dodgerblue;"><i class="fas fa-drafting-compass"></i></a>';
                }
                theBodyOfTable += '</td></tr>';
            });
        }else if(getType == 'multi'){
            //console.log(drawingArray, 'ddddddddd');
            for(let key in drawingArray){
                drawingArray[key].forEach(function(drawingItem){
                    theBodyOfTable += '<tr>' +
                                        '<td scope="row">' + drawingItem.inputFileName + '</td>' +
                                        '<td scope="row">' + drawingItem.drawingNumber + '</td>' +
                                        '<td scope="row">' + drawingItem.version + '</td>' +
                                        '<td scope="row">' + drawingItem.draftsman + '</td>' +
                                        '<td scope="row">' + drawingItem.approvedDate + '</td>' +
                                        '<td scope="row">' + drawingItem.longDate + '</td>' +
                                        // '<td scope="row">' + 'Test-6' + '</td>' + 
                                        '<td scope="row">' + key + '</td>' +
                                        '<td>';
                
                    if(drawingItem.isPDF){
                        theBodyOfTable += '<a href="/dms/download/' + drawingItem.pathForPDF + '" style="color: Dodgerblue;"><i class="far fa-file-pdf"></i></a>';
                    }else{
                        theBodyOfTable += '&nbsp;&nbsp;&nbsp;';
                    }
        
                    theBodyOfTable += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
                    
                    if(drawingItem.isCAD){
                        theBodyOfTable += '<a href="/dms/download/' + drawingItem.pathForCAD + '" style="color: Dodgerblue;"><i class="fas fa-drafting-compass"></i></a>';
                    }
                    theBodyOfTable += '</td></tr>';
                });
            }
        }

        $('#drawingTableBody').append(theBodyOfTable);
        var table = $('#drawingTable').DataTable({
            "pagingType": "full_numbers",
            orderFixed: [[6, 'asc'], [1, 'asc'], [2, 'asc'], [0, 'asc']],
            columnDefs: [
                {targets: [0, 1, 2, 3, 4, 5, 6, 7], orderable: false}
            ],
            "lengthMenu": [ [10, 25, 50, 100, -1], [10, 25, 50, 100, "All"] ],
            dom: 'Blfrtip',
            buttons: [
                {
                    extend: 'excelHtml5',
                    text: 'Export to Excel',
                    title: 'Drawing Management System',
                    download: 'open',
                    orientation:'landscape',
                    exportOptions: {
                      columns: [0, 1, 2, 3, 4, 5]
                    }
                },
                'selectAll',
                'selectNone'
            ],
            select: {
                style: 'os'
            },
            rowGroup: {
                dataSrc: 6
            }
        });

        var tableFootThName = ['drawing title', 'drawing number', 'version', 'draftsman', 'approved date', 'date modified', 'group'];
        $('#drawingTable tfoot th').not(document.getElementById("tableDownload")).each(function(index){
            var title = tableFootThName[index];
            $(this).html('<input type="text" class="form-control form-rounded" placeholder="Search ' + title + '" id="input' + title + '"/>');
        });

        table.columns().every(function(){
            var that = this;
            $('input', this.footer()).on('keyup change', function(){
                if(that.search() !== this.value){
                    //console.log(that.search(),'xxxxxxxx');
                    that.search(this.value).draw();
                    //console.log(this.value,'vvvvvvvvvvvvv');
                }
            });
        });

        var tableFootInputID = ['inputdrawing title', 'inputdrawing number', 'inputversion', 'inputdraftsman', 'inputapproved date', 'inputdate modified', 'inputgroup'];

        for(var i = 0; i < tableFootInputID.length; i++){
            document.getElementById(tableFootInputID[i]).onfocus = function() {
                this.style.color = '#343148FF';
                this.style.backgroundColor = '#D7C49EFF';
            };
        
            document.getElementById(tableFootInputID[i]).onfocusout = function() {
                this.style.backgroundColor = '#b3d6c2';
            };
        }
        $('#drawingTable_filter').detach();
        $(".dt-buttons").detach();
        $('#drawingTable').show();
        $('#haha').show();
        $('#createExcelButton').show().on('click', function(){
            table.button('.buttons-excel').trigger();
        });
        $('#selectAll').show().on('click', function(){
            table.button('.buttons-select-all').trigger();
        });

        $('#deselectAll').show().on('click', function(){
            table.button('.buttons-select-none').trigger();
        });
};

$(document).ready(function(){
    $("#sidebar").mCustomScrollbar({
        theme: "minimal"
    });

    $('#dismiss, .overlay').on('click', function () {
        $('#sidebar').removeClass('active');
        $('.overlay').removeClass('active');
        $('a[aria-expanded=true]').attr({'aria-expanded':'false', 'class':'collapsed'});
        $('.list-unstyled.collapse.show').removeClass('show');
    });

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').addClass('active');
        $('.overlay').addClass('active');
        $('.collapse.in').toggleClass('in');
        // $('a[aria-expanded=true]').attr({'aria-expanded':'false', 'class':'collapsed'});
        // $('.list-unstyled.collapse.show').removeClass('show');
    });

    
    $('#sidebar ul ul li').on('click', function(){
        var theStation = $(this).attr('id');
        var theLine = $(this).parents('ul').attr('id');

        $.ajax({
            url: '/dms/getDrawingByLineAndStation',
            method: 'POST',
            data: {
                station: theStation,
                line: theLine
            },
            success: function(drawingArray){
                if(drawingArray.shift()){
                    showDrawingOnTable(drawingArray, 'menu');
                    $('a[aria-expanded=true]').attr({'aria-expanded':'false', 'class':'collapsed'});
                    $('.list-unstyled.collapse.show').removeClass('show');
                    document.getElementById("customCheck").checked = false;
                    $('.tail-none').click();
                }else{
                    alert('No any drawings at ' + theStation);
                    $('#searchDrawing').val('');
                    $('#drawingTable').DataTable().destroy();
                    $('#drawingTable').hide();
                    $('#haha').val('').hide();
                    $('#createExcelButton').hide();
                    $('#selectAll').hide();
                    $('#deselectAll').hide();
                    $('a[aria-expanded=true]').attr({'aria-expanded':'false', 'class':'collapsed'});
                    $('.list-unstyled.collapse.show').removeClass('show');
                    $('.tail-none').click();
                    document.getElementById("customCheck").checked = false;
                }
            }
        });

        $('#sidebar').removeClass('active');
        $('.overlay').removeClass('active');
    });

    var DmsLineSelect = tail.select('#DmsLineSelect', {
        search: true,
        placeholder: "Select Line",
        multiSelectAll: true,
        searchMinLength: 0,
        sortItems: 'ASC',
        multiContainer: '.line-move-container',

    });

    var DmsStationSelect = tail.select('#DmsStationSelect', {
        search: true,
        placeholder: "Select Station",
        multiSelectAll: true,
        multiSelectGroup : true,
        searchMinLength: 0,
        sortItems: 'ASC',
        multiContainer: '.station-move-container',

    });

    var DmsCategorySelect = tail.select('#DmsCategorySelect', {
        search: true,
        placeholder: "Select Category",
        multiSelectAll: true,
        multiSelectGroup : true,
        searchMinLength: 0,
        sortItems: 'ASC',
        multiContainer: '.category-move-container',

    });

    $('#searchButton').click(function(){
        var searchingKeyWord = $('#searchDrawing').val();
        console.log(searchingKeyWord,'fff');

        if(searchingKeyWord != ''){
            $.ajax({
                url: "/dms/getDrawingByAjax",
                method: "POST",
                data: {searchDrawingName: searchingKeyWord},
                success: function(drawingArray){
                    if(drawingArray.shift()){
                        if(document.getElementById("customCheck").checked == false){
                            showDrawingOnTable(drawingArray, 'inputText');
                            $('.tail-none').click();
                        }else{
                            drawingArray.sort((a, b) => {
                                if(a.drawingNumber < b.drawingNumber){
                                    return 1;
                                }else{
                                    return -1;
                                }
                            });

                            drawingArray.push('null');
                            var temp = drawingArray[0].drawingNumber;
                            var numberOfSameName = 0;
                            var drawingNameWithNumber = [];
                            var theLatestVersionDrawing = [];

                            for(var i = 0; i < drawingArray.length; i++){
                                if(drawingArray[i].drawingNumber == temp){
                                    numberOfSameName++;
                                }else{
                                    drawingNameWithNumber.push(numberOfSameName);
                                    temp = drawingArray[i].drawingNumber
                                    numberOfSameName = 1;
                                    //console.log(drawingNameWithNumber, drawingArray[i - 1].drawingNumber);
                                }
                            }

                            for(var i = 0; i < drawingNameWithNumber.length; i++){
                                var sortingArray = [];
                                for(var j = 0; j < drawingNameWithNumber[i]; j++){
                                    sortingArray.push(drawingArray.shift())
                                }

                                sortingArray.sort((a, b) => {
                                    if(a.version < b.version){
                                        return 1;
                                    }else{
                                        return -1;
                                    }
                                });

                                theLatestVersionDrawing.push(sortingArray[0]);
                            }
                            showDrawingOnTable(theLatestVersionDrawing, 'inputText');
                            $('.tail-none').click();

                            //console.log(drawingArray, 'xxxxxxxxx');
                            //console.log(theLatestVersionDrawing, 'theLatestVersionDrawing');
                        }
                    }else{
                        alert('No any drawings named like ' + searchingKeyWord);
                        $('#drawingTable').DataTable().destroy();
                        $('#drawingTable').hide();
                        $('#haha').val('').hide();
                        document.getElementById("customCheck").checked = false;
                        $('#searchDrawing').val('');
                        $('.tail-none').click();
                        $('#createExcelButton').hide();
                    }
                }
            });
        }else{
            if(DmsLineSelect.options.selected.length == 0){
                // if(document.getElementById("customCheck").checked == true){
                //     console.log('true@@');
                // }else{
                //     console.log('false@@');
                // }


                alert('Please select line from the left dropdown list or Search key word on the top.');
            }else{
                var queryArray = [];

                if(DmsLineSelect.options.selected.length !=0 && DmsStationSelect.options.selected.length == 0 && DmsCategorySelect.options.selected.length == 0){
                    for(var i = 0; i < DmsLineSelect.options.selected.length; i++){
                        queryArray.push(DmsLineSelect.options.selected[i].value);
                    }

                    //console.log(queryArray);

                }else if(DmsLineSelect.options.selected.length !=0 && DmsStationSelect.options.selected.length != 0 && DmsCategorySelect.options.selected.length == 0){
                    var selectedStationArray = [];
                    var lineDelete = [];

                    for(var i = 0; i < DmsLineSelect.options.selected.length; i++){
                        queryArray.push(DmsLineSelect.options.selected[i].value);
                    }

                    for(var i = 0; i < DmsStationSelect.options.selected.length; i++){
                        selectedStationArray.push(DmsStationSelect.options.selected[i].parentNode.label + '?' + DmsStationSelect.options.selected[i].value);
                    }

                    for(var i = 0; i < selectedStationArray.length; i++){
                        var lineAndStation = selectedStationArray[i].split('?');

                        if(lineDelete.indexOf(lineAndStation[0]) === -1){
                            lineDelete.push(lineAndStation[0]);
                        }

                        const index = queryArray.indexOf(lineAndStation[0]);

                        queryArray.splice(index, 0, selectedStationArray[i]);

                    }

                    for(var i = 0; i < lineDelete.length; i++){
                        const deLineIndex = queryArray.indexOf(lineDelete[i]);

                        queryArray.splice(deLineIndex, 1);
                    }

                    //console.log(queryArray, 'line');
                    //console.log(lineDelete, 'de');
                }else if(DmsLineSelect.options.selected.length !=0 && DmsStationSelect.options.selected.length != 0 && DmsCategorySelect.options.selected.length != 0){
                    var selectedStationArray = [];
                    var lineDelete = [];
                    var lineAndStationDelete = [];

                    for(var i = 0; i < DmsLineSelect.options.selected.length; i++){
                        queryArray.push(DmsLineSelect.options.selected[i].value);
                    }

                    for(var i = 0; i < DmsStationSelect.options.selected.length; i++){
                        selectedStationArray.push(DmsStationSelect.options.selected[i].parentNode.label + '?' + DmsStationSelect.options.selected[i].value);
                    }

                    for(var i = 0; i < selectedStationArray.length; i++){
                        var lineAndStation = selectedStationArray[i].split('?');

                        if(lineDelete.indexOf(lineAndStation[0]) === -1){
                            lineDelete.push(lineAndStation[0]);
                        }

                        const index = queryArray.indexOf(lineAndStation[0]);

                        queryArray.splice(index, 0, selectedStationArray[i]);

                    }

                    for(var i = 0; i < lineDelete.length; i++){
                        const deLineIndex = queryArray.indexOf(lineDelete[i]);

                        queryArray.splice(deLineIndex, 1);
                    }
                    
                    var selectedCategoryArray = [];
                    for(var i = 0; i < DmsCategorySelect.options.selected.length; i++){
                        var lineAndStation = DmsCategorySelect.options.selected[i].parentNode.label.replace(' > ', '?');
                        var categoryName = DmsCategorySelect.options.selected[i].text;

                        selectedCategoryArray.push(lineAndStation + '*' + categoryName);
                    }

                    for(var i = 0; i < selectedCategoryArray.length; i++){
                        var lineAndStationAndCategory = selectedCategoryArray[i].split('*');

                        if(lineAndStationDelete.indexOf(lineAndStationAndCategory[0]) === -1){
                            lineAndStationDelete.push(lineAndStationAndCategory[0]);
                        }

                        const index = queryArray.indexOf(lineAndStationAndCategory[0]);

                        queryArray.splice(index, 0, selectedCategoryArray[i]);
                    }

                    for(var i = 0; i < lineAndStationDelete.length; i++){
                        const deLineAndStationIndex = queryArray.indexOf(lineAndStationDelete[i]);

                        queryArray.splice(deLineAndStationIndex, 1);
                    }

                    for(var i = 0; i < queryArray.length; i++){
                        var temp = queryArray[i].replace("*", "?");
                        queryArray[i] = temp;
                    }
                    //console.log(queryArray, 'line');
                    //console.log(lineAndStationDelete, 'de');
                }

                $.ajax({
                    url: "/dms/getDrawingByMultiSelect",
                    method: "POST",
                    data: {multiQueryArray: JSON.stringify(queryArray)},
                    success: function(drawingArrayObject){
                        if(document.getElementById("customCheck").checked == false){
                            //console.log(drawingArrayObject,'jkjkkk');
                            showDrawingOnTable(drawingArrayObject, 'multi');
                        }else{
                            var newDrawingArrayObject = {};
                            for(let key in drawingArrayObject){
                                var rawArray = drawingArrayObject[key];

                                rawArray.sort((a, b) => {
                                    if(a.drawingNumber < b.drawingNumber){
                                        return 1;
                                    }else{
                                        return -1;
                                    }
                                });
    
                                rawArray.push('null');
                                var temp = rawArray[0].drawingNumber;
                                var numberOfSameName = 0;
                                var drawingNameWithNumber = [];
                                var theLatestVersionDrawing = [];

                                for(var i = 0; i < rawArray.length; i++){
                                    if(rawArray[i].drawingNumber == temp){
                                        numberOfSameName++;
                                    }else{
                                        drawingNameWithNumber.push(numberOfSameName);
                                        temp = rawArray[i].drawingNumber
                                        numberOfSameName = 1;
                                        //console.log(drawingNameWithNumber, rawArray[i - 1].drawingNumber);
                                    }
                                }

                                for(var i = 0; i < drawingNameWithNumber.length; i++){
                                    var sortingArray = [];
                                    for(var j = 0; j < drawingNameWithNumber[i]; j++){
                                        sortingArray.push(rawArray.shift())
                                    }
    
                                    sortingArray.sort((a, b) => {
                                        if(a.version < b.version){
                                            return 1;
                                        }else{
                                            return -1;
                                        }
                                    });
    
                                    theLatestVersionDrawing.push(sortingArray[0]);
                                }

                                newDrawingArrayObject[key] = theLatestVersionDrawing;
                            }
                            //console.log(newDrawingArrayObject);

                            showDrawingOnTable(newDrawingArrayObject, 'multi');
                        }
                    }
                });

            }
            //alert('Search key word cannot be empty.');
        }
    });

    DmsLineSelect.on('open', function(){
        var allOptionsCustomArray = [];
        var allOptions = Object.values(DmsLineSelect.options.items['#']);

        allOptions.forEach(function(item){
            allOptionsCustomArray.push({
                key: item.key,
                group: item.group
            });
        });

        $.ajax({
            url:'/dms/disableLine',
            method:'POST',
            data:{allOptionsArray: JSON.stringify(allOptionsCustomArray)},
            success: function(disableLineArray){
                disableLineArray.forEach(function(item){
                    DmsLineSelect.options.disable(item.key, item.group);
                });
            }
        });
        
        DmsCategorySelect.config({
            'disabled': true
        });
    });

    DmsLineSelect.on('change', function(){
        var lineArray = [];
        if(this.options.selected.length != 0){
          for(var i = 0; i < this.options.selected.length; i++)  {
              lineArray.push(this.options.selected[i].text);
          }
        }
        //console.log(lineArray,'@@@@@@@@@@@@@@@@@@@@@@');

        $.ajax({
            url:'/dms/getMultiStation',
            method:'POST',
            data:{selectedLineArray: JSON.stringify(lineArray)},
            success: function(multiStationArray){
                if(multiStationArray.hasOwnProperty('empty')){
                    setTimeout(function(){
                        DmsStationSelect.config({
                            'disabled': true
                        });
                        //console.log('空哂', Date.now());
                    }, 50);
                }else{
                    DmsStationSelect.config({
                        'items': multiStationArray,
                        'disabled': false
                    });
                    //console.log('放哂', Date.now());
                }
            }
        });
    });

    DmsStationSelect.on('open', function(){
        var allCustomStationArray = [];
        var allStationOptions = Object.values(DmsStationSelect.options.items);
        allStationOptions.shift();

        allStationOptions.forEach(function(item){
            for(let key in item){
                allCustomStationArray.push({
                    key: key,
                    group: item[key].group
                })
            }
        });

        $.ajax({
            url:'/dms/disableStation',
            method:'POST',
            data:{allStationOptionsArray: JSON.stringify(allCustomStationArray)},
            success: function(disableStationArray){
                disableStationArray.forEach(function(item){
                    DmsStationSelect.options.disable(item.key, item.group);
                });
            }
        });

    });

    DmsStationSelect.on('change', function(){
        var stationArray = [];
        if(this.options.selected.length != 0){
          for(var i = 0; i < this.options.selected.length; i++)  {
            stationArray.push(this.options.selected[i].text);
          }
        }
        //console.log(stationArray,'ssssssssssssssssss');

        $.ajax({
            url:'/dms/getMultiCategory',
            method:'POST',
            data:{selectedStationArray: JSON.stringify(stationArray)},
            success: function(multiCategoryArray){
                if(multiCategoryArray.hasOwnProperty('empty')){
                    setTimeout(function(){
                        DmsCategorySelect.config({
                            'disabled': true
                        });
                        //console.log('空哂', Date.now());
                    }, 50);
                }else{
                    DmsCategorySelect.config({
                        'items': multiCategoryArray,
                        'disabled': false
                    });
                    //console.log('放哂', Date.now());
                }
            }
        });
    });

    DmsCategorySelect.on('open', function(){
        var allCustomCategoryArray = [];
        var allCategoryOptions = Object.values(DmsCategorySelect.options.items);
        allCategoryOptions.shift();

        //console.log(allCategoryOptions);

        allCategoryOptions.forEach(function(item){
            //console.log(item);
            for(let key in item){
                var lineAndStationName = item[key].group.split(' > ');
                //console.log(lineAndStationName);

                allCustomCategoryArray.push({
                    key: key,
                    group: item[key].group,
                    lineName: lineAndStationName[0],
                    stationName: lineAndStationName[1],
                    categoryName: item[key].value
                });
            }
        });

        $.ajax({
            url:'/dms/disableCategory',
            method:'POST',
            data:{allCategoryOptionsArray: JSON.stringify(allCustomCategoryArray)},
            success: function(disableCategoryArray){
                disableCategoryArray.forEach(function(item){
                    DmsCategorySelect.options.disable(item.key, item.group);
                });
            }
        });

    });
    
});