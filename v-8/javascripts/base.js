

$(document).ready(function(){
    // $("[data-bs-toggle=popover]").popover();
    $('body').tooltip({
        selector: '[data-bs-toggle="tooltip"]'
    });
    $('body').popover({
        selector: '[data-bs-toggle="popover"]'
    });
    $(".toast").toast('show');
});
bootstrap.Toast.Default.delay = 15000; //15 sec




$(document).on('click', ".table-sort-column", function(){
    var index = $(this).index();
    var table = $(this).parent().parent().parent();
    sort_icon = $(this).children(".table-sort-icon");
    $(".table-sort-icon").removeClass('fa-duotone fa-sort-up');
    $(".table-sort-icon").removeClass('fa-duotone fa-sort-down');
    $(".table-sort-icon").addClass('fa-solid fa-sort');
    sortTable(index, table, sort_icon);
});
// A function to compare two arrays in javascript
const equalsCheck = (a, b) =>
    a.length === b.length && a.every((v, i) => v === b[i]);

function sortTable(column_index, table, target_col_sort_icon) {
    var rows, i, x, y, shouldSwitch, switchcount = 0;
    var switching = true;
    // Set the sorting direction to ascending:
    var dir = "asc";
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        rows = $(table).children("tbody").children("tr")
        /* Loop through all table rows (except the
        first, which contains table headers): */
        for (i = 0; i < (rows.length - 1); i++) {
            $(target_col_sort_icon).removeClass('fa-solid fa-sort');
            // Start by saying there should be no switching:
            shouldSwitch = false;
            /* Get the two elements you want to compare,
            one from current row and one from the next: */
            x = rows[i].getElementsByTagName("TD")[column_index];
            y = rows[i + 1].getElementsByTagName("TD")[column_index];
            /* Check if the two rows should switch place,
            based on the direction, asc or desc: */
            if (dir == "asc") {
                $(target_col_sort_icon).removeClass('fa-duotone fa-sort-down');
                $(target_col_sort_icon).addClass('fa-duotone fa-sort-up');
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                // If so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
                }
            } else if (dir == "desc") {
                $(target_col_sort_icon).removeClass('fa-duotone fa-sort-up');
                $(target_col_sort_icon).addClass('fa-duotone fa-sort-down');
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                // If so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
                }
            }
        }
        if (shouldSwitch) {
            /* If a switch has been marked, make the switch
            and mark that a switch has been done: */
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            // Each time a switch is done, increase this count by 1:
            switchcount ++;
        } else {
            /* If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again. */
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}


var movingDot;
function dotMovingAnimation({domElement, noOfDot}={}){
    var id = 1;
    var time = 190;
    var forwardMoving = true;
    var htmlContent = ''
    if(noOfDot > 0){
        for(i=1; i<=noOfDot; i++){
            htmlContent += `<i class="fas fa-circle dot" style="font-size: 13px; color:#ffffffaf" id="dot-${i}"></i> `
        }
        domElement.innerHTML = htmlContent;
        movingDot = setInterval(function(){
            var zoomOutStyle = {
                'font-size': '13px',
                'color': '#ffffffaf',
            }
            $(".dot").css(zoomOutStyle)
            var zoomInStyle = {
                'font-size': '14.5px',
                'color': 'white',
            }
            $(`#dot-${id}`).css(zoomInStyle);
            if(forwardMoving){
                id = id + 1
            }
            else{
                id = id - 1
            }
            if(id > noOfDot){
                id = noOfDot;
                forwardMoving = false;
            }
            else if(id < 1){
                id = 1;
                forwardMoving = true;
            }
        }, time);
    }
    else{
        clearInterval(movingDot)
    }
}



var overflowY = 'auto';
var single_button_alert = ''
var clickAfterFunction = undefined;
function showSingleButtonAlert({title='', message='', buttonText='', functionName=undefined, close=false}={}){
    single_button_alert = document.getElementById("id_SingleButton-Alert");
    overflowY = document.body.style.overflowY;
    if(close){
        single_button_alert.style.display = "none";
        document.body.style.overflowY = overflowY;
        return false;
    }
    clickAfterFunction = functionName;
    $('#id_SingleButton-Alert-header').html(title)
    $('#id_SingleButton-Alert-message').html(message)
    $('#id_SingleButton-Alert-button').html(buttonText)
    single_button_alert.style.display = "block";
    document.body.style.overflowY = 'hidden';
}
$('#id_SingleButton-Alert-button').on('click', function(){
    if(clickAfterFunction != undefined){
        clickAfterFunction();
    }
    single_button_alert.style.display = "none";
    document.body.style.overflowY = overflowY;
});

