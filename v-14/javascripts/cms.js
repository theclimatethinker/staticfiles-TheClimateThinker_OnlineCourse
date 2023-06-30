var logged_out = false;

CKEDITOR.addStylesSet( 'custom_style',
[
   // Define paragraph as the default style.
   { name : 'Default', element : 'div', styles: { 'font-size':'18px' } }

   // Your other styles defined below.
   //...
]);

var conf = {
    height: '70vh',
    width: '100%'
}
// var conf = Object.assign({}, global_ckeditor_conf, conf);
// var instruction_ckeditor = addCkEditor('instruction_editor', conf);
var instruction_ckeditor = addCkEditor('instruction_editor', conf)

var conf = {
    height: '65vh',
    width: '100%'
}
// var conf = Object.assign({}, global_ckeditor_conf, conf);
var welcomeContent_editor = addCkEditor('welcomeContent_editor', conf);

var conf = {
    height: '80px',
    width: '100%',
    editorplaceholder: "Enter the question here...."
}
// var conf = Object.assign({}, global_ckeditor_conf, conf);
var newQuestion_editor = addCkEditor('newQuestion_editor', conf);

var editQuestion_editor = {}
var editQuestion_editor_conf = conf

var conf = {
    height: '65vh',
    width: '100%'
}
// var conf = Object.assign({}, global_ckeditor_conf, conf);
var editTopicContent_editor = {}
var editTopicContent_editor_conf = conf

var conf = {
    height: '65vh',
    width: '100%'
}
// var conf = Object.assign({}, global_ckeditor_conf, conf);
var addTopicContent_editor = {}
var addTopicContent_editor_conf = conf

$(document).on('click', `[data-bs-toggle="tooltip"]`, function(){
    $(this).tooltip('hide');
});

$(".admin-action").on('click', function(){
    $("#startup-text").hide();
    $('.admin-action').removeClass('select')
    $(this).addClass('select');
    var eleId = $(this).data('target');
    $(".content-block").hide();
    $(eleId).show();
});

function updateOptionSl(qId){
    $(`.sl-option-${qId}`).each(function (index, member) {
        var sl = index+1;
        var romanSl = convertToRoman(sl);
        $(this).html(romanSl);
    });
}
function updateQuestionSl(updateOptionSlNo=false){
    var prev_chapter1 = ''
    var slNo1 = 0;
    $(".sl-question").each(function (index, member) {
        var current_chapter1 = $(this).data('chapter');
        if(prev_chapter1 != current_chapter1){
            slNo1 = 0;
            prev_chapter1 = current_chapter1;
        }
        slNo1 +=  1
        $(this).html(slNo1);
        if(updateOptionSlNo){
            qId = $(this).data('question');
            updateOptionSl(qId);
        }
    });
    var prev_chapter2 = '';
    var slNo2 = 0;
    $(".sl-question-modal").each(function (index, member) {
        var current_chapter2 = $(this).data('chapter');
        if(prev_chapter2 != current_chapter2){
            slNo2 = 0;
            prev_chapter2 = current_chapter2;
        }
        slNo2 +=  1
        $(this).html(slNo2);
    });
    var prev_chapter3 = '';
    var slNo3 = 0;
    $(".sl-question-review").each(function (index, member) {
        var current_chapter3 = $(this).data('chapter');
        if (prev_chapter3 != current_chapter3) {
            slNo3 = 0;
            prev_chapter3 = current_chapter3;
        }
        slNo3 += 1
        $(this).html(slNo3);
    });
}

$(document).on('click', '.btn-show_reviews', function(){
    $('.modal').modal('hide');
    var targetEle = $(this).data('target');
    $(targetEle).modal('show'); 
});
$(document).on('click', ".btn-open-offcanvas-questionForm", function () {
    var targetEle = $(this).data('target');
    $(targetEle).addClass('show');
});
$(document).on('click', ".btn-open-offcanvas-questionEditForm", function(){
    var targetEle = $(this).data('target');
    $(targetEle).addClass('show');
});
$(document).on('click', ".offcanvas-questionForm .btn-close", function(){
    var targetEle = $(this).data('bs-dismiss');
    $(targetEle).removeClass('show');
});

$("#instructionForm").on('submit', function(event){
    event.preventDefault();
    var theForm = new FormData(this);
    var csrf = $('input[name=csrfmiddlewaretoken]').val();
    theForm.append('csrfmiddlewaretoken', csrf);
    var txt = instruction_ckeditor.getData();
    theForm.append('text', txt);
    $("#btn-instructionForm").prop('disabled', true);
    $("#btn-instructionForm").html("Updating...");
    $.ajax(
    {
        type:'POST',
        url: $(this).attr('action'),
        data: theForm,
        contentType: false,
        processData: false,
        dataType: 'json',
        cache: false,
        success:function(response){
            $("#btn-instructionForm").prop('disabled', false);
            $("#btn-instructionForm").html("Update");
            if(response.error != '0'){
                showSingleButtonAlert({title:"Error", message:"Failed to update the Instruction.<br>Try Again!.", buttonText:"Okay"});
            }
        },
        error:function(response){
            $("#btn-instructionForm").prop('disabled', false);
            $("#btn-instructionForm").html("Update");
            showSingleButtonAlert({ title: "Server Error", message:"Failed to update the Instruction.<br>Try Again!.", buttonText:"Okay"});
        }
    });
});


$(document).on('click', '#btn-editWelcomeContent', function(){
    var textContent = welcomeContent_editor.getData();
    var thisElement = $(this);
    thisElement.prop('disabled', true);
    thisElement.html('Updating....');
    $.ajax(
        {
            type: 'POST',
            url: "/update-welcome/",
            data: {
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                textContent: textContent,
            },
            // contentType: false,
            // processData: true,
            dataType: 'json',
            cache: false,
            success: function (response) {
                thisElement.prop('disabled', false);
                thisElement.html('Update');
                if (response.error != '0') {
                    showSingleButtonAlert({ title: "Error", message: "Failed to update the Welcome Message.<br>Try Again!.", buttonText: "Okay" });
                }
                else {
                    
                }
            },
            error: function (response) {
                thisElement.prop('disabled', false);
                thisElement.html('Update');
                showSingleButtonAlert({ title: "Server Error", message: "Failed to update the Welcome Message.<br>Try Again!.", buttonText: "Okay" });
            }
        });
});

