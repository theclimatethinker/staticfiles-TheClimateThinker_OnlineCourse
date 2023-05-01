var tab_shift_allow = 4;
var tab_shifted = 0;

var varInterval;
var allowedTime_global = '';
var global_final_submit = false;

var user_question_answers_global = [];

var is_user_online = true;

var input_invalidSession = $("#input-invalidSession").val();

if (input_invalidSession == 'True'){
    $("#div-invalidSession").show();
}

var input_alreadyPassed = $("#input-alreadyPassed").val();
var input_passedAll = $("#input-passedAll").val();

if (input_alreadyPassed == "True"){
    if(input_passedAll == 'True'){
        // $("#passed_div-all_chapters").show();
        $("#passed_div-chapter").show();
    }
    else{
        $("#passed_div-chapter").show();
    }
}
var input_disqualified = $("#input-disqualified").val();
if (input_disqualified == "True"){
    $("#disqualified_div").show();
}


var is_all_fine = $("#is_all_fine").val();

if (is_all_fine == 'True'){
window.addEventListener('online', networkConnectionCheck);
window.addEventListener('offline', networkConnectionCheck);
function networkConnectionCheck(event) {
    if (navigator.onLine) {
        if (!is_user_online){
            $(".text-answer-input").prop('disabled', false);
            $(".alert-offline").alert('close');
            $('#alert-offline').remove();
            var online_alert = `<div class="alert alert-success text-center" id="alert-online" role="alert">
                                    <i class="fa-solid fa-circle-check fa-fade"></i> Your connection is back. Now continue the test.
                                    <button type="button" class="btn btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                </div>`
            $("#div_alert").html(online_alert);
            $("#alert-online").show();
            $('#alert-online').fadeOut(7000);
            // $('#div_alert').slideDown();
        }
        is_user_online = true;
    }
    else {
        is_user_online = false;
        $(".text-answer-input").prop('disabled', true);
        $(".alert-online").alert('close');
        $('#alert-online').remove();
        var offline_alert = `<div class="alert alert-danger text-center" id="alert-offline" role="alert">
                                <i class="fa-solid fa-circle-exclamation fa-fade"></i> Your are offline. Connect to the internet to continue the test.
                            </div>`
        $("#div_alert").html(offline_alert);
        $("#alert-offline").show();
    }
}

timer = function (targetTime = undefined) {
    var submit_ans_response = false;
    var cnt = 0;
    if (targetTime != undefined) {
        var next = new Date(targetTime);
    }
    else {
        var next = new Date();
        next.setMinutes(next.getMinutes() + allowedTime_global);
        next.setSeconds(next.getSeconds()+2)
    }
    // Update the count down every 1 second
    varInterval = setInterval(function () {
        networkConnectionCheck(null);
        cnt += 1;
        var now = new Date();
        distance = next - now;
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (hours < 10) {
            hours = `0${hours}`
        }
        if (minutes < 10) {
            minutes = `0${minutes}`
        }
        if (seconds < 10) {
            seconds = `0${seconds}`
        }
        
        if (distance <= 900000) { //15 minutes
            $(".timer").html(`<i class="fa-sharp fa-solid fa-timer fa-beat text-primary" style="margin-top:10px;"></i>&nbsp;<span class="text-warning">${hours}:${minutes}:${seconds}</span>`);
        }
        else if (distance <= 1800000) { //30minutes
            $(".timer").html(`<i class="fa-sharp fa-solid fa-timer fa-beat-fade text-primary" style="margin-top:10px;"></i>&nbsp;<span class="text-warning">${hours}:${minutes}:${seconds}</span>`);
        }
        else {
            $(".timer").html(`<i class="fa-sharp fa-solid fa-timer text-primary" style="margin-top:10px;"></i>&nbsp;<span class="text-success">${hours}:${minutes}:${seconds}</span>`);
        }

        $(".loading-image-background").hide();
        $('body').css('overflow-y', 'auto');

        // after every 10 seconds submit the provisional answers
        if (cnt == 10) {
            cnt = 0;
            // submitAnswer();
        }
        // If the count down is finished
        if (distance <= 0) {
            submitAnswer({ finalSubmit: true });
        }
    }, 1000);
}


function loadAllQuestion({ questions_sets, answeredQuestions, SelectedOptions, reviewedQuestions, revisitQuestions, textAnswers } = {}) {
    $("#div-show-question").html('');
    for (chapter of questions_sets) {
        var Q_Sl_no = 0;
        var slNo_col = '';
        for (question of chapter.questions) {
            Q_Sl_no += 1;
            var h1 = '';
            var textAnswer = '';
            if (textAnswers[question.id] != undefined) {
                textAnswer = textAnswers[question.id];
            }
            var revisit_marked = '';
            var revisitBtnText = "Mark to Revisit Later";
            var revisitTooltip = ''
            if (revisitQuestions.includes(question.id)) {
                revisit_marked = 'revisit-marked';
                revisitBtnText = "Marked to Revisit Later";
                revisitTooltip = `data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Click to Unmark" data-bs-trigger="hover focus"`
            }
            var reviewed = '';
            var reviewBtnText = "Review";
            var review_text = '';
            for (review of reviewedQuestions) {
                if (question.id == review['question__id']) {
                    review_text = review['text'];
                    reviewed = 'reviewed';
                    reviewBtnText = "Reviewed";
                }
            }
            var is_answered = "not-answered";
            if (answeredQuestions.includes(question.id)) {
                is_answered = 'answered';
            }
            if (question.options.length > 0) {
                var opt_sl_no = 0;
                for (option of question.options) {
                    opt_sl_no += 1;
                    opt_sl_no_roman = convertToRoman(opt_sl_no);
                    var selected = '';
                    if (SelectedOptions.includes(option.id)) {
                        selected = 'selected';
                    }
                    h1 +=
                        `<div class="row g-3">
                        <div class="col-auto d-flex align-items-center">
                            <b style="font-size:18px" class="text-secondary"><span class="sl-option sl-option-${question.id}">${opt_sl_no_roman}</span>.</b>
                        </div>
                        <div class="col">
                            <div class="option ${selected} option-${question.id}" id="option-text-${option.id}" data-option="${option.id}" data-question="${question.id}" data-question_type="${question.question_type}">
                                ${option.text}
                            </div>
                        </div>
                    </div>`
                }
            }
            else {
                h1 = `<div class="text-answer" id="text-answer-${question.id}">
                        <input type="text" class="form-control text-answer-input" data-question="${question.id}" name="questionShortAnswer-${question.id}" id="questionShortAnswer-${question.id}" value="${textAnswer}" data-prev_value="${textAnswer}" placeholder="Type the answer for the question here" maxlength="10000">
                    </div>`
            }

            var h =
                `<div class="show-question" id="show-question-${question.id}">
                    <div class="d-flex justify-content-end btn-question">
                        <div class="row g-2">
                            <div class="col-auto">
                                <button type="button" class="btn revisit-question ${revisit_marked}" id="revisit-question-${question.id}" data-question="${question.id}" ${revisitTooltip}>${revisitBtnText}</button>
                            </div>
                            <div class="col-auto">
                                <div class="dropdown">
                                    <button type="button" class="btn review-question ${reviewed}" id="review-question-${question.id}" data-id="${question.id}" data-bs-toggle="dropdown" data-bs-auto-close="outside">
                                        <span data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="If you found any mistakes in the question, then make a review to inform us." data-bs-trigger="hover focus" data-bs-custom-class="custom-tooltip-review">${reviewBtnText}</span>
                                    </button>
                                    <div class="dropdown-menu p-2 dropdown-menu-end" id="review-dropdown-menu-${question.id}">
                                        <textarea class="form-control review-input" rows="2" id="review-input-${question.id}" data-question="${question.id}" placeholder="What's the wrong with the question? (optional)">${review_text}</textarea>
                                        <div class="d-flex justify-content-end mt-1">
                                            <button type="button" class="btn btn-warning btn-review-input" data-question="${question.id}">Submit</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md order-md-3 text-end">
                            <span><b>Total Marks:</b> <span id="total_mark-${question.id}">${question.mark}</span> &nbsp;<b>|</b>&nbsp; <b>Negative Marks:</b> <span id="neg_mark-${question.id}">${question.negative_mark}</span></span>
                        </div>
                        <div class="col-auto order-2 text-start text-md-center">
                            <span><strong>Type:</strong> <span id="question-type-${question.id}" data-question_type="${question.question_type}">${question.question_type}</span></span>
                        </div>
                        <div class="col order-1 text-start">
                            <h5><strong>Q: <span class="sl-question" id="sl-question-${question.id}" data-chapter="${chapter.chapter_name}" data-question="${question.id}">${Q_Sl_no}</span>.</strong></h5>
                        </div>
                    </div>
                    <div class="question" id="question-text-${question.id}">
                        ${question.question}
                    </div>
                    <div class="options" id="options-${question.id}">
                        ${h1}
                    </div>
                    <div class="hr-question"><div>
                </div>`
            $("#div-show-question").append(h);
            slNo_col += `<div class="col">
                                <div class="num-box num-box-original ${is_answered} ${revisit_marked}" id="num-box-${question.id}" data-question="${question.id}">${Q_Sl_no}</div>
                            </div>`
        }
        var slNo_col_html = `<div class="container"><div class="row g-1 row-cols-5">${slNo_col}</div></div>`;
        $(`.question-num-box`).append(slNo_col_html);
    }
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    timer();
}

function fetchQuestions() {
    $.ajax(
        {
            type: 'POST',
            url: "/get-questions/",
            data: {
                'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val(),
                'chapter_no': $("#chapter_no").data('index'),
                'participantId': $("#participant_id").val(),
            },
            // contentType: false,
            // processData: true,
            dataType: 'json',
            cache: false,
            success: function (response) {
                $("#total_answered").html(response.answeredQuestions.length);
                $("#totalQuestions").html(response.total_question);
                $("#total_mark").html(response.total_mark);
                $("#pass_mark").html(`${response.pass_mark}`);
                allowedTime_global = Number(response.allowedTime);
                loadAllQuestion({ questions_sets: response.questions, answeredQuestions: response.answeredQuestions, SelectedOptions: response.SelectedOptions, reviewedQuestions: response.reviewedQuestions, revisitQuestions: response.revisitQuestions, textAnswers: response.textAnswers });
                // timer(response.endTime);

                // $(window).on('load', function () {
                //     document.body.scrollTop = 0;
                //     document.documentElement.scrollTop = 0;
                //     timer()
                // });
            }
        });
}
fetchQuestions();



function submitAnswer({finalSubmit=false}={}){
    global_final_submit = finalSubmit;
    if(finalSubmit){
        $(".modal").modal('hide');
        clearInterval(varInterval);
    }
    if (tab_shifted > tab_shift_allow) {
        reportDisqualified();
    }
    else{
        var user_question_answers = [];
        var participant_id = $("#participant_id").val();
        $(`.num-box-original.answered`).each(function (index, member) {
            var questionId = $(this).data('question');
            var qType = $(`#question-type-${questionId}`).data('question_type');
            var selectedOptions ='';
            var textAnswer = '';
            if(qType == "Write Answer"){
                textAnswer = $(`#questionShortAnswer-${questionId}`).val();
            }
            else{
                $(`.option-${questionId}`).each(function (index, member) {
                    var is_selected = $(this).hasClass('selected');
                    if(is_selected){
                        var option_id = $(this).data('option');
                        selectedOptions += `${option_id},`;
                    }
                });
            }
            var user_question_answer = `{"questionId":"${questionId}", "textAnswer":"${textAnswer}", "selectedOptions":"${selectedOptions}"}`;
            user_question_answers.push(user_question_answer);
        });
        var ret;
        response_status = null;
        if((equalsCheck(user_question_answers_global, user_question_answers) == false || finalSubmit == true) && (tab_shifted <= tab_shift_allow)){
            if (finalSubmit) {
                $("#main_quiz_div").hide();
                $("#submitting_div").show();
            }
            user_question_answers_global = user_question_answers;
            console.log($('input[name=csrfmiddlewaretoken]').val())
            $.ajax(
            {
                type:'POST',
                url: "/submit-answer/",
                data: {
                    'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val(),
                    'participant_id': participant_id,
                    'chapter_index': $("#chapter_no").data('index'),
                    'answers': user_question_answers,
                    'finalSubmit': finalSubmit,
                },
                // contentType: false,
                // processData: true,
                dataType: 'json',
                cache: false,
                success:function(response){
                    response_data = {}
                    if (response.invalidSession) {
                        $("#main_quiz_div").remove();
                        $("#submitting_div").hide();
                        $("#div-invalidSession").show();
                    }
                    else{
                        if (response.error != '0') {
                            response_data = {
                                response_status: false,
                                response: response
                            }
                            console.log(`Failed to Update Participant's Answers to the server!`);
                        }
                        else {
                            response_data = {
                                response_status: true,
                                response: response
                            }
                            console.log(`Participant's Answers Updated to the server....`);
                        }
                        if (finalSubmit) {
                            showResult(response_data);
                        }
                    }
                    
                },
                error:function(response){
                    ret = {
                        response_status: false,
                        response: response
                    }
                    console.log(`Failed to Update Participant's Answers to the server!`);
                    if(finalSubmit){
                        showResult(ret);
                    }
                }
            });
        }
        return true;
    }
}
function showResult(response){   
    $("#main_quiz_div").hide();
    if(response.response_status == false){
        var myArray = new Uint32Array(1);
        crypto.getRandomValues(myArray);
        var msg = `<div class="toast" id="toast-failed-submit" role="alert" aria-live="assertive" aria-atomic="true">
                        <div class="toast-header bg-danger text-light">
                            <strong class="me-auto">Server Error!</strong>
                            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                        </div>
                        <div class="toast-body">
                            Failed to submit your answers. We're trying again.
                        </div>
                    </div>`;
        $(".toast-container").append(msg);
        $(`#toast-failed-submit`).toast('show');
        submitAnswer({finalSubmit:true});
    }
    else{
        $("#main_quiz_div").remove();
        if(response.response.passed == true){
            $("#submitting_div").hide();
            $(".obtained_percentage").html(response.response.percentage);
            $(".participant_name").html(response.response.name);
            $(".total_attempted").html(response.response.attempted);
            if (response.response.is_passed_all){
                $("#passed_div-all_chapters").show();
                $(".certificate-link").attr('href', response.response.certificate_url);
            }
            else{
                $("#passed_div-chapter").show();
            }
        }
        else if(response.response.passed == false){
            $("#submitting_div").hide();
            $("#failed_div-chapter").show();
            $(".obtained_percentage").html(response.response.percentage);
            $(".participant_name").html(response.response.name);
            $(".total_attempted").html(response.response.attempted);
            if (response.response.attempt_again){
                $("#reattempt_text-true").show();
                $("#reattempt_text-false").hide();
            }
            else{
                $("#reattempt_text-true").hide();
                $("#reattempt_text-false").show();
                $(".btn-reattempt").hide()
            }
        }
        return true;
    }
}
$(document).on('click', "#yes_final_submit", function(){
    submitAnswer({finalSubmit:true});
});

$(document).on('click', ".btn-reattempt", function(){
    location.reload();
});

function markQuestion({questionId}={}){
    if (is_user_online){
        var total_answered = Number($("#total_answered").html());
        var qType = $(`#question-type-${questionId}`).data('question_type');
        if(qType == "Write Answer"){
            textAnswer = $(`#questionShortAnswer-${questionId}`).val();
            if(textAnswer.length <= 0 || textAnswer == ''){
                $(`#num-box-${questionId}`).removeClass('answered');
                $(`#num-box-${questionId}`).addClass('not-answered');
                total_answered -= 1;
            }
            else{
                $(`#num-box-${questionId}`).removeClass('not-answered');
                $(`#num-box-${questionId}`).addClass('answered'); 
                total_answered += 1;
            }
        }
        else{
            var select_count = 0;
            $(`.option-${questionId}`).each(function (index, member) {
                var is_selected = $(this).hasClass('selected');
                if(is_selected){
                    select_count += 1;
                }
            });
            if(select_count == 0){
                $(`#num-box-${questionId}`).removeClass('answered');
                $(`#num-box-${questionId}`).addClass('not-answered');
                let answered = $(`#num-box-${questionId}`).hasClass('answered');
                if(!answered){
                    total_answered -= 1;
                }
            }
            else{
                let answered = $(`#num-box-${questionId}`).hasClass('answered');
                if(!answered){
                    total_answered += 1;
                }
                $(`#num-box-${questionId}`).removeClass('not-answered');
                $(`#num-box-${questionId}`).addClass('answered');   
            }
        }
        $("#total_answered").html(total_answered);
    }
}


$(document).on('change', ".text-answer-input", function(){
    var qid = $(this).data('question');
    if (is_user_online){
        markQuestion({questionId:qid});
    }
});
$(document).on('keyup', ".text-answer-input", function(){
    if (!is_user_online){
        $(this).val($(this).data('prev_value'));
    }
});
$(document).on('click', ".option", function(){
    if (is_user_online){
        var question_type = $(this).data("question_type");
        var question_id = $(this).data('question');
        var option_id = $(this).data('option');
        if(question_type == "MCQ"){
            $(`.option-${question_id}:not(#option-text-${option_id})`).removeClass('selected');
        }
        $(this).toggleClass('selected');
        markQuestion({questionId:question_id});
    }
});


$(document).on('click', ".num-box-original", function(){
    var qId = $(this).data('question');
    var qDiv = `show-question-${qId}`;
    const elementQuestion = document.getElementById(qDiv);
    elementQuestion.scrollIntoView({behavior: "instant", block: "center"});
});

$(document).on('click', ".drawer-bar", function(){
    $(".left-panel").toggleClass('default-show');
    $(".top-sticky-2").toggleClass('default-show');
    $(".contents-box").toggleClass('default-show');
});


$(document).on('click', ".revisit-question", function(){
    var thisElement = $(this);
    var questionId = thisElement.data('question');
    thisElement.toggleClass("revisit-marked");
    let is_marked = thisElement.hasClass('revisit-marked');
    if (is_marked){
        $(`#num-box-${questionId}`).addClass('revisit-marked');
        thisElement.html('Marked to Revisit Later');
        thisElement.attr({
            "data-bs-toggle": "tooltip",
            "data-bs-placement": "top",
            "data-bs-title": "Click to Un-mark",
            "data-bs-trigger": "hover focus"
        });
    }
    else{
        $(`#num-box-${questionId}`).removeClass('revisit-marked');
        thisElement.html('Mark to Revisit Later');
        thisElement.tooltip('hide');
        thisElement.attr({
            "data-bs-toggle": "",
            "data-bs-placement": "",
            "data-bs-title": "",
            "data-bs-trigger": ""
        });
    }
});
// $(document).on('click', ".revisit-question", function(){
//     var thisElement = $(this);
//     var questionId = thisElement.data('question');
//     thisElement.prop('disabled', true);
//     $.ajax(
//     {
//         type:'POST',
//         url: "/mark-revisit/",
//         data: {
//             'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val(),
//             'participantId': $("#participant_id").val(),
//             'questionId': questionId,
//         },
//         // contentType: false,
//         // processData: true,
//         dataType: 'json',
//         cache: false,
//         success:function(response){
//             thisElement.prop('disabled', false);
//             if(response.error != '0'){
//                 var myArray = new Uint32Array(1);
//                 crypto.getRandomValues(myArray);
//                 var qNo = $(`#sl-question-${questionId}`).html();
//                 var msg = `<div class="toast" id="toast-${myArray[0]}" role="alert" aria-live="assertive" aria-atomic="true">
//                                 <div class="toast-header bg-danger text-light">
//                                     <strong class="me-auto">Error!</strong>
//                                     <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
//                                 </div>
//                                 <div class="toast-body">
//                                     Failed to mark or un-mark the <strong>Q: ${qNo}</strong> for revisit. Try again!
//                                 </div>
//                             </div>`;
//                     $(".toast-container").append(msg);
//                     $(`#toast-${myArray[0]}`).toast('show');
//             }
//             else{
//                 if(response.status == "Marked"){
//                     $(`#num-box-${questionId}`).addClass("revisit-marked");
//                     thisElement.html('Marked to Revisit Later');
//                     thisElement.addClass("revisit-marked");
//                     thisElement.attr({
//                         "data-bs-toggle": "tooltip",
//                         "data-bs-placement": "top",
//                         "data-bs-title": "Click to Unmark",
//                         "data-bs-trigger": "hover focus"
//                     });
//                 }
//                 else{
//                     $(`#num-box-${questionId}`).removeClass("revisit-marked");
//                     thisElement.html('Mark to Revisit Later');
//                     thisElement.removeClass("revisit-marked");
//                     thisElement.tooltip('hide');
//                     thisElement.attr({
//                         "data-bs-toggle": "",
//                         "data-bs-placement": "",
//                         "data-bs-title": "",
//                         "data-bs-trigger": ""
//                     });
//                 }
//             }
//         },
//         error:function(response){
//             thisElement.prop('disabled', false);
//             var myArray = new Uint32Array(1);
//             crypto.getRandomValues(myArray);
//             var qNo = $(`#sl-question-${questionId}`).html();
//             var msg = `<div class="toast" id="toast-${myArray[0]}" role="alert" aria-live="assertive" aria-atomic="true">
//                             <div class="toast-header bg-danger text-light">
//                                 <strong class="me-auto">Server Error!</strong>
//                                 <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
//                             </div>
//                             <div class="toast-body">
//                             Failed to mark or un-mark the <strong>Q: ${qNo}</strong> for revisit. Try again!
//                             </div>
//                         </div>`;
//             $(".toast-container").append(msg);
//             $(`#toast-${myArray[0]}`).toast('show');
//         }
//     });
// });

$(document).on('click', ".btn-review-input", function(){
    var thisElement = $(this)
    var questionId = thisElement.data('question');
    var reviewText = $(`#review-input-${questionId}`).val();
    thisElement.prop('disabled', true);
    thisElement.html('Submitting');
    $(`#review-dropdown-menu-${questionId}`).removeClass('show');
    $.ajax(
    {
        type:'POST',
        url: "/add-review/",
        data: {
            'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val(),
            'participantId': $("#participant_id").val(),
            'questionId': questionId,
            'reviewText': reviewText,
        },
        // contentType: false,
        // processData: true,
        dataType: 'json',
        cache: false,
        success:function(response){
            thisElement.prop('disabled', false);
            thisElement.html('Submit');
            if(response.error != '0'){
                var myArray = new Uint32Array(1);
                crypto.getRandomValues(myArray);
                var qNo = $(`#sl-question-${questionId}`).html();
                var msg = `<div class="toast" id="toast-${myArray[0]}" role="alert" aria-live="assertive" aria-atomic="true">
                                <div class="toast-header bg-danger text-light">
                                    <strong class="me-auto">Error!</strong>
                                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                                </div>
                                <div class="toast-body">
                                    Failed to submit your review for <strong>Q: ${qNo}.</strong> Try again!
                                </div>
                            </div>`;
                    $(".toast-container").append(msg);
                    $(`#toast-${myArray[0]}`).toast('show');
            }
            else{
                $(`#review-question-${questionId}`).addClass('reviewed');
                $(`#review-question-${questionId}`).html("Reviewed");
            }
        },
        error:function(response){
            thisElement.prop('disabled', false);
            thisElement.html('Submit');
            var myArray = new Uint32Array(1);
            crypto.getRandomValues(myArray);
            var qNo = $(`#sl-question-${questionId}`).html();
            var msg = `<div class="toast" id="toast-${myArray[0]}" role="alert" aria-live="assertive" aria-atomic="true">
                            <div class="toast-header bg-danger text-light">
                                <strong class="me-auto">Server Error!</strong>
                                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                            </div>
                            <div class="toast-body">
                                Failed to submit your review for <strong>Q: ${qNo}.</strong> Try again!
                            </div>
                        </div>`;
            $(".toast-container").append(msg);
            $(`#toast-${myArray[0]}`).toast('show');
        }
    });
});




$(document).on('contextmenu', function(event){
    event.preventDefault();
});
// $(document).on('mousedown', function(event){
//     event.preventDefault();
// });
$(document).on('selectstart', function(event){
    event.preventDefault();
});
$(document).on('cut', function(event){
    event.preventDefault();
});
$(document).on('copy', function(event){
    event.preventDefault();
});
$(document).on('paste', function(event){
    event.preventDefault();
});

function reportDisqualified(){
    showSingleButtonAlert({close:true});
    $("#disqualified_div").show();
    $("#main_quiz_div").hide();
    var csrfmiddlewaretoken = $('input[name=csrfmiddlewaretoken]').val()
    $.ajax(
    {
        type: 'POST',
        url: "/disqualify-participant/",
        data: {
            'csrfmiddlewaretoken': csrfmiddlewaretoken,
            'participantId': $("#participant_id").val(),
        },
        // contentType: false,
        // processData: true,
        dataType: 'json',
        cache: false,
        success: function (response) {
            $("#main_quiz_div").remove();
        },
        error: function (response) {
            reportDisqualified();
        }
    });
}

var TimeInterval;
$(window).blur(function() {
    clearInterval(TimeInterval);
    var cnt = 0;
    var check = !($("#main_quiz_div").is(":hidden")); // not hidden
    var check2 = $("#main_quiz_div").length > 0; // not removed
    if (check && check2){
        TimeInterval = setInterval(function () {
            cnt += 1;
            if (cnt >= 30) {
                reportDisqualified();
            }
        }, 1000);
        tab_shifted = tab_shifted + 1;
        if(tab_shifted > tab_shift_allow){
            reportDisqualified();
        }
        else{
            showSingleButtonAlert({ title: "Warning!", message: `You are not allowed to leave  the page.<br>If you change the page ${(tab_shift_allow - tab_shifted) + 1} more times, you will be disqualified.`, buttonText: "Okay" });
        }
    }
 });
window.onfocus = function(){
    clearInterval(TimeInterval);
}

window.onbeforeunload = function(e) {
    var check = !($("#main_quiz_div").is(":hidden")); // not hidden
    var check2 = $("#main_quiz_div").length > 0; // not removed
    if (check2){
        return "You text is not saved!";
    }
}
}