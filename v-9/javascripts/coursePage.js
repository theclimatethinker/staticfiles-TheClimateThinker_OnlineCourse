

var global_chapter_arg = $("#chapter_arg").val();
var global_topic_arg = $("#topic_arg").val();
var global_chapter_index_no = $("#chapter_index_no").val();
var global_topic_index_no = $("#topic_index_no").val();
var global_chapter_id = $("#chapter_id").val();
var global_topic_id = $("#topic_id").val();
var base_url = $("#base_url").val();

var invalidSession = $("#invalidSession").val();

if(invalidSession == 'True'){
    $("#div_invalidSession").show();
    $("#course_contents_main_body").remove();
}
else{

var generated_url = `${base_url}${global_chapter_arg}/${global_topic_arg}`;
// document.location.pathname = generated_url;
var title = document.title
history.pushState({ page: 2 }, title, generated_url);


$(window).on('load', function () {
    $(".loading-image-background-1").hide();
    $('body').css('overflow-y', 'auto');
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
});


$(document).on('click', ".drawer-bar", function () {
    $(".left-panel").toggleClass('default-show');
    $(".top-sticky-2").toggleClass('default-show');
    $(".contents-box").toggleClass('default-show');
});

$(document).on('click', ".collapse_class", function (event){
    var div_target = $(this).data('target');
    $(div_target).toggleClass('show');
    current_expanded = $(this).attr("aria-expanded");
    if(current_expanded == 'true'){
        current_expanded = false
    }
    else{
        current_expanded = true
    }
    $(this).attr("aria-expanded", current_expanded);
});
$(document).on('click', ".list-group-item", function(event){
    event.preventDefault();
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    $(".course_home").hide();
    $("#breadcrumb-item-chapter").show();
    $("#breadcrumb-item-topic").show();
    let topic_id = $(this).data('topic');
    let chapter_id = $(this).data('chapter');
    $(".list-group-item").removeClass("active");
    $(this).addClass("active");
    var div_target = $(this).data('target');
    var href = $(this).attr('href');
    var title = document.title
    history.pushState({page: 2}, title, href);
    $(".topic_content").hide();
    $(".course_home").hide();
    $(div_target).show();
    var chapter_text = $(`#chapter-text-${chapter_id}`).html();
    var sl_no = $(`#topic-text-${topic_id}`).data('sl')
    $(".btn-next").show();
    $(".btn-prev").show();
    var is_test = $(this).data('test');
    if (sl_no == '1') {
        $(".btn-prev").prop('disabled', true);
    }
    else {
        $(".btn-prev").prop('disabled', false);
    }
    if (is_test == true){
        topic_text = $(".assesment_text").html();
        $(".btn-next").prop('disabled', true);
        $(".btn-prev").prop('disabled', false);
    }
    else{
        var topic_text = $(`#topic-text-${topic_id}`).html();
        topic_text = `${sl_no}. ${topic_text}`;
        $(".btn-next").prop('disabled', false);
    }
    $("#breadcrumb-item-topic").show()
    $("#breadcrumb-topic").html(`${topic_text}`);
    $("#breadcrumb-topic").attr('href', `${href}`);
    $("#breadcrumb-item-chapter").show()
    $("#breadcrumb-chapter").html(`${chapter_text}`);
    $("#breadcrumb-chapter").data('chapter', chapter_id);
    let chapter_url = $(`#collapse_class-${chapter_id}`).attr('href');
    $("#breadcrumb-chapter").attr('href', `${chapter_url}`);

    $(".left-panel").addClass('default-show');
    $(".top-sticky-2").addClass('default-show');
    $(".contents-box").addClass('default-show');
    $(`#collapse_class-${chapter_id}`).attr("aria-expanded", true);
    var div_target = $(`#collapse_class-${chapter_id}`).data('target');
    $(div_target).addClass('show');
});
$(document).on('click', ".btn-start-chapter-1", function(){
    $(`.list-group-chapter-1 .list-group-item-topic-1`).click();
});
$(document).on("click", ".btn-next", function(){
    $(".list-group-item.active").next(".list-group-item").click();
});
$(document).on("click", ".btn-prev", function () {
    $(".list-group-item.active").prev(".list-group-item").click();
});

$(document).on('click', "#breadcrumb-home", function(event){
    event.preventDefault();
    $("#list-group-item-intro").click();

});
$(document).on('click', "#list-group-item-intro", function(){
    $(".course_home").show();
    $(".btn-next").hide();
    $(".btn-prev").hide();
    $("#breadcrumb-item-chapter").hide();
    $("#breadcrumb-item-topic").hide();
    $(".list-group-item").removeClass("active");
    $(".topic_content").hide();
    var div_target_home = $(this).data('target');
    $(div_target_home).show();
    var href = $(this).attr('href');
    var title = document.title
    history.pushState({ page: 2 }, title, href);
});

$(document).on('click', '#breadcrumb-chapter', function(event){
    event.preventDefault();
    var chapter = $(this).data('chapter');
    $(`.list-group-item-topic[data-chapter='${chapter}']`)[0].click();
});


$(document).on('click', ".list-group-item-topic", function(){
    $("#div-mark-complete").css('display', '');
});
$(document).on('click', ".list-group-item-test", function () {
    $("#div-mark-complete").css('display', 'none');
});

$(document).on('click', ".btn-mark-complete-enabled", function(){
    $(".loading-image-background").show();
    var topic_id = $(this).data('topic');
    var thisElement = $(this)
    $.ajax({
        type: 'POST',
        url: '/mark-topic-completed/',
        data: {
            'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val(),
            'topic_id': topic_id,
        },
        // contentType: false,
        // processData: false,
        dataType: 'json',
        cache: false,
        success: function (response) { 
            $(".loading-image-background").hide();
            if (response.error == '0') {
                thisElement.prop('disabled', true);
                thisElement.html('Completed');
                $(`#completed_check-${topic_id}`).html(`<i class="fa-solid fa-circle-check text-primary"></i>`);
                $(`#list-group-item-${topic_id}`).next('.list-group-item').click();
            }
        },
        error: function (response) {
            $(".loading-image-background").hide();
            var myArray = new Uint32Array(1);
            crypto.getRandomValues(myArray);
            var msg = `<div class="toast" id="toast-failed-submit" role="alert" aria-live="assertive" aria-atomic="true">
                        <div class="toast-header bg-danger text-light">
                            <strong class="me-auto">Server Error!</strong>
                            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                        </div>
                        <div class="toast-body">
                            Failed to Mark this Topic as Completed. Try Again!
                        </div>
                    </div>`;
            $(".toast-container").append(msg);
            $(`#toast-failed-submit`).toast('show');
        }
    });
});
}