function loadAllChapters({ chaptersInfo = [], topicsInfo=[], onlyAddTopic=false}={}){
    var chapterOptions = $("#NewQuestionChapter").html();
    for(chapter of chaptersInfo){
        var ChapterId = chapter.id;
        var ChapterIndex = chapter.index;
        var ChapterName = chapter.name;
        var topicsList = '';
        for (topic of topicsInfo){
            if (topic.chapter__id == ChapterId){
                topicsList +=
                `<div class="div-row-show-topic" id="div-row-show-topic-${topic.id}" data-target="#course-contents-${topic.id}">
                    <div class="row g-1 row-show-topic" id="row-show-topic-${ChapterId}" style="cursor:pointer" data-target="#course-contents-${topic.id}">
                        <div class="col">
                            <div class="show-topic-label" id="show-topic-label-${topic.id}" data-id=${topic.id} data-index="${topic.index}">${topic.topic}</div>
                        </div>
                        <div class="col-auto">
                            <i class="fa-solid fa-square-xmark btn-remove-topic" id="btn-remove-topic-${topic.id}" data-topic="${topic.topic}" data-id="${topic.id}" data-bs-toggle="tooltip" data-bs-placement="left" data-bs-title="Remove the Topic"></i>
                        </div>
                    </div>
                    <div class="topic_list_hr"></div>
                </div>`  
                var topicContents =
                `<div class="course-contents" id="course-contents-${topic.id}">
                    <form class="editTopicContentForm" id="editTopicContentForm-${topic.id}" data-topic="${topic.id}">
                        <label for="edit_chapter-${topic.id}">Chapter:</label>
                        <select class="form-control custom-input select-chapter mb-3" id="edit_chapter-${topic.id}" data-value="${chapter.name}" data-chapter_id="${chapter.id}" form="editTopicContentForm-${topic.id}" required>
                            ${chapterOptions}
                        </select>
                        <label for="edit_topic-${topic.id}">Topic's Title:</label>
                        <input type="text" class="form-control custom-input mb-3" id="edit_topic-${topic.id}" value="${topic.topic}" form="editTopicContentForm-${topic.id}" placeholder="Name of the Topic" required/>
                        <label for="editTopicContent_editor-${topic.id}">Topic's Content:</label>
                        <textarea class="editTopicContent_editor" id="editTopicContent_editor-${topic.id}" data-id="${topic.id}" form="editTopicContentForm-${topic.id}" required>${topic.text}</textarea>
                        <button type="submit" class="btn btn-success btn-editTopicContentForm" id="btn-editTopicContentForm-${topic.id}" form="editTopicContentForm-${topic.id}" data-topic="${topic.id}">Update</button>
                    </form>
                </div>`
                $("#div-course-contents").append(topicContents);  
                $(`#edit_chapter-${topic.id}`).val(chapter.name);
                var eleId = `editTopicContent_editor-${topic.id}`;
                var dataId = topic.id;
                editTopicContent_editor[dataId] = addCkEditor(eleId, editTopicContent_editor_conf);
            }
        }
        if (!onlyAddTopic){
            var ht = 
            `<div class="offcanvas offcanvas-bottom offcanvasAddTopic" data-bs-scroll="true" data-bs-backdrop="true" id="offcanvasAddTopic-${ChapterId}">
                <div class="offcanvas-header">
                    <h5 class="offcanvas-title">Add New Topic to Chapter ${ChapterIndex}</h5>
                    <button type="button" class="btn-close btn-close-offcanvasAddTopic" data-target=".offcanvasAddTopic"></button>
                </div>
                <div class="offcanvas-body custom-scrollbar offcanvas-body-offcanvasAddTopic">
                    <form class="addTopicContentForm" id="addTopicContentForm-${chapter.id}" data-chapter="${chapter.id}">
                        <label for="add_chapter-${chapter.id}">Chapter:</label>
                        <select class="form-control custom-input select-chapter mb-3" id="add_chapter-${chapter.id}" data-value="${chapter.name}" data-chapter_id="${chapter.id}" form="addTopicContentForm-${chapter.id}" disabled required>
                            ${chapterOptions}
                        </select>
                        <label for="add_topic-${chapter.id}">Topic's Title:</label>
                        <input type="text" class="form-control custom-input mb-3" id="add_topic-${chapter.id}" form="addTopicContentForm-${chapter.id}" placeholder="Name of the Topic" required/>
                        <label for="editTopicContent_editor-${chapter.id}">Topic's Content:</label>
                        <textarea class="addTopicContent_editor" id="addTopicContent_editor-${chapter.id}" data-id="${chapter.id}" form="addTopicContentForm-${chapter.id}" required></textarea>
                        <button type="submit" class="btn btn-success btn-addTopicContentForm" id="btn-addTopicContentForm-${chapter.id}" form="addTopicContentForm-${chapter.id}" data-chapter="${chapter.id}">Publish</button>
                    </form>
                </div>
            </div>
           
            <div class="div-show-chapter" id="div-show-chapter-${ChapterId}" data-chapter_id="${ChapterId}" style="cursor:pointer">
                <div class="row g-1 row-show-chapter" data-target="#chapter_topic_list-${ChapterId}">
                    <div class="col">
                        <div class="show-chapter">
                            <div class="show-chapter-label" id="show-chapter-label-${ChapterId}" data-id=${ChapterId} data-index="${ChapterIndex}">${ChapterName}</div>
                            <div class="show-chapter-input" id="show-chapter-input-${ChapterId}">
                                <input type="text" class="form-control input-chapter-edit" name="editChapter-${ChapterId}" id="editChapter-${ChapterId}" data-id=${ChapterId} data-index="${ChapterIndex}" value="${ChapterName}" placeholder="Chapter's Name" form="editChapterForm" required>
                                <div class="text-danger editChapter-error" id="editChapter-error-${ChapterId}" style="font-size:14px;"></div>
                            </div>
                        </div>
                    </div>
                    <div class="col-auto">
                        <i class="fa-solid fa-pen-to-square btn-edit-chapter" data-chapter="${ChapterId}" data-edit="true" data-bs-toggle="tooltip" data-bs-placement="left" data-bs-title="Rename chapter"></i>
                    </div>
                    <div class="col-auto">
                        <i class="fa-solid fa-square-xmark btn-remove-chapter" id="btn-remove-chapter-${ChapterId}" data-chapter="${ChapterName}" data-id="${ChapterId}" data-bs-toggle="tooltip" data-bs-placement="left" data-bs-title="Remove the chapter"></i>
                    </div>
                </div>
                <div class="chapter_topic_list mt-2" id="chapter_topic_list-${ChapterId}">
                    <div class="topic_list_inner" id="topic_list_inner-${ChapterId}">
                        ${topicsList}
                    </div>
                    <div class="div-btn-add-topic d-flex justify-content-end align-items-center">
                        <button type="button" class="btn btn-sm btn-info btn-add-topic" data-target="#offcanvasAddTopic-${ChapterId}">Add Topic</button>
                    </div>
                </div>
                <div class="chapter_list_hr">
            </div>`
            $("#editChapterForm").append(ht);
            $(`#add_chapter-${chapter.id}`).val(chapter.name);
            var eleId = `addTopicContent_editor-${chapter.id}`;
            var dataId = chapter.id;
            addTopicContent_editor[dataId] = addCkEditor(eleId, addTopicContent_editor_conf);
        }
        if(onlyAddTopic){
            $(`#topic_list_inner-${ChapterId}`).append(topicsList);
        }
    }
}

