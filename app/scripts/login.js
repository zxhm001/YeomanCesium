$(function(){
    $('#login_btn').on('click',function(){
        var params = $('#login_form').serializeToJSON();
        $.ajax({
            type: 'POST',
            url: `${API_ROOT}/api/user/login`,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(params),
            dataType: 'json',
            success: function (response) {
                if (response.succeeded) {
                    localStorage.setItem('token', response.data);
                    window.location = '/';
                }
                else
                {
                    setError(response.errors);
                }
            },
            error: function (err) {
                setError(err);
            }
        });
    })

    $(document).on('keydown',function(event){
        if (event.key == 'Enter') {
            $('#login_btn').trigger('click');
        }
    });

    function setError(text)
    {
        $('#error_label').text(text);
    }
}())