var two_button_alert;
function twoButtonAlert({message, buttonCloseText, buttonOkayText, functionName=undefined}={}){
    two_button_alert = document.getElementById("id_TwoButton-Alert");
    overflowY = document.body.style.overflowY;
    clickAfterFunction = functionName;
    $('#id_TwoButton-Alert-message').html(message)
    $('#id_TwoButton-Alert-button-close').html(buttonCloseText)
    $('#id_TwoButton-Alert-button-okay').html(buttonOkayText)
    two_button_alert.style.display = "block";
    document.body.style.overflowY = 'hidden';
}
$('#id_TwoButton-Alert-button-okay').on('click', function(){
    if(clickAfterFunction != undefined){
        clickAfterFunction();
    }
    two_button_alert.style.display = "none";
    document.body.style.overflowY = overflowY;
});
$('#id_TwoButton-Alert-button-close').on('click', function(){
    two_button_alert.style.display = "none";
    document.body.style.overflowY = overflowY;
});



function getCookiesValue(cookies_name){
    var cookies = document.cookie; //read all cookies
    var value = null;
    cookies = cookies.split('; ');
    for(var i=0; i<cookies.length; i++)
    {
        var name = cookies[i].split('=')[0];
        if(name == cookies_name)
        {
            value = cookies[i].split('=')[1];
            break;
        }
    }
    return value
}


function formatDateTime(dateTime)
{
    if(dateTime == '' || dateTime == undefined || dateTime == null || dateTime == 'None'){
        return `N/A`
    }
    else{
        var dt = new Date(dateTime);
        var hours = dt.getHours();
        var minutes = dt.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM'; //AM or PM
        hours = hours % 12; //convert in 12-hour format;
        hours = hours ? hours : 12; //display 0 as 12
        var day = dt.toLocaleString('default', { day: 'numeric' });
        var month = dt.toLocaleString('default', { month: 'long' });
        var year = dt.toLocaleString('default', { year: 'numeric' });
        
        dt = `${(day <= 9) ? '0'+day : day} ${(month <= 9) ? '0'+month : month} ${(year <= 9) ? '0'+year : year}, ${(hours <= 9) ? '0'+hours : hours}:${(minutes <= 9) ? '0'+minutes : minutes} ${ampm}`;
        return dt;
    }
}
function formatDate(date)
{
    var dt = new Date(date);
    var day = dt.toLocaleString('default', { day: 'numeric' });
    var month = dt.toLocaleString('default', { month: 'long' });
    var year = dt.toLocaleString('default', { year: 'numeric' });
    
    dt = `${(day <= 9) ? '0'+day : day} ${(month <= 9) ? '0'+month : month} ${(year <= 9) ? '0'+year : year}`;
    return dt;
}
function formatTime(time)
{
    time = time.split(":")
    let hour = time[0]
    let ampm = hour >= 12 ? 'PM' : 'AM'; //AM or PM
    hour = hour % 12; //convert in 12-hour format;
    hour = hour ? hour : 12; //display 0 as 12
    let minute = time[1]
    
    dt = `${hour <=9 ? '0'+hour : hour}:${minute} ${ampm}`
    return dt;
}


$(document).on('change', 'input:not([type="file"])', whitespace_validation);
$(document).on('change', 'textarea', whitespace_validation);
function whitespace_validation(){
    var inputValue = String($(this).val());
    inputValue = inputValue.replace(/ +/g, " "); // remove any number of space occurrences with a single space
    inputValue = inputValue.replace(/\n+/g, "\n"); // remove any number of new line occurrences with a single new line
    $(this).val(inputValue);
}

$(document).on('change', 'input:not([type="file"])', leading_trailing_whitespace_validation);
$(document).on('change', 'textarea', leading_trailing_whitespace_validation);
function leading_trailing_whitespace_validation(){
    var inputValue = String($(this).val());
    inputValue = inputValue.trim() // Remove leading and trailing whitespace and new lines
    $(this).val(inputValue);
}