function addNewPillsTab({chapter, tab_pills_target="#question_chapter-pills-tab", tab_contents_target="#div-show-question", active="", show=""}={}){
    var chapterIds = []
    $(".chapters-nav-item").each(function (index, member) {
        chapterIds.push($(this).data('chapter'));
    });
    if(!chapterIds.includes(chapter.chapter_id)){
        var tab = `<li class="nav-item chapters-nav-item" id="chapters-nav-item-${chapter.chapter_id}" role="presentation" data-chapter="${chapter.chapter_id}">
                    <button class="nav-link ${active}" id="question_chapter-pills-tab-${chapter.chapter_id}" data-bs-toggle="pill" data-bs-target="#question_chapter-pills-${chapter.chapter_id}" type="button" role="tab">Chapter: ${chapter.chapter_index}</button>
                </li>`
        var tabContent = `<div class="tab-pane fade ${show}" id="question_chapter-pills-${chapter.chapter_id}" role="tabpanel" tabindex="0"></div>`;
        $(tab_pills_target).append(tab);
        $(tab_contents_target).append(tabContent);
    }
}
function loadAllQuestion({questions_sets,  addNewOne=false}={}){
    var chapterOptions = $("#NewQuestionChapter").html();
    var active = '';
    var show = "";
    if(!addNewOne){
        $("#question_chapter-pills-tab").html('');
        active = 'active';
        show = "show active";
    }
    for(chapter of questions_sets){
        addNewPillsTab({chapter:chapter, active:active, show:show});
        active = '';
        show = '';
        for(question of chapter.questions){
            var h1 = '';
            var h2 = '';
            if(question.options.length > 0){
                var i = 0;
                for(option of question.options){
                    i += 1;
                    var option_correct = String(option.correct).charAt(0).toUpperCase()+String(option.correct).slice(1);
                    h1 +=
                    `<div class="row g-3">
                        <div class="col-auto d-flex align-items-center">
                            <b style="font-size:18px" class="text-secondary"><span class="sl-option sl-option-${question.id}"></span>.</b>
                        </div>
                        <div class="col">
                            <div class="option ${option_correct}" id="option-text-${option.id}">
                                ${option.text}
                            </div>
                        </div>
                    </div>`

                    h2 += 
                        `<div class="row g-2">
                            <div class="col">
                                <input type="text" class="form-control custom-input option-input ${option_correct} option-input-editQuestion option-input-editQuestion-${question.id}" data-question="${question.id}" name="editQuestionOption_${i+1}-${question.id}" id="editQuestionOption_${i+1}-${question.id}" form="editQuestionForm-${question.id}" placeholder="Option ${i+1}" value="${option.text}" maxlength="10000" data-correct="${option_correct}">
                            </div>
                            <div class="col-auto">
                                <i class="fa-solid fa-check option-right ${option_correct} option-right-editQuestion option-right-editQuestion-${question.id}" data-option="${i+1}" data-question="${question.id}"></i>
                            </div>
                        </div>`
                }
            }
            else{
                h1 =`<div class="text-answer True" id="text-answer-${question.id}">
                        ${question.text_answer}
                    </div>`

                h2 = 
                `<div class="row g-2">
                    <div class="col">
                        <input type="text" class="form-control custom-input option-input option-input-editQuestion option-input-editQuestion-${question.id}" data-question="${question.id}" name="editQuestionOption_1-${question.id}" id="editQuestionOption_1-${question.id}" form="editQuestionForm-${question.id}" placeholder="Option 1" maxlength="10000" data-correct="False">
                    </div>
                    <div class="col-auto">
                        <i class="fa-solid fa-check option-right option-right-editQuestion option-right-editQuestion-${question.id}" data-option="1" data-question="${question.id}"></i>
                    </div>
                </div>
                <div class="row g-2">
                    <div class="col">
                        <input type="text" class="form-control custom-input option-input option-input-editQuestion option-input-editQuestion-${question.id}" data-question="${question.id}" name="editQuestionOption_2-${question.id}" id="editQuestionOption_2-${question.id}" form="editQuestionForm-${question.id}" placeholder="Option 2" maxlength="10000" data-correct="False">
                    </div>
                    <div class="col-auto">
                        <i class="fa-solid fa-check option-right option-right-editQuestion option-right-editQuestion-${question.id}" data-option="2" data-question="${question.id}"></i>
                    </div>
                </div>`
            }
            if (question.hide){
                var hide_btn_icon = "fa-solid fa-eye-slash";
                var hide_btn_info = "Un-hide the question";
            }
            else{
                var hide_btn_icon = "fa-sharp fa-solid fa-eye";
                var hide_btn_info = 'Hide the question'
            }
            var is_reviewed = 'reviewed-false';
            var btn_reviews = '';
            if (question.reviews.length > 0){
                is_reviewed = 'reviewed-true';
                btn_reviews = `<div class="btn-question"><i class="fa-solid fa-message-exclamation btn-show_reviews" data-id="${question.id}" data-chapter_id="${chapter.chapter_id}" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Show Reviews" data-target="#modal-questionReviews-${question.id}"></i></div>`;
            }
            var h = `<div class="show-question show is_hide-${question.hide} ${is_reviewed}" id="${question.id}" data-is_hide="${question.hide}">
                    <div class="d-flex justify-content-end">
                        ${btn_reviews}
                        <div class="btn-question">
                            <i class="fa-sharp fa-solid fa-pen-to-square btn-open-offcanvas-questionEditForm" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Update the question" data-target="#offcanvas_edit_question-${question.id}"></i>
                        </div>
                        <div class="btn-question">
                            <i class="btn ${hide_btn_icon} btn-hide-question" data-id="${question.id}" data-chapter_id="${chapter.chapter_id}" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="${hide_btn_info}"></i>
                        </div>
                        <div class="btn-question">
                            <i class="btn fa-solid fa-trash-xmark btn-remove-question" data-id="${question.id}" data-chapter_id="${chapter.chapter_id}" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Remove the question"></i>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md text-start">
                            <h5><strong>Q: <span class="sl-question" id="sl-question-${question.id}" data-chapter="${chapter.chapter_name}" data-question="${question.id}"></span>.</strong></h5>
                        </div>
                        <div class="col-md text-end">
                            <span><b>Total Marks:</b> <span id="total_mark-${question.id}">${question.mark}</span> &nbsp;<b>|</b>&nbsp; <b>Negative Marks:</b> <span id="neg_mark-${question.id}">${question.negative_mark}</span></span>
                        </div>
                    </div>
                    <div class="question" id="question-text-${question.id}">
                        ${question.question}
                    </div>
                    <div class="options" id="options-${question.id}">
                        ${h1}
                    </div>
                    <div class="hr-question"><div>
                </div>
                <div class="offcanvas offcanvas-top offcanvas-questionForm offcanvas_edit_question" id="offcanvas_edit_question-${question.id}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"  aria-hidden="true">
                    <div class="offcanvas-header">
                        <h4 class="offcanvas-title">Edit Question No. <span class="sl-question-modal" id="sl-question-modal-${question.id}" data-chapter="${chapter.chapter_name}" data-question="${question.id}"></span></h4>
                        <button type="button" class="btn-close" data-bs-dismiss="#offcanvas_edit_question-${question.id}" aria-label="Close"></button>
                    </div>
                    <div class="offcanvas-body">
                        <div id="div_edit_question">
                            <form class="editQuestionForm" id="editQuestionForm-${question.id}" data-question="${question.id}" name="editQuestionForm-${question.id}" method="post" action="/edit-question/">
                                <div class="row mb-0 mt-0">
                                    <div class="col-auto">
                                        <div class="row g-1">
                                            <div class="col-auto">
                                                <label for="editQuestionChapter" class="form-label d-flex align-items-center mt-1"><b>Chapter:</b></label>
                                            </div>
                                            <div class="col">
                                                <select class="form-control custom-input select-chapter mb-3" name="editQuestionChapter-${question.id}" id="editQuestionChapter-${question.id}" data-value="${chapter.chapter_name}" data-chapter_id="${chapter.chapter_id}" data-question="${question.id}" form="editQuestionForm-${question.id}" required>
                                                    ${chapterOptions}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div class="row g-1 d-flex justify-content-end">
                                            <div class="col-auto">
                                                <label for="editQuestionMarks-${question.id}" class="form-label"><b>Total Marks:</b></label>
                                            </div>
                                            <div class="col-auto">
                                                <input type="number" step="0.1" class="form-control instruction-input" name="editQuestionMarks-${question.id}" id="editQuestionMarks-${question.id}" form="editQuestionForm-${question.id}" value="${question.mark}" required>
                                            </div>
                                            <div class="col-auto">
                                                <label for="editQuestionNegMarks-${question.id}" class="form-label">&nbsp;&nbsp;<b>Negative Marks:</b></label>
                                            </div>
                                            <div class="col-auto">
                                                <input type="number" step="0.1" class="form-control instruction-input" name="editQuestionNegMarks-${question.id}" id="editQuestionNegMarks-${question.id}" form="editQuestionForm-${question.id}" value="${question.negative_mark}" required>
                                            </div>
                                        </div>
                                    </div>
                                </div>                                        
                                <h5 class="text-secondary">Type the question:</h5>
                                <textarea class="editQuestion_editor" id="editQuestion_editor-${question.id}" data-id="${question.id}" form="editQuestionForm-${question.id}" required>${question.question}</textarea>
                                <div class="editQuestionOptions" style="margin-top:10px;">
                                    <ul class="nav nav-tabs" id="myTab" role="tablist">
                                        <li class="nav-item" role="presentation">
                                            <button class="nav-link btn-light btn-sm" data-bs-toggle="tab" data-bs-target="#editQuestionOptions-tab-pane-${question.id}" type="button" role="tab" aria-selected="false">Add Options (if MCQ type question)</button>
                                        </li>
                                        <li class="nav-item" role="presentation">
                                            <button class="nav-link btn-light btn-sm" data-bs-toggle="tab" data-bs-target="#editQuestionShortAnswer-tab-pane-${question.id}" type="button" role="tab" aria-selected="false">Add Short Answer</button>
                                        </li>
                                    </ul>
                                    <div class="tab-content" id="editQuestionOptionsTabContent-${question.id}" style="padding:10px;">
                                        <div class="tab-pane fade" id="editQuestionOptions-tab-pane-${question.id}" role="tabpanel" tabindex="0">
                                            <div id="option_inputs-editQuestion-${question.id}">
                                                ${h2}
                                            </div>
                                            <div class="d-flex justify-content-end">
                                                <button type="button" class="btn btn-info btn-sm btn-newOption" data-question="${question.id}" data-total_options="${question.options.length}">Add New Option</button>
                                            </div>
                                        </div>
                                        <div class="tab-pane fade" id="editQuestionShortAnswer-tab-pane-${question.id}" role="tabpanel" tabindex="0">
                                            <input type="text" class="form-control custom-input editQuestionShortAnswer" data-question="${question.id}" name="editQuestionShortAnswer-${question.id}" id="editQuestionShortAnswer-${question.id}" form="editQuestionForm-${question.id}" value="${question.text_answer}" placeholder="Type the answer for the question here" maxlength="10000">
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="offcanvas-footer">
                        <div class="d-flex justify-content-end align-items-center">
                            <button type="submit" class="btn btn-primary" id="btn-editQuestionForm-${question.id}" form="editQuestionForm-${question.id}">Update The Question</button>
                        </div>
                    </div>
                </div>`
            var question_reviews = ''
            for (review of question.reviews){
                var review_text = ' ';
                if (review.text != '' && review.text != null && review.text != undefined){
                    review_text = review.text;
                }
                question_reviews += `<tr>
                    <td scope="row" class="left-column-sticky">${review.participant__participant_id}</td>
                    <td>${review.participant__name}</td>
                    <td>${review.participant__email}</td>
                    <td style="white-space: nowrap;">${review.participant__mobile}</td>
                    <td>${review_text}</td>
                </tr>`
            }
            var questionReviews_modal = `<div class="modal fade modal-questionReviews" id="modal-questionReviews-${question.id}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <div class="modal-title" id="modal-questionReviewsLabel-${question.id}">
                                <div class="modal-title-1">Reviews of Question No <span class="sl-question-review" data-chapter="${chapter.chapter_name}"></span></div>
                                <div class="modal-title-2">Chapter <span class="question-chapter-index-label-${question.id}">${chapter.chapter_index}</span>: <span class="question-chapter-title-label-${question.id}">${chapter.chapter_name}</span></div>
                            </div>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="table-sticky-thead custom-scrollbar">
                                <table class="table table-sm table-bordered border-dark table-striped table-hover align-middle">
                                    <thead>
                                        <tr>
                                            <th scope="col" class="table-column table-sort-column left-column-sticky">Participant Id <i class="fa-solid fa-sort table-sort-icon"></i></th>
                                            <th scope="col" class="table-column table-sort-column">Name <i class="fa-solid fa-sort table-sort-icon"></i></th>
                                            <th scope="col" class="table-column table-sort-column">Email <i class="fa-solid fa-sort table-sort-icon"></i></th>
                                            <th scope="col" class="table-column table-sort-column">Mobile <i class="fa-solid fa-sort table-sort-icon"></i></th>
                                            <th scope="col" class="table-column">Review</th>
                                        </tr>
                                    </thead>
                                    <tbody id="table-review-data" class="table-review-data">
                                        ${question_reviews}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
            $(`#question_chapter-pills-${chapter.chapter_id}`).append(h);
            $(`#editQuestionChapter-${question.id}`).val(chapter.chapter_name);
            $(".all_modals").append(questionReviews_modal)
            var eleId = `editQuestion_editor-${question.id}`;
            var dataId = question.id;
            editQuestion_editor[dataId] = addCkEditor(eleId, editQuestion_editor_conf);
        }
    }
    updateQuestionSl(updateOptionSlNo=true);
}

function formatData(data){
    data = String(data)
    if(data == 'true' || data == 'True'){
        return 'Yes'
    }
    else if (data == 'false' || data == 'False') {
        return 'No'
    }
    else if (data == 'null' || data == 'undefined' || data == '') {
        return ''
    }
    return data
}

