$(function(){
    var token = localStorage.getItem("token");
    if (!token) {
        window.location.href = '/login.html';
    }
    $.ajaxSetup({
        headers: {
            "Authorization": "Bearer " + token
        },
        complete: function(xhr) {
            if(xhr.status == 401){
                window.location.href = '/login.html';
            }
        }
    });

    $.get(`${API_ROOT}/api/user/user`,function(response){
        window._user = response.data;
        $('#span_user').text(_user.realName);
        console.log();
    });
    
    $('#menu_change_passwd').on('click',function(){
        $('#modal_cp').modal('show');
    });

    $('#modal_cp').on('hide.bs.modal', function (event) {
        $('#cp_params')[0].reset()
    });

    $('#cp_save').on('click',function(){
        var params = $('#cp_params').serializeToJSON();
        if (!params.password || !params.newPassword) {
            Toast.show('提示','请输入原密码和新密码');
            return;
        }
        if (params.newPassword != params.rePassword) {
            Toast.show('提示','两次输入的密码不一样');
            return;
        }
        var data = {
            userId:_user.id,
            password:params.password,
            newPassword:params.newPassword
        }
        $.ajax({
            type: 'POST',
            url: `${API_ROOT}/api/user/change-passwd`,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(data),
            dataType: 'json',
            success: function (response) {
                if (response.succeeded) {
                    $('#modal_cp').modal('hide');
                    Toast.show('提示','修改成功，请重新登录');
                    setTimeout(() => {
                        $('#menu_logout').trigger('click');
                    }, 1000);
                }
                else
                {
                    Toast.show('提示',response.errors);
                }
            },
            error: function (err) {
                console.error(err);
            }
        });
    });

    $('#cp_cancle').on('click',function(){
        $('#modal_cp').modal('hide');
    });


    $('#menu_logout').on('click',function(){
        localStorage.removeItem("token");
        window.location = "/login.html";
    })
}());