$(document).on('keyup', 'input[type=tel]', contact_validation);
$(document).on('keyup', 'input[inputmode=tel]', contact_validation);
function contact_validation(){
    var inputValue = String($(this).val());
    inputValue = inputValue.replace(/[^0-9^ ^.^+^(^)^*^#^-]/g, "")
    $(this).val(inputValue)
}

$(document).on('keyup', 'input[inputmode=numeric]', only_numeric);
function only_numeric(){
    var inputValue = String($(this).val());
    inputValue = inputValue.replace(/[^0-9]/g, "")
    $(this).val(inputValue)
}

$(document).on('keyup', 'input[data-validation=basic_name_validation]', basic_name_validation);
function basic_name_validation(){
    let name = $(this).val()
    name = name.replace(/[^a-z^A-Z^ ^.^(^)]/g, "").replace(/ ./g, ".").replace(/\.+/g, ".")
    name = name.replace(/^\./g, "").replace(/^\)/g, "") // remove dot and open bracket at begaining position
    $(this).val(name)
}
$(document).on('change', 'input[data-validation=basic_name_validation]', function(){
    let name = $(this).val()
    name = name.replace(/[.] {0,}/g, ". ").replace(/\.$/g, "").replace(/\($/g, "")
    $(this).val(name)
});


$(document).on('keyup', 'input[data-validation=office_name_validation]', office_name_validation);
function office_name_validation(){
    let name = $(this).val()
    name = name.replace(/[^a-z^A-Z^ ^.^-^:^,^&^(^)^`^']/g, "").replace(/ ./g, ".").replace(/\.+/g, ".")
    name = name.replace(/^\./g, "").replace(/^\-/g, "").replace(/^\:/g, "").replace(/^\,/g, "").replace(/^\&/g, "").replace(/^\)/g, "").replace(/^\`/g, "").replace(/^\'/g, "")
    $(this).val(name)
}
$(document).on('change', 'input[data-validation=office_name_validation]', function(){
    let name = $(this).val()
    name = name.replace(/[.] {0,}/g, ". ").replace(/\.$/g, "").replace(/\-$/g, "").replace(/\:$/g, "").replace(/\,$/g, "").replace(/\&$/g, "").replace(/\($/g, "")
    $(this).val(name)
});


function convertToRoman(number){
    if (typeof number !== 'number') 
        return false; 

    var digits = String(+number).split("");
    var key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
    "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
    "","I","II","III","IV","V","VI","VII","VIII","IX"];
    var roman_num = "";
    var i = 3;
    while (i--){
        roman_num = (key[+digits.pop() + (i * 10)] || "") + roman_num;
    }
    return Array(+digits.join("") + 1).join("M") + roman_num;
}


function loadCountryDialCode(){
    var root_static_url = $("#static_url").val();
    $.getJSON(`${root_static_url}json/countries.json`, function(data) {
        // JSON result in `data` variable
        sorted_data = data.sort(function(a,b){
            if (a.name < b.name) {
                return -1;
            }
        });
        for (country of sorted_data){
            $(".select-dial_code .dropdown-menu-lists").append(`<div class="dropdown-item" data-search="${country.name}" data-label="${country.dial_code}" data-value="${country.dial_code}"><img class="country-flag-icon" src="${country.flag}"/> ${country.dial_code}&nbsp;&nbsp;${country.name}</div>`)
        }
    });
}
loadCountryDialCode();

$(document).on('keyup', '.select-dropdown .select-dropdown-input-search', function(){
    var search_value = $(this).val().toLowerCase();
    var parentElement = $(this).parent('.dropdown-menu');
    parentElement.children('.dropdown-menu-lists').children(".dropdown-item").hide();
    parentElement.children('.dropdown-menu-lists').children(".dropdown-item").each(function (index, member) {
        var data_search = $(this).data('search').toLowerCase();
        if (data_search.match(search_value)){
            $(this).show();
        }
    });
});

$(document).on('click', ".select-dropdown .dropdown-menu .dropdown-item", function(){
    var parent_element = $(this).parent('.dropdown-menu-lists').parent(".dropdown-menu").parent('.select-dropdown');
    parent_element.children('.dropdown-menu').children('.dropdown-item').removeClass('active');
    $(this).addClass("active");
    var inputValue = $(this).data('value');
    parent_element.children(".select-dropdown-input-value").val(inputValue);
    inputLabel = $(this).data('label');
    parent_element.children(".select-dropdown-display-label").val(inputLabel);
    parent_element.children(".dropdown-menu").removeClass('show');

    var country_code_dropdown = $(this).parent('.dropdown-menu-lists').parent(".dropdown-menu").parent('.select-country-code-dropdown');
    var img_icon = $(this).children('img').attr('src');
    $(".selected-item-icon").remove();
    country_code_dropdown.append(`<img class="country-flag-icon selected-item-icon" src="${img_icon}"/>`)
});

var timeZoneOffsetValue = new Date().getTimezoneOffset();
$('#timezonevalue').val(timeZoneOffsetValue);
document.cookie=`TimeZoneOffset=${timeZoneOffsetValue}; samesite=lax; secure;`;


// var ImageEditor = require('tui-image-editor');
// const FileSaver = require('file-saver'); //to download edited image to local. Use after npm install file-saver
// const blackTheme = require('./js/theme/black-theme.js');
var imageEditor = new tui.ImageEditor(document.querySelector('#tui-image-editor'), {
    includeUI: {
        // loadImage: {
        //     path: 'img/sampleImage.jpg',
        //     name: 'SampleImage',
        // },
        // theme: blackTheme, // or whiteTheme
        initMenu: 'filter',
        menuBarPosition: 'bottom',
    },
    // cssMaxWidth: 700,
    // cssMaxHeight: 500,
    selectionStyle: {
        cornerSize: 20,
        rotatingPointOffset: 70,
    },
    usageStatistics: false,
});
window.onresize = function () {
    imageEditor.ui.resizeEditor();
}