function loadAllParticipants({ participants, chapters}={}){
    var participants_row = '';
    for (i=0; i<participants.length; i++) {
        var participant = participants[i];
        var certificate_link = ``;
        if (participant.certificate_id != '' && participant.certificate_id != '0' && participant.certificate_id != null && participant.certificate_id != undefined){
            certificate_link = `<a class="certificate-lnk" target="_blank" href="/certificate/${participant.certificate_id}">View Certificate</a>`
        }
        chapters_mark_td = '';
        chapter_per_td = '';
        for (ch of participant['chapter_records']){
            pass_status = ch['status']
            percentange = ch['percentage']
            status_text_color = ''
            if (pass_status == 'Passed'){
                status_text_color = 'text-passed'
            }
            else if (pass_status == 'Failed') {
                status_text_color = 'text-failed'
            }
            if (String(percentange) != ' ') {
                percentange = `${percentange}%`
            }
            chapters_mark_td += `<td class="text-center ${status_text_color}">${ch['mark']}</td>`;
            chapter_per_td += `<td class="text-center ${status_text_color}">${percentange}</td>`;
        }
        if (participant.passed == 'Passed') {
            status_text_color = 'text-passed'
        }
        else if (participant.passed == 'Failed') {
            status_text_color = 'text-failed'
        }
        else {
            status_text_color = ''
        }
        total_percent = participant.total_percent
        if (String(total_percent) != '-') {
            total_percent = `${participant.total_percent}%`
        }
        total_score = `<td class="text-center ${status_text_color}">${participant.total_mark}</td>`;
        total_percent = `<td class="text-center ${status_text_color}">${total_percent}</td>`;
        is_passed = `<td data-td="filter_td-participant-status" class="text-center ${status_text_color}">${participant.passed}</td>`;
        if (participant.disqualified == 'Yes') {
            status_text_color = 'text-failed'
        }
        else if (participant.disqualified == 'No') {
            status_text_color = ''
        }
        else {
            status_text_color = ''
        }
        is_disqualified = `<td data-td="filter_td-participant-disqualified" class="text-center ${status_text_color}">${participant.disqualified}</td>`;
        participants_row = `<tr class="table-tr-participants-data show" id="table-tr-participants-data-${participant.id}">
            <td scope="row" class="left-column-sticky" data-td="filter_td-participant-id">${participant.participant_id}</td>
            <td data-td="filter_td-participant-name">${participant.name}</td>
            <td data-td="filter_td-participant-email">${participant.email}</td>
            <td data-td="filter_td-participant-mobile" style="white-space: nowrap;">${participant.mobile}</td>
            <td data-td="filter_td-participant-gender">${participant.gender}</td>
            <td data-td="filter_td-participant-age" class="text-center">${participant.age}</td>
            <td data-td="filter_td-participant-occupation">${participant.occupation}</td>
            ${chapters_mark_td}
            ${total_score}
            ${chapter_per_td}
            ${total_percent}
            ${is_passed}
            ${is_disqualified}
            <td class="text-center">${formatDateTime(participant.enrolled_on)}</td>
            <td class="text-center">${certificate_link}</td>
        </tr>`
        $("#table-participants-data").append(participants_row);
    }
    var total_participants = $(`.table-tr-participants-data.show`).length;
    $("#display-total-participant").html(total_participants);
    $("#display-total-participant").data('value', participants.length);
}

function participantFilterSearch(){
    var filter_values = {}
    $(".filter-input-participants").each(function (index, member) {
        var target_td = $(this).data('td');
        filter_values[target_td] = String($(this).val()).toLowerCase();
    });
    $(".table-tr-participants-data").addClass('show');
    $(".table-tr-participants-data").removeClass('hide');
    var total_participant_cnt = Number($("#display-total-participant").data('value'));
    $(".table-tr-participants-data").each(function (index, member) {
        var tr_ele = $(this);
        var eleId = $(this).attr('id');
        $(`#${eleId} td`).each(function (index, member) {
            var ele_td = $(this).data('td');
            if (filter_values[ele_td] != '' && filter_values[ele_td] != undefined && filter_values[ele_td] != null) {
                var tdString = $(this).html().toLowerCase();
                if (!(tdString.includes(filter_values[ele_td]))) {
                    tr_ele.removeClass('show');
                    tr_ele.addClass('hide');
                    total_participant_cnt -= 1;
                }
            }
        });
    });
    var total_participants = $(`.table-tr-participants-data.show`).length;
    $("#display-total-participant").html(total_participants);
}
$(document).on('keyup', '.filter-input-participants', participantFilterSearch);
$(document).on('change', '.filter-input-participants', participantFilterSearch);

function loadAllAdmins({ admins}={}){
    var admins_row = '';
    for(admin of admins){
        var remove_btn = '';
        if (admin.Username__username != $("#logged_in_username").val()){
            remove_btn = `<button type="button" class="btn text-danger btn-remove-admin" data-username="${admin.Username__username}" data-value="${admin.id}" style="font-weight:bold">Remove</button>`
        }
        admins_row = `<tr class="table-tr-admins-data" id="table-tr-admins-data-${admin.id}">
                <td scope="row" class="left-column-sticky" data-td="filter_td-admin-username">${admin.Username__username}</td>
                <td data-td="filter_td-admin-email">${admin.Username__email}</td>
                <td data-td="filter_td-admin-last_login">${formatDateTime(admin.Username__last_login)}</td>
                <td data-td="filter_td-admin-join_date">${formatDateTime(admin.Username__date_joined)}</td>
                <td data-td="filter_td-admin-joiner_username">${admin.joiner_username}</td>
                <td data-td="filter_td-admin-joiner_email">${admin.joiner_email}</td>
                <td>${remove_btn}</td>
            </tr>`
        $("#table-admins-data").append(admins_row);
    }
}

function fetchAllCmsData({hide=''}={}){
    $.ajax(
    {
        type:'GET',
            url: "/fetch-cms-data/",
        data: {
            'hide': hide,
        },
        // contentType: false,
        // processData: true,
        dataType: 'json',
        cache: false,
        success:function(response){
            loadAllQuestion({ questions_sets: response.questions.questions });
            loadAllChapters({ chaptersInfo: response.chapters, topicsInfo: response.topics });
            loadAllParticipants({ participants: response.participants, chapters: response.chapters });
            loadAllAdmins({ admins: response.admins });
        },
        error:function(){
            fetchAllCmsData();
        }
    });
}
$(document).ready(function(){
    fetchAllCmsData();
});

var varInterval_otpTimer;
OTP_Timer = function ({second=120}={}) {
    $("#btn-send-email-otp").html("Resend OTP");
    $("#btn-send-email-otp").prop('disabled', false);
    $("#otp_timer").html(`&nbsp`);
    clearInterval(varInterval_otpTimer);
    if (second > 0){
        $("#btn-send-email-otp").prop('disabled', true);
        varInterval_otpTimer = setInterval(function () {
            second -= 1;
            var displaySec = second;
            if(second < 10){
                displaySec = `0${second}`;
            }
            $("#otp_timer").html(`${displaySec}s`);
            if(second == 0){
                $("#btn-send-email-otp").prop('disabled', false);
                $("#otp_timer").html(`&nbsp`);
                clearInterval(varInterval_otpTimer);
            }
        }, 1000);
    }
    
}

$(document).on('click', "#btn-send-email-otp", function(){
    var email = $("#new-email").val();
    $("#email-otp-msg").html("&nbsp;");
    if (email != ''){
        var thisElement = $(this);
        thisElement.prop('disabled', true);
        thisElement.html("Sending");
        $("#email-otp-msg").html("&nbsp;");
        $.ajax(
        {
            type: 'POST',
            url: "/send-otp/",
            data: {
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                'email': email,
                'reason': "change_admin_email",
            },
            // contentType: false,
            // processData: false,
            dataType: 'json',
            cache: false,
            success: function (response) {
                thisElement.html("Resend OTP");
                if(response.error == '0'){
                    $("#email-otp-msg").html(`<span class="text-success">OTP sent to your entered email id.</span>`);
                    OTP_Timer();
                }
                else{
                    thisElement.prop('disabled', false);
                    $("#email-otp-msg").html(`<span class="text-danger">Failed to send the OTP. Try Again!.</span>`);
                }
            },
            error: function (response) {
                thisElement.prop('disabled', false);
                thisElement.html("Resend OTP");
                $("#email-otp-msg").html(`<span class="text-danger">Failed to send the OTP. Try Again!.</span>`);
            }
        });
    }
});

$(document).on('submit', '#form-change-email', function(event){
    event.preventDefault();
    $("#new-email-error").html("&nbsp;");
    $("#form-change-email-error").html("&nbsp;");
    $("#email-otp-msg").html("&nbsp;");
    var current_email = $(".current_email:first").html();
    var new_email = $("#new-email").val();
    if (current_email != new_email){
        $("#btn-form-change-email").prop('disabled', true);
        $("#btn-form-change-email").html("Updating...");
        let theForm = new FormData(this);
        let csrf = $('input[name=csrfmiddlewaretoken]').val()
        theForm.append('csrfmiddlewaretoken', csrf);
        $.ajax({
            type: 'POST',
            url: $(this).attr('action'),
            data: theForm,
            contentType: false,
            processData: false,
            dataType: 'json',
            cache: false,
            success: function (response) {
                $("#btn-form-change-email").prop('disabled', false);
                $("#btn-form-change-email").html("Update");
                if(response.error == '1'){
                    if (response.sameEmail || response.emailExists || response.invalidEmail){
                        $("#new-email-error").html(response.message);
                        OTP_Timer({ second: 0 });
                    }
                    else if (response.invalidOTP){
                        $("#email-otp-msg").html(`<span class="text-danger">${response.message}</span>`);
                    }
                    else{
                        $("#form-change-email-error").html(response.message);
                    }
                }
                else if(response.error == '0'){
                    OTP_Timer({ second: 0 });
                    $("#changeEmailModal").modal('hide');
                    $(".current_email").html(new_email);
                    $("#new-email").val('');
                    $("#btn-send-email-otp").html("Send OTP");
                }
            },
            error: function (response) {
                $("#btn-form-change-email").prop('disabled', false);
                $("#btn-form-change-email").html("Update");
                $("#form-change-email-error").html("Server Error! Try again.");
            }
        });
    }
    else{
        $("#new-email-error").html(`New email id can't be same as current email id.`);
    }
});

