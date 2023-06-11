$("#mobile").on('keyup', function () {
    first_digit = String($(this).val())[0];
    if (first_digit == '0') {
        value = String($(this).val()).substring(1);
        $(this).val(value)
    }
});

function submitEnrollForm(event){
    event.preventDefault();
    formId = $(this).attr('id');
    // $(`input[name='enroll']`).val('0');
    enroll_value = $(`#enroll_value-${formId}`).val();
    let theForm = new FormData(document.getElementById("enrollForm1"));
    let csrf = $('input[name=csrfmiddlewaretoken]').val()
    theForm.append('csrfmiddlewaretoken', csrf);
    theForm.append('enroll', enroll_value);
    let secondForm = new FormData(document.getElementById("enrollForm2"));
    for (var pair of secondForm.entries()) {
        theForm.append(pair[0], pair[1]);
    }
    $(".btn-next").prop('disabled', true);
    $(".btn-next").html(`Please Wait <i class="fa-duotone fa-spinner fa-spin"></i>`);
    $(".error-enrollForm").html('&nbsp;');
    $.ajax({
        type: 'POST',
        url: $(this).attr('action'),
        data: theForm,
        contentType: false,
        processData: false,
        dataType: 'json',
        cache: false,
        success: function (response) {
            if (response.error == '1') {
                $(`#error-${formId}`).html(response.message);
                $(".btn-next").prop('disabled', false);
                $(".btn-next").html(`Next <i class="fa-sharp fa-solid fa-forward"></i>`);
            }
            else if (response.error == '0') {
                if (response.enrolled) {
                    location.replace(response.redirect_url);
                }
                else {
                    $(".btn-next").prop('disabled', false);
                    $(".btn-next").html(`Next <i class="fa-sharp fa-solid fa-forward"></i>`);
                    $(".card").addClass("flipped");
                }
            }
        },
        error: function (response) {
            $(`#error-${formId}`).html("Error! Try again.");
            $(".btn-next").prop('disabled', false);
            $(".btn-next").html(`Next <i class="fa-sharp fa-solid fa-forward"></i>`);
        }
    });
}
$('#enrollForm1').on('submit', submitEnrollForm);
$('#enrollForm2').on('submit', submitEnrollForm);

$("#btn-enrollForm2-prev").on('click', function () {
    $(".card").removeClass("flipped");
});