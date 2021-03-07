var API_ROOT = 'http://localhost:53785';

$(function(){
    $('#config_input_mlcolor').colorpicker();
    $('#config_input_blcolor').colorpicker();
    $('#config_save').on('click',function(){
        SysConfig.saveConfig();
    })

    var config = function(){

        var _config = {};

        function loadConfigs()
        {
            $.get(API_ROOT + '/api/sys-config',function(response){
                if (response.succeeded) {
                    response.data.forEach(sysConfig => {
                        switch (sysConfig.key) {
                            case 'model_label_size':
                                $('#config_input_mlsize').val(sysConfig.value);
                                break;
                            case 'model_label_color':
                                $('#config_input_mlcolor').val(sysConfig.value);
                                break;
                            case 'building_label_size':
                                $('#config_input_blsize').val(sysConfig.value);
                                break;
                            case 'building_label_color':
                                $('#config_input_blcolor').val(sysConfig.value);
                                break;
                            default:
                                break;
                        }
                        _config[sysConfig.key] = sysConfig.value;
                    });
                }
            });
        }

        function getConfig()
        {
            return _config;
        }

        function saveConfig()
        {
            var datas = [
                {
                    key:'model_label_size',
                    value:$('#config_input_mlsize').val()
                },
                {
                    key:'model_label_color',
                    value:$('#config_input_mlcolor').val()
                },
                {
                    key:'building_label_size',
                    value:$('#config_input_blsize').val()
                },
                {
                    key:'building_label_color',
                    value:$('#config_input_blcolor').val()
                },
            ]
            datas.forEach(data => {
                $.ajax({
                    type: 'POST',
                    url: API_ROOT + '/api/sys-config/or-update',
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(data),
                    dataType: 'json',
                    success: function (response) {
                        if (response.succeeded) {
                            Toast.show('提示','保存成功');
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
        }

        return {
            loadConfigs:loadConfigs,
            saveConfig:saveConfig,
            getConfig:getConfig
        }
    }

    window.SysConfig = config();

    SysConfig.loadConfigs();
}());