$(document).on('submit', '#form-change-password', function (event) {
    event.preventDefault();
    var hasError = false;
    $("#old-password-error").html("&nbsp;");
    $("#new-password-error").html("&nbsp;");
    $("#confirm-new-password-error").html("&nbsp;")
    $("#form-change-password-error").html("&nbsp;");
    $(".password_validation_errors").html('')
    var current_password = $("#old-password").val();
    var new_password = $("#new-password").val();
    var new_password2 = $("#confirm-new-password").val();
    if (new_password != new_password2){
        $("#confirm-new-password-error").html(`New Password and Confirm Password must be same.`);
        hasError = true;
    }
    else if (current_password == new_password){
        $("#new-password-error").html(`New Password can't be same as Current Password.`);
        hasError = true;
    }
    if (!hasError) {
        $("#btn-form-change-password").prop('disabled', true);
        $("#btn-form-change-password").html("Updating...");
        let theForm = new FormData(this);
        let csrf = $('input[name=csrfmiddlewaretoken]').val()
        theForm.append('csrfmiddlewaretoken', csrf);
        $.ajax({
            type: 'POST',
            url: $(this).attr('action'),
            data: theForm,
            contentType: false,
            processData: false,
            dataType: 'json',
            cache: false,
            success: function (response) {
                $("#btn-form-change-password").prop('disabled', false);
                $("#btn-form-change-password").html("Update");
                if (response.error == '0') {
                    logged_out = true;
                    $("#changePasswordModal").modal('hide');
                    alert("Password Changed.\nYou will be logged out, you have to login again with the new password.")
                    location.replace(response.redirect_url);
                }
                else{
                    var errors = response.error;
                    for(error of errors){
                        if (error.error_code == '001'){
                            $("#old-password-error").html(error.error_message);
                        }
                        else if (error.error_code == '002') {
                            $("#confirm-new-password-error").html(error.error_message);
                        }
                        else if (error.error_code == '003') {
                            $("#new-password-error").html(error.error_message);
                        }
                        else{
                            for (password_error of error.validation_errors){
                                $(".password_validation_errors").append(`${password_error}<br>`);
                            }
                        }
                    }
                }
            },
            error: function (response) {
                $("#btn-form-change-password").prop('disabled', false);
                $("#btn-form-change-password").html("Update");
                $("#form-change-password-error").html("Server Error! Try again.");
            }
        });
    }
});

$("#newQuestionForm").on('submit', function(event){
    event.preventDefault();
    var question = newQuestion_editor.getData();
    if(question.length > 5){
        var chapter = $("#NewQuestionChapter").val();
        var shortAnswer = $("#NewQuestionShortAnswer").val();
        var totalMarks = $("#newQuestionMarks").val();
        var negMarks = $("#newQuestionNegMarks").val();
        var options = []
        var has_one_correct = false
        $('.option-input-newQuestion').each(function (index, member) {
            var value = $(member).val();
            var correct = $(member).data('correct');
            var opt = `{"text": "${value}","correct": "${correct}"}`
            if(value != '' && value.length > 0){
                options.push(opt);
            }
            if(correct == 'True'){
                has_one_correct = true
            }
        });
        if(shortAnswer.length <= 0 && has_one_correct == false){
            showSingleButtonAlert({title:"Invalid Input", message:"Mark at least one option as correct.", buttonText:"Okay"});
        }
        else if(shortAnswer.length > 0 || options.length > 0){
            $("#btn-newQuestionForm").prop('disabled', true);
            $("#btn-newQuestionForm").html("Publishing The Question..........");
            var dataToSend = {
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                totalMarks: totalMarks,
                negMarks: negMarks,
                chapter: chapter,
                question: question,
                shortAnswer: shortAnswer,
                options: options,
            }
            $.ajax(
            {
                type:'POST',
                url: $(this).attr('action'),
                data: dataToSend,
                // contentType: false,
                // processData: true,
                dataType: 'json',
                cache: false,
                success:function(response){
                    $("#btn-newQuestionForm").prop('disabled', false);
                    $("#btn-newQuestionForm").html("Publish The Question");
                    if(response.error != '0'){
                        showSingleButtonAlert({ title: "Error", message:"Failed to add the New Question.<br>Try Again!.", buttonText:"Okay"});
                    }
                    else{
                        $(".option-input-newQuestion").val('');
                        $("#NewQuestionShortAnswer").val('');
                        $("#NewQuestionOption_1").prop('required', true);
                        $("#NewQuestionOption_2").prop('required', true);
                        $("#NewQuestionShortAnswer").prop('required', true);
                        CKEDITOR.instances.newQuestion_editor.setData('');
                        $(`.option-input-newQuestion`).data('correct', 'False');
                        $(`.option-input-newQuestion`).removeClass('True');
                        $('.option-right-newQuestion').removeClass('True');
                        loadAllQuestion({questions_sets:response.new_question, addNewOne:true});
                    }
                },
                error:function(response){
                    $("#btn-newQuestionForm").prop('disabled', false);
                    $("#btn-newQuestionForm").html("Publish The Question");
                    showSingleButtonAlert({ title: "Server Error", message:"Failed to add the New Question.<br>Try Again!.", buttonText:"Okay"});
                }
            });
        }
    }
});

$("#div-show-question").on('submit', ".editQuestionForm", function(event){
    event.preventDefault();
    var qId = $(this).data('question')
    var question = editQuestion_editor[qId].getData();
    var chapter = $(`#editQuestionChapter-${qId}`).val();
    var old_chapter_id = $(`#editQuestionChapter-${qId}`).data('chapter_id');
    var old_chapter = $(`#editQuestionChapter-${qId}`).data('value');
    var totalMarks = $(`#editQuestionMarks-${qId}`).val();
    var negMarks = $(`#editQuestionNegMarks-${qId}`).val();
    if(question.length > 5){
        var shortAnswer = $(`#editQuestionShortAnswer-${qId}`).val();
        var options = []
        var has_one_correct = false
        $(`.option-input-editQuestion-${qId}`).each(function (index, member) {
            var value = $(member).val();
            var correct = $(member).data('correct');
            var opt = `{"text": "${value}","correct": "${correct}"}`
            if(value != '' && value.length > 0){
                options.push(opt);
            }
            if(correct == 'True'){
                has_one_correct = true
            }
        });
        if(options.length > 0 && has_one_correct == false){
            showSingleButtonAlert({title:"Invalid Input", message:"Mark at least one option as correct.", buttonText:"Okay"});
        }
        else if(shortAnswer.length > 0 || options.length > 0){
            $(`#btn-editQuestionForm-${qId}`).prop('disabled', true);
            $(`#btn-editQuestionForm-${qId}`).html("Updating The Question..........");
            if(options.length > 0){
                shortAnswer = '';
            }
            var dataToSend = {
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                qId: qId,
                chapter: chapter,
                totalMarks: totalMarks,
                negMarks: negMarks,
                question: question,
                shortAnswer: shortAnswer,
                options: options,
            }
            $.ajax(
            {
                type:'POST',
                url: $(this).attr('action'),
                data: dataToSend,
                // contentType: false,
                // processData: true,
                dataType: 'json',
                cache: false,
                success:function(response){
                    $(`#btn-editQuestionForm-${qId}`).prop('disabled', false);
                    $(`#btn-editQuestionForm-${qId}`).html("Update The Question");
                    if(response.error != '0'){
                        showSingleButtonAlert({ title: "Error", message:"Failed to update the Question.<br>Try Again!.", buttonText:"Okay"});
                    }
                    else{
                        $(`#total_mark-${qId}`).html(totalMarks);
                        $(`#neg_mark-${qId}`).html(negMarks);
                        $(`#question-text-${qId}`).html(response.questionText);
                        if(response.options.length == 0){
                            h = `<div class="text-answer True" id="text-answer-${qId}">
                                    ${shortAnswer}
                                </div>`
                            $(`#options-${qId}`).html(h);
                        }
                        else{
                            $(`#options-${qId}`).html('')
                            for(i=0; i<response.options.length; i++){
                                var option = response.options[i];
                                var option_correct = String(option.correct).charAt(0).toUpperCase()+String(option.correct).slice(1);
                                var h = `<div class="row g-3">
                                        <div class="col-auto d-flex align-items-center">
                                            <b style="font-size:18px" class="text-secondary"><span class="sl-option sl-option-${qId}"></span>.</b>
                                        </div>
                                        <div class="col">
                                            <div class="option ${option_correct}" id="option-text-${option.id}">
                                                ${option.text}
                                            </div>
                                        </div>
                                    </div>`
                                $(`#options-${qId}`).append(h);
                            }
                            updateOptionSl(qId);
                        }
                        if(old_chapter != chapter){
                            $(`#offcanvas_edit_question-${qId}`).removeClass('show');
                            addNewPillsTab({chapter:response.chapter});
                            $(`#${qId}`).appendTo(`#question_chapter-pills-${response.chapter.chapter_id}`);
                            $(`#editQuestionChapter-${qId}`).val(response.chapter.chapter_name);
                            $(`#editQuestionChapter-${qId}`).data('value', response.chapter.chapter_name);
                            $(`#editQuestionChapter-${qId}`).data('chapter_id', response.chapter.chapter_id);
                            $(`#sl-question-${qId}`).data('chapter', response.chapter.chapter_name);
                            $(`#sl-question-modal-${qId}`).data('chapter', response.chapter.chapter_name);
                            $(`.question-chapter-index-label-${qId}`).html(response.chapter.chapter_index)
                            $(`.question-chapter-name-label-${qId}`).html(response.chapter.chapter_name)
                            updateQuestionSl(updateOptionSlNo=true);
                            if (response.totalQuesInChapter == 0) {
                                $(`#question_chapter-pills-${old_chapter_id}`).remove();
                                $(`#chapters-nav-item-${old_chapter_id}`).remove();
                            }
                        }
                    }
                },
                error:function(response){
                    $(`#btn-editQuestionForm-${qId}`).prop('disabled', false);
                    $(`#btn-editQuestionForm-${qId}`).html("Update The Question");
                    showSingleButtonAlert({ title: "Server Error", message:"Failed to update the Question.<br>Try Again!.", buttonText:"Okay"});
                }
            });
        }
    }
});


