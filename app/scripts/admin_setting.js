$(function(){
    $('.setting-control').on('change',function(){
        var data = {
            key:$(this).attr('id').replace('setting_',''),
            value:$(this).val()
        };
        $.ajax({
            type: 'POST',
            url: API_ROOT + '/api/sys-config/or-update',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(data),
            dataType: 'json',
            success: function (response) {
                if (response.succeeded) {
                }
                else
                {
                    console.error(response.errors);
                }
                console.log(response);
            },
            error: function (err) {
                console.error(err);
            }
        });
    });
    
    var setting = function(){
        function init(){
            $.get(API_ROOT + '/api/sys-config',function(response){
                if (response.succeeded) {
                    response.data.forEach(sysConfig => {
                        $('#setting_' + sysConfig.key).val(sysConfig.value);
                    });
                }
            });
        }
        return{
            init:init
        };
    }
    window.Setting = setting();
}());