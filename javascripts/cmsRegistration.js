
var varInterval_otpTimer;
OTP_Timer = function ({ second = 120 } = {}) {
    $("#btn-send-email-otp").html("Resend OTP");
    $("#btn-send-email-otp").prop('disabled', false);
    $("#otp_timer").html(`&nbsp`);
    clearInterval(varInterval_otpTimer);
    if (second > 0) {
        $("#btn-send-email-otp").prop('disabled', true);
        varInterval_otpTimer = setInterval(function () {
            second -= 1;
            var displaySec = second;
            if (second < 10) {
                displaySec = `0${second}`;
            }
            $("#otp_timer").html(`${displaySec}s`);
            if (second == 0) {
                $("#btn-send-email-otp").prop('disabled', false);
                $("#otp_timer").html(`&nbsp`);
                clearInterval(varInterval_otpTimer);
            }
        }, 1000);
    }

}

$(document).on('click', "#btn-send-email-otp", function () {
    var email = $("#new-email").val();
    $("#email-otp-msg").html("&nbsp;");
    if (email != '') {
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
                'email': $("#unique_id").val(),
                'reason': "new_admin_registration",
            },
            // contentType: false,
            // processData: false,
            dataType: 'json',
            cache: false,
            success: function (response) {
                thisElement.html("Resend OTP");
                if (response.error == '0') {
                    $("#email-otp-msg").html(`<span class="text-success">OTP sent to your email id.</span>`);
                    OTP_Timer();
                }
                else {
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


$(document).on('submit', '#cmsRegistrationForm', function (event) {
    event.preventDefault();
    var hasError = false;
    $(".error-text").html("&nbsp;");
    $("#username_error_contents").hide();
     $("#password_error_contents").hide();
    var password1 = $("#password1").val();
    var password2 = $("#password2").val();
    if (password1 != password2) {
        $("#password2-error").html(`Password and Confirm Password must be same.`);
        hasError = true;
    }
    if (!hasError) {
        $("#cmsRegistrationFormSubmit").prop('disabled', true);
        $("#cmsRegistrationFormSubmit").html("Loading...");
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
                $("#cmsRegistrationFormSubmit").prop('disabled', false);
                $("#cmsRegistrationFormSubmit").html("Submit");
                if (response.error == '0') {
                    alert("Account Created.\nNow you log into CMS.");
                    location.replace(response.redirect_url);
                }
                else {
                    var errors = response.errors;
                    for (error of errors) {
                        if (error.error_code == '001') {
                            $("#email-otp-msg").html(`<span class="text-danger">${error.message}</span>`);
                        }
                        else if (error.error_code == '002') {
                            $("#email-error").html(error.message);
                        }
                        else if (error.error_code == '003') {
                            $("#username-error").html("Username Error!");
                            var usernameErrors = '';
                            for(username_error of error.validation_errors){
                                usernameErrors += `<li>${username_error}</li>`;
                            }
                            $("#usernameErrors").html(usernameErrors);
                            $("#username_error_contents").show();
                            $("#validationErrorsModal").modal('show');
                        }
                        else if (error.error_code == '004'){
                            $("#password1-error").html("Password Error!");
                            var passwordErrors = '';
                            for (password_error of error.validation_errors) {
                                passwordErrors += `<li>${password_error}</li>`;
                            }
                            $("#passwordErrors").html(passwordErrors);
                            $("#password_error_contents").show();
                            $("#validationErrorsModal").modal('show');
                        }
                    }
                }
            },
            error: function (response) {
                $("#cmsRegistrationFormSubmit").prop('disabled', false);
                $("#cmsRegistrationFormSubmit").html("Submit");
                $("#cmsRegistrationForm-error").html("Server Error! Try again.");
            }
        });
    }
});