$(".option-input-newQuestion").on('keyup', function(){
    $("#NewQuestionShortAnswer").val('');
    $("#NewQuestionShortAnswer").prop('required', false);
    $("#NewQuestionOption_1").prop('required', true);
    $("#NewQuestionOption_2").prop('required', true);
});
$("#div-show-question").on('keyup', ".option-input-editQuestion", function(){
    var qId = $(this).data('question');
    // $(`#editQuestionShortAnswer-${qId}`).val('');
    // $(`#editQuestionShortAnswer-${qId}`).prop('required', false);
    // $(`#editQuestionOption_1-${qId}`).prop('required', true);
    // $(`#editQuestionOption_2-${qId}`).prop('required', true);
});

$("#NewQuestionShortAnswer").on('keyup', function(){
    $(".option-input-newQuestion").val('');
    $(".option-input-newQuestion").prop('required', false);
    $(`.option-input-newQuestion`).data('correct', 'False');
    $(".option-input-newQuestion").removeClass('True');
    $(".option-right-newQuestion").removeClass('True');
    $(this).prop('required', true);
});
$("#div-show-question").on('keyup', ".editQuestionShortAnswer", function(){
    var qId = $(this).data('question');
    // $(`.option-input-editQuestion-${qId}`).val('');
    // $(`.option-input-editQuestion-${qId}`).prop('required', false);
    // $(`.option-input-editQuestion-${qId}`).removeClass('True');
    // $(`.option-right-editQuestion-${qId}`).removeClass('True');
    // $(this).prop('required', true);
});

var optCount_global = 3;
$("#btn-newOption").on('click', function(){
    var newOpt = `
    <div class="row g-2">
        <div class="col">
            <input type="text" class="form-control custom-input option-input option-input-newQuestion" name="NewQuestionOption_${optCount_global}" id="NewQuestionOption_${optCount_global}" form="newQuestionForm" placeholder="Option ${optCount_global}" maxlength="10000" data-correct="False">
        </div>
        <div class="col-auto">
            <i class="fa-solid fa-check option-right option-right-newQuestion" data-option="${optCount_global}"></i>
        </div>
    </div>
    `;
    $("#option_inputs-newQuestion").append(newOpt);
    optCount_global += 1;
});
$("#div-show-question").on('click', ".btn-newOption", function(){
    var qId = $(this).data('question');
    var total_options = Number($(this).data('total_options'));
    if(total_options == 0){
        total_options = 2;
    }
    total_options += 1;
    var newOpt = `
    <div class="row g-2">
        <div class="col">
            <input type="text" class="form-control custom-input option-input option-input-editQuestion option-input-editQuestion-${qId}" data-question="${qId}" name="editQuestionOption_${total_options}-${qId}" id="editQuestionOption_${total_options}-${qId}" form="editQuestionForm-${qId}" placeholder="Option ${total_options}" maxlength="10000" data-correct="False">
        </div>
        <div class="col-auto">
            <i class="fa-solid fa-check option-right option-right-editQuestion option-right-editQuestion-${qId}" data-option="${total_options}" data-question="${qId}"></i>
        </div>
    </div>`;
    $(`#option_inputs-editQuestion-${qId}`).append(newOpt);
    $(this).data('total_options', total_options);
});

$('#option_inputs-newQuestion').on('click', '.option-right-newQuestion', function(){
    var hasclass = $(this).hasClass('True');
    if(hasclass){
        $(this).removeClass('True');
    }
    else{
        $(this).addClass('True');
    }
    var data_option = $(this).data('option');
    var data_correct = $(`#NewQuestionOption_${data_option}`).data('correct');
    if(data_correct == 'True'){
        $(`#NewQuestionOption_${data_option}`).data('correct', 'False');
        $(`#NewQuestionOption_${data_option}`).removeClass('True');
    }
    else{
        $(`#NewQuestionOption_${data_option}`).data('correct', 'True');
        $(`#NewQuestionOption_${data_option}`).addClass('True');
    }
});
$("#div-show-question").on('click', '.option-right-editQuestion', function(){
    var qId = $(this).data('question');
    $(`#editQuestionShortAnswer-${qId}`).prop('required', false);
    var hasclass = $(this).hasClass('True');
    if(hasclass){
        $(this).removeClass('True');
    }
    else{
        $(this).addClass('True');
    }
    var data_option = $(this).data('option');
    var data_correct = $(`#editQuestionOption_${data_option}-${qId}`).data('correct');
    if(data_correct == 'True'){
        $(`#editQuestionOption_${data_option}-${qId}`).data('correct', 'False');
        $(`#editQuestionOption_${data_option}-${qId}`).removeClass('True');
    }
    else{
        $(`#editQuestionOption_${data_option}-${qId}`).data('correct', 'True');
        $(`#editQuestionOption_${data_option}-${qId}`).addClass('True');
    }
});


$("#div-show-question").on('click', ".btn-remove-question", function(event){
    var thisElement = $(this)
    var questionId = thisElement.data('id');
    thisElement.removeClass('fa-solid fa-trash-xmark');
    thisElement.addClass('fa-duotone fa-spinner-third fa-spin');
    var chapter_id = $(this).data('chapter_id')
    $.ajax(
    {
        type:'POST',
        url: "/remove-question/",
        data: {
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            'id': questionId,
            'chapter_id': chapter_id,
        },
        // contentType: false,
        // processData: false,
        dataType: 'json',
        cache: false,
        success:function(response){
            thisElement.addClass('fa-solid fa-trash-xmark');
            thisElement.removeClass('fa-duotone fa-spinner-third fa-spin');
            if(response.error != '0'){
                showSingleButtonAlert({ title: "Error", message:"Failed to remove the Question.<br>Try Again!.", buttonText:"Okay"});
            }
            else{
                $(`#offcanvas_edit_question-${questionId}`).remove();
                $(`#${questionId}`).remove();
                if (response.totalQuesInChapter == 0){
                    $(`#question_chapter-pills-${chapter_id}`).remove();
                    $(`#chapters-nav-item-${chapter_id}`).remove();
                }
                else{
                    updateQuestionSl();
                }
            }
        },
        error:function(response){
            thisElement.addClass('fa-solid fa-trash-xmark');
            thisElement.removeClass('fa-duotone fa-spinner-third fa-spin');
            showSingleButtonAlert({ title: "Server Error", message:"Failed to remove the Question.<br>Try Again!.", buttonText:"Okay"});
        }
    });
});

$(document).on('click', '.btn-hide-question', function(){
    var thisElement = $(this);
    var questionId = thisElement.data('id');
    var isHide = $(`#${questionId}`).data('is_hide');
    thisElement.removeClass('fa-solid fa-eye');
    thisElement.removeClass('fa-sharp fa-solid fa-eye-slash');
    thisElement.addClass('fa-duotone fa-spinner-third fa-spin');
    var chapter_id = $(this).data('chapter_id');
    $.ajax(
    {
        type: 'POST',
        url: "/hide-question/",
        data: {
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            'id': questionId,
        },
        // contentType: false,
        // processData: false,
        dataType: 'json',
        cache: false,
        success: function (response) {
            console.log(response)
            if (isHide) {
                thisElement.addClass('fa-solid fa-eye-slash');
            }
            else {
                thisElement.addClass('fa-sharp fa-solid fa-eye');
            }
            thisElement.removeClass('fa-duotone fa-spinner-third fa-spin');
            if (response.error != '0') {
                showSingleButtonAlert({ title: "Error", message: "Failed to hide or unhide the Question.<br>Try Again!.", buttonText: "Okay" });
            }
            else {
                $(`#${questionId}`).data('is_hide', response.hide);
                if(response.hide){
                    $(`#${questionId}`).removeClass('is_hide-false');
                    $(`#${questionId}`).addClass('is_hide-true');
                    thisElement.removeClass('fa-sharp fa-solid fa-eye');
                    thisElement.addClass('fa-solid fa-eye-slash');
                    var hide_btn_tooltip = "Un-hide the question";
                }
                else{
                    $(`#${questionId}`).removeClass('is_hide-true');
                    $(`#${questionId}`).addClass('is_hide-false');
                    thisElement.removeClass('fa-solid fa-eye-slash');
                    thisElement.addClass('fa-sharp fa-solid fa-eye');
                    var hide_btn_tooltip = "Hide the question";
                }
                thisElement.tooltip('dispose');
                thisElement.attr({
                    "data-bs-toggle": "tooltip",
                    "data-bs-placement": "bottom",
                    "data-bs-title": hide_btn_tooltip,
                    "data-bs-trigger": "hover focus"
                });
            }
        },
        error: function (response) {
            if (isHide){
                thisElement.addClass('fa-solid fa-eye');
            }
            else{
                thisElement.addClass('fa-sharp fa-solid fa-eye-slash');
            }
            thisElement.removeClass('fa-duotone fa-spinner-third fa-spin');
            showSingleButtonAlert({ title: "Server Error", message: "Failed to hide or unhide the Question.<br>Try Again!.", buttonText: "Okay" });
        }
    });
});