if (global_chapter_arg == '') {
    $("#breadcrumb-home").click();
}
if (global_chapter_id != '') {
    $(`#collapse_class-${global_chapter_id}`).click();
}
else {
    $("#breadcrumb-item-chapter").hide()
}

if (global_topic_id != '') {
    $(`#list-group-item-${global_topic_id}`).click();
}
else if (global_topic_arg == 'test') {
    $(`#list-group-item-test-${global_chapter_id}`).click();
}
else {
    $("#breadcrumb-item-topic").hide()
}


$(document).on('click', "#btn-send-certificate", function(){
    $("#sendCertificateConfirmation").modal('show');
    $.ajax({
        type: 'POST',
        url: '/send-certificate/',
        data: {
            'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val(),
        },
        // contentType: false,
        // processData: false,
        dataType: 'json',
        cache: false,
        success: function (response) {
            if (response.error == '0') {
                // $("#sendCertificateConfirmation").modal('show');
            }
            else{
                alert("Failed to send the certificate to your email!");
            }
        },
        error: function (response) {
            alert("Failed to send the certificate to your email!");
        }
    });
});

function iskSessionChanged(){
    $.ajax({
        type: 'POST',
        url: '/check-session-changes/',
        data: {
            'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val(),
        },
        // contentType: false,
        // processData: false,
        dataType: 'json',
        cache: false,
        success: function (response) {
            if (response.isChanged){
                $("#div_invalidSession").show();
                $("#course_contents_main_body").remove();
            }
        },
        error: function (response) {
        }
    });
}
timer = function () {
     // Update the count down at every 5 minute
    varInterval = setInterval(function () {
        // iskSessionChanged();
    }, 300000);
}
timer();