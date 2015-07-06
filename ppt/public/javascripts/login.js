$(function(){
    $('#submitBtn').click(function() {
        var username = $('#username');
        var usernameVal = username.val().trim();
        var password = $('#password');
        var passwordVal = password.val().trim();
        if(!usernameVal) {
            username.focus();
            username.css('border', '1px solid #f00');
            return;
        } else {
            username.css('border', 'none');
        }

        if(!passwordVal) {
            password.focus();
            password.css('border', '1px solid #f00');
            return;
        } else {
            password.css('border', 'none');
        }
        form.submit();
        /*$.ajax({
            url: '/',
            type: 'GET',
            data: {
                username: usernameVal,
                passwordVal: passwordVal
            },
            success: function(data) {

            }
        });*/
    });

    $('#username').blur(function() {
        var val = this.value.trim();
        if(!val) {
            $(this).focus();
            $(this).css('border', '1px solid #f00');
        } else {
            $(this).css('border', 'none');
        }
    });

    $('#password').blur(function() {
        var val = this.value.trim();
        if(!val) {
            $(this).focus();
            $(this).css('border', '1px solid #f00');
        } else {
            $(this).css('border', 'none');
        }
    });
});