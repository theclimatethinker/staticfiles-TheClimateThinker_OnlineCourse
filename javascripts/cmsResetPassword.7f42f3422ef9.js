$(document).on('submit', '#resetPasswordForm', function (event) {
    event.preventDefault();
    var hasError = false;
    $("#password2-error").html("&nbsp;")
    $("#resetPasswordForm-error").html("&nbsp;");
    var current_password = $("#old-password").val();
    var new_password = $("#password1").val();
    var new_password2 = $("#password2").val();
    if (new_password != new_password2) {
        $("#password2-error").html(`New Password and Confirm Password must be same.`);
        hasError = true;
    }
    if (!hasError) {
        $("#resetPasswordFormSubmit").prop('disabled', true);
        $("#resetPasswordFormSubmit").html("Loading...");
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
                $("#resetPasswordFormSubmit").prop('disabled', false);
                $("#resetPasswordFormSubmit").html("Reset");
                if (response.error == '0') {
                    alert("Password Changed.");
                    location.replace(response.redirect_url);
                }
                else {
                    var errors = response.error;
                    for (error of errors) {
                        if (error.error_code == '002') {
                            $("#confirm-new-password-error").html(error.error_message);
                        }
                        else {
                            var passwordErrors = ''
                            for (password_error of error.validation_errors) {
                                passwordErrors += `<li>${password_error}</li>`;
                            }
                            $("#passwordErrors").html(passwordErrors);
                            $("#passwordErrorsModal").modal('show');
                        }
                    }
                }
            },
            error: function (response) {
                $("#resetPasswordFormSubmit").prop('disabled', false);
                $("#resetPasswordFormSubmit").html("Reset");
                $("#resetPasswordForm-error").html("Server Error! Try again.");
            }
        });
    }
});