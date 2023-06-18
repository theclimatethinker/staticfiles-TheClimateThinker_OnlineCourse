$('#cmsLoginForm').on('submit', function(event){
    event.preventDefault();
    let theForm = new FormData(this);
    let csrf = $('input[name=csrfmiddlewaretoken]').val()
    theForm.append('csrfmiddlewaretoken', csrf);
    $("#csmloginSubmit").prop('disabled', true);
    $("#csm-login-error-message").html("&nbsp;");
    $("#username-error").html("&nbsp;");
    $("#csmloginSubmit").html(`Logging In <i class="fa-duotone fa-spinner fa-spin"></i>`)
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
            if(response.error == '1'){
                $("#csm-login-error-message").html(response.message);
                $("#csmloginSubmit").prop('disabled', false);
                $("#csmloginSubmit").html('Log In <i class="fa-solid fa-right-to-bracket"></i>');
            }
            else if(response.error == '0'){
                location.replace(response.redirect);
            }
        },
        error:function(response){
            $("#csm-login-error-message").html("Error! Try Again");
            $("#csmloginSubmit").prop('disabled', false);
            $("#csmloginSubmit").html(`Log In <i class="fa-solid fa-right-to-bracket"></i>`);
        }
    });
});


$("#send-reset-form").on('submit', function(event){
    event.preventDefault();
    var username = $("#username").val();
    $("#username-error").html("&nbsp;");
    $("#send-reset-form-error").html("&nbsp;");
    $("#btn-send-reset-form").html("Processing");
    $.ajax(
    {
        type: 'POST',
        url: "/send-password-reset-link/",
        data: {
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            email: $("#registered-email").val(),
        },
        // contentType: false,
        // processData: false,
        dataType: 'json',
        cache: false,
        success: function (response) {
            $("#btn-send-reset-form").html("Done");
            if (response.error == '0') {
                $("#resetPasswordModal").modal("hide");
                $("#passwordResetMessage").modal('show');
                $("#registered-email").val('');
            }
            else{
                $("#send-reset-form-error").html("Failed to send password reset link.");
            }
        },
        error: function (response) {
            $("#btn-send-reset-form").html("Done");
            $("#send-reset-form-error").html("Failed to send password reset link.");
        }
    });
});