$(document).on('click', ".btn-add-topic", function(){
    var targetEle = $(this).data('target');
    $(".offcanvasAddTopic").removeClass('show');
    $(targetEle).addClass('show');
});
$(document).on('click', '.btn-close-offcanvasAddTopic', function(){
    var targetEle = $(this).data('target');
    $(targetEle).removeClass('show');
});

$(document).on('click', ".addTopicContentForm", function(event){
    event.preventDefault();
});
$(document).on('click', ".btn-addTopicContentForm", function(){
    var thisElement = $(this);
    var chapterId = String($(this).data('chapter'));
    var topicContent = addTopicContent_editor[chapterId].getData();
    var topicName = $(`#add_topic-${chapterId}`).val();
    var chapter = $(`#add_chapter-${chapterId}`).val();
    if (topicContent != '' && String(topicContent).length > 0 && topicName != '' && String(topicName).length > 0) {
        thisElement.prop('disabled', true);
        thisElement.html("Publishing......");
        $.ajax(
        {
            type: 'POST',
            url: "/add-topic/",
            data: {
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                'name': topicName,
                'text': topicContent,
                'chapter': chapterId,
            },
            // contentType: false,
            // processData: false,
            dataType: 'json',
            cache: false,
            success: function (response) {
                if (response.error != '0') {
                    thisElement.prop('disabled', false);
                    thisElement.html('Publish');
                    showSingleButtonAlert({ title: "Error", message: "Failed to add the New Topic.<br>Try Again!.", buttonText: "Okay" });
                }
                else {
                    loadAllChapters({ chaptersInfo: response.chapterInfo, topicsInfo: response.topicInfo, onlyAddTopic: true });
                    $(`#div-row-show-topic-${response.topicInfo[0]['id']}`).click();
                    addTopicContent_editor_instance = addTopicContent_editor[chapterId];
                    addTopicContent_editor_instance.setData('')
                    // CKEDITOR.instances.addTopicContent_editor_instance.setData('');
                    $(`#add_topic-${chapterId}`).val('');
                    thisElement.prop('disabled', false);
                    thisElement.html('Publish');
                    // document.body.scrollTop = 0;
                    // document.documentElement.scrollTop = 0;
                    $(".offcanvas-body-offcanvasAddTopic").scrollTop(0);
                    $(".offcanvasAddTopic").removeClass('show');
                }
            },
            error: function (response) {
                thisElement.prop('disabled', false);
                thisElement.html('Publish');
                showSingleButtonAlert({ title: "Server Error", message: "Failed to add the New Topic.<br>Try Again!.", buttonText: "Okay" });
            }
        });
    }
});



$(document).on('submit', ".editTopicContentForm", function(event){
    event.preventDefault();
});
$(document).on('click', ".btn-editTopicContentForm", function(){
    var thisElement = $(this);
    var topicId = $(this).data("topic");
    var topicContent = editTopicContent_editor[topicId].getData();
    var topicName = $(`#edit_topic-${topicId}`).val();
    var chapter = $(`#edit_chapter-${topicId}`).val();
    if (topicContent != '' && String(topicContent).length > 0 && topicName != '' && String(topicName).length > 0) {
        thisElement.prop('disabled', true);
        thisElement.html("Updating......");
        $.ajax(
        {
            type: 'POST',
            url: "/edit-topic/",
            data: {
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                'id': topicId,
                'name': topicName,
                'text': topicContent,
                'chapter': chapter,
            },
            // contentType: false,
            // processData: false,
            dataType: 'json',
            cache: false,
            success: function (response) {
                thisElement.prop('disabled', false);
                thisElement.html('Update');
                if (response.error != '0') {
                    showSingleButtonAlert({ title: "Error", message: "Failed to edit the Topic.<br>Try Again!.", buttonText: "Okay" });
                }
                else {
                    $(`#show-topic-label-${topicId}`).html(topicName);
                    if (response.prev_chapter_id != response.new_chapter_id) {
                        $(`#row-show-topic-${response.prev_chapter_id}`).attr('id', `row-show-topic-${response.new_chapter_id}`);
                        $(`#div-row-show-topic-${topicId}`).appendTo(`#topic_list_inner-${response.new_chapter_id}`);
                    }
                }
            },
            error: function (response) {
                thisElement.prop('disabled', false);
                thisElement.html('Update');
                showSingleButtonAlert({ title: "Server Error", message: "Failed to edit the Topic.<br>Try Again!.", buttonText: "Okay" });
            }
        });
    }
});


$(document).on('click', ".btn-remove-topic", function(){
    var thisElement = $(this);
    var topicId = $(this).data('id');
    $(`#btn-remove-topic-${topicId}`).removeClass("fa-solid fa-square-xmark");
    $(`#btn-remove-topic-${topicId}`).addClass("fa-duotone fa-spinner-third fa-spin");
    $.ajax(
    {
        type: 'POST',
        url: "/remove-topic/",
        data: {
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            'topicId': topicId,
        },
        // contentType: false,
        // processData: false,
        dataType: 'json',
        cache: false,
        success: function (response) {
            if (response.error != '0') {
                $(`#btn-remove-topic-${topicId}`).addClass("fa-solid fa-square-xmark");
                $(`#btn-remove-topic-${topicId}`).removeClass("fa-duotone fa-spinner-third fa-spin");
                showSingleButtonAlert({ title: "Error", message: "Failed to remove the Topic.<br>Try again.", buttonText: "Okay" });
            }
            else {
                $(`#div-row-show-topic-${topicId}`).remove();
                $(`#course-contents-${topicId}`).remove();
            }
        },
        error: function (response) {
            $(`#btn-remove-topic-${topicId}`).addClass("fa-solid fa-square-xmark");
            $(`#btn-remove-topic-${topicId}`).removeClass("fa-duotone fa-spinner-third fa-spin");
            showSingleButtonAlert({ title: "Server Error", message: "Failed to remove the Topic.<br>Try again.", buttonText: "Okay" });
        }
    });
});


$(document).on('click', '.row-show-chapter', function(){
    $(this).toggleClass('active');
    var targetEle = $(this).data('target');
    $(targetEle).toggleClass('show');
});

$(document).on('click', '.div-row-show-topic', function(){
    $(".div-row-show-welcome").removeClass('active');
    $(".div-row-show-topic").removeClass('active');
    $(this).addClass('active');
    var div_target = $(this).data('target');
    $(".welcome-contents").hide();
    $(".course-contents").hide();
    $(div_target).show();
});
$(document).on('click', '.div-row-show-welcome', function () {
    $(".div-row-show-topic").removeClass('active');
    $(this).addClass('active');
    var div_target = $(this).data('target');
    $(".course-contents").hide();
    $(div_target).show();
});

$("#addChapterForm").on('submit', function(event){
    event.preventDefault();
    $("#btn-addChapterForm").prop('disabled', true);
    $("#btn-addChapterForm").html(`<i class="fa-regular fa-loader fa-spin"></i>`);
    $("#addChapterForm-error").html("&nbsp");
    var theForm = new FormData(this);
    var csrf = $('input[name=csrfmiddlewaretoken]').val()
    theForm.append('csrfmiddlewaretoken', csrf);
    $.ajax(
    {
        type:'POST',
        url: $(this).attr('action'),
        data: theForm,
        contentType: false,
        processData: false,
        dataType: 'json',
        cache: false,
        success:function(response){
            $("#btn-addChapterForm").prop('disabled', false);
            $("#btn-addChapterForm").html(`Add`);
            if(response.error == '0'){
                var addedNewChapter = response.chapter;
                var chapterInfo = {
                    index: addedNewChapter.index,
                    id: addedNewChapter.id,
                    name: addedNewChapter.name,
                }
                loadAllChapters({chaptersInfo:[chapterInfo]});
                $(".select-chapter").append(`<option class="option_chapter_value" value="${addedNewChapter.name}" data-id="${addedNewChapter.id}" data-index="${addedNewChapter.index}">${addedNewChapter.name}</option>`);
                $("#addChapterForm").trigger('reset');
            }
            else if(response.error == '2'){
                $("#addChapterForm-error").html(response.message);
            }
            else{
                showSingleButtonAlert({ title: "Error", message:"Failed to add the New Chapter.<br>Try Again!.", buttonText:"Okay"});
            }
        },
        error:function(response){
            $("#btn-addChapterForm").prop('disabled', false);
            $("#btn-addChapterForm").html(`Add`);
            showSingleButtonAlert({ title: "Server Error", message:"Failed to add the New Chapter.<br>Try Again!.", buttonText:"Okay"});
        }
    });
});

$(document).on("click", ".btn-edit-chapter", function(){
    var thisElement = $(this);
    var chapterId = thisElement.data("chapter");
    var isEdit = thisElement.data('edit');
    if (isEdit){
        thisElement.removeClass("fa-solid fa-pen-to-square");
        thisElement.addClass("fa-solid fa-square-check");
        $(`#show-chapter-label-${chapterId}`).hide();
        $(`#show-chapter-input-${chapterId}`).show();
        var isEdit = thisElement.data('edit', false);
    }
    else{
        $(this).prop('disabled', true);
        thisElement.removeClass("fa-solid fa-square-check");
        thisElement.addClass("fa-duotone fa-spinner-third fa-spin");
        var newName = $(`#editChapter-${chapterId}`).val();
        $.ajax(
        {
            type: 'POST',
            url: "/edit-chapter/",
            data: {
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                'chapterId': chapterId,
                'newName': newName,
            },
            // contentType: false,
            // processData: false,
            dataType: 'json',
            cache: false,
            success: function (response) {
                console.log(response)
                thisElement.prop('disabled', false);
                thisElement.removeClass(`fa-duotone fa-spinner-third fa-spin`);
                if (response.error == '0') {
                    thisElement.addClass("fa-solid fa-pen-to-square");
                    $(`#show-chapter-label-${chapterId}`).show();
                    $(`#show-chapter-input-${chapterId}`).hide();
                    $(`#show-chapter-label-${chapterId}`).html(response.new_name);
                    $(`#question_chapter-pills-tab-${chapterId}`).html(response.new_name);
                    $(`option[value="${response.prev_name}"]`).text(response.new_name);
                    $(`option[value="${response.prev_name}"]`).attr('value', response.new_name);
                    $(`[data-chapter="${response.prev_name}"]`).data('chapter', response.new_name);
                }
                else if (response.error == '1'){
                    thisElement.addClass("fa-solid fa-square-check");
                    $(`#editChapter-error-${chapterId}`).html(response.message); 
                }
                else{
                    thisElement.removeClass("fa-duotone fa-spinner-third fa-spin");
                    thisElement.addClass("fa-solid fa-square-check");
                    showSingleButtonAlert({ title: "Error", message: "Failed to edit the Chapter.<br>Try Again!.", buttonText: "Okay" });
                }
            },
            error: function (response) {
                thisElement.prop('disabled', false);
                thisElement.removeClass("fa-duotone fa-spinner-third fa-spin");
                thisElement.addClass("fa-solid fa-square-check");
                showSingleButtonAlert({ title: "Server Error", message: "Failed to edit the Chapter.<br>Try Again!.", buttonText: "Okay" });
            }
        });
    }
});


function removeChapter(ChapterId, chapterName){
    $(`#btn-remove-chapter-${ChapterId}`).removeClass("fa-solid fa-square-xmark");
    $(`#btn-remove-chapter-${ChapterId}`).addClass("fa-duotone fa-spinner-third fa-spin");
    $.ajax(
    {
        type:'POST',
        url: "/remove-chapter/",
        data: {
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            'chapterName': chapterName,
            'ChapterId': ChapterId,
        },
        // contentType: false,
        // processData: false,
        dataType: 'json',
        cache: false,
        success:function(response){
            if(response.error != '0'){
                $(`#btn-remove-chapter-${ChapterId}`).addClass("fa-solid fa-square-xmark");
                $(`#btn-remove-chapter-${ChapterId}`).removeClass("fa-duotone fa-spinner-third fa-spin");
                showSingleButtonAlert({title:"Error", message:"Failed to remove the Chapter.<br>Try again.", buttonText:"Okay"});
            }
            else{
                $(`option[value='${chapterName}']`).remove();
                $(`#div-show-chapter-${ChapterId}`).remove();
                $(`#chapters-nav-item-${ChapterId}`).remove();
                $(`#question_chapter-pills-${ChapterId}`).remove();
            }
        },
        error:function(response){
            $(`#btn-remove-chapter-${ChapterId}`).addClass("fa-solid fa-square-xmark");
            $(`#btn-remove-chapter-${ChapterId}`).removeClass("fa-duotone fa-spinner-third fa-spin");
            showSingleButtonAlert({title:"Server Error", message:"Failed to remove the Chapter.<br>Try again.", buttonText:"Okay"});
        }
    });
}
$(document).on('click', ".btn-remove-chapter", function(){
    var chapterName = $(this).data('chapter');
    var ChapterId = $(this).data('id');
    var functionToExecute = function(){
        removeChapter(ChapterId, chapterName)
    }
    var message = `If you remove the chapter (<b>${chapterName}</b>), all the topics and questions under the chapter will be removed also.`
    twoButtonAlert({message:message, buttonCloseText:'Cancel', buttonOkayText:'Confirm', functionName:functionToExecute})
});


function removeAdmin(thisElement){
    var user_id = thisElement.data('value');
    thisElement.html("Removing");
    $.ajax(
    {
        type: 'POST',
        url: "/remove-admin/",
        data: {
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            'user_id': user_id,
        },
        // contentType: false,
        // processData: false,
        dataType: 'json',
        cache: false,
        success: function (response) {
            thisElement.html("Remove");
            if(response.error == '0'){
                $(`#table-tr-admins-data-${user_id}`).remove();
            }
            else{
                showSingleButtonAlert({ title: "Warning!", message: response.message, buttonText: "Okay" });
            }
        },
        error: function (response) {
            thisElement.html("Remove");
            showSingleButtonAlert({ title: "Server Error", message: "Failed to remove the admin account.<br>Try Again!.", buttonText: "Okay" });
        }
    });
}
$(document).on('click', ".btn-remove-admin", function (event) {
    var thisElement = $(this);
    var username = thisElement.data('username');
    var functionToExecute = function () {
        removeAdmin(thisElement)
    }
    var message = `If you remove the admin (<b>${username}</b>); the admin account will be remove parmenently, and the admin can't log into the CMS further.`
    twoButtonAlert({ message: message, buttonCloseText: 'Cancel', buttonOkayText: 'Confirm', functionName: functionToExecute })
});


$(document).on('submit', "#account-registration-link-form", function (event) {
    event.preventDefault();
    $("#btn-account-registration-link-form").prop('disabled', true);
    $("#btn-account-registration-link-form").html("Sending");
    $("#registration-email-error").html("&nbsp;");
    $("#account-registration-link-form-error").html("&nbsp;");
    $.ajax(
    {
        type: 'POST',
        url: "/send-account-open-link/",
        data: {
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            'to_email': $("#registration-email").val(),
        },
        // contentType: false,
        // processData: false,
        dataType: 'json',
        cache: false,
        success: function (response) {
            $("#btn-account-registration-link-form").prop('disabled', false);
            $("#btn-account-registration-link-form").html("Send");
            if (response.error == '0') {
                $("#registration-email").val('')
            }
            else {
                $("#registration-email-error").html(response.message);
            }
        },
        error: function (response) {
            $("#btn-account-registration-link-form").prop('disabled', false);
            $("#btn-account-registration-link-form").html("Send");
            $("#account-registration-link-form-error").html("Failed to send the link. Try Again!.")
        }
    });
});

var is_review_checked = false;
var is_hide_checked = false;
var is_un_hide_checked = false;
$(document).on('change', "#filter-reviewed", function () {
    $(".show-question").hide();
    is_review_checked = $(this).is(":checked");
    if (is_review_checked) {
        $(`.reviewed-true`).show();
    }
    else {
        $(".show-question").show();
    }
    if (is_hide_checked){
        $(`.is_hide-false`).hide();
    }
    if (is_un_hide_checked) {
        $(`.is_hide-true`).hide();
    }
});
$(document).on('click', "#filter_hide-hide", function () {
    $(".show-question").hide();
    $(`.is_hide-true`).show();
    is_review_checked = $("#filter-reviewed").is(":checked");
    if (is_review_checked) {
        $(`.reviewed-false`).hide();
    }
});
$(document).on('click', "#filter_hide-un_hide", function () {
    $(".show-question").hide();
    $(`.is_hide-false`).show();
    is_review_checked = $("#filter-reviewed").is(":checked");
    if (is_review_checked) {
        $(`.reviewed-false`).hide();
    }
});

$(document).on('click', '#clear_filter-review', function(){
    $(".show-question").show();
    is_review_checked = false;
    is_hide_checked = false;
    is_un_hide_checked = false;
});
$(document).on('reset', '#form-filter-participants', function () {
    $("#table-participants-data tr").show();
});

window.onbeforeunload = function(e) {
    if(!logged_out){
        return "You text is not saved!";
    }
}

$(window).on('load', function () {
    $(".loading-image-background").hide();
    $('body').css('overflow-y', 'auto');
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
});

// fire a Create event
$('.cke_editable').on('create', '> img', function (event) {
    console.log(event.currentTarget)
    event.$currentTarget.addClass('img-fluid');
});

$('.cke_editable').on('keyup', function(event){
    console.log(this)
})