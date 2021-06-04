var API_ROOT = 'http://192.168.1.28:53785';
var Uniptt_POC_URL = 'ws://127.0.0.1:1338/poc'
var Uniptt_LOC_URL = 'ws://112.74.167.167:1337/loc'
var SHANGHAI_TERRAIN = 'http://192.168.1.28:8090/iserver/services/3D-SHDX/rest/realspace/datas/shanghai@tin'

$(function(){
    $('.color-picker').colorpicker();

    $('.color-picker').on('change',function(){
        $(this).css('background',$(this).val());
    });

    $('.size-picker').on('change',function(){
        var key = $(this).attr('id').replace('_input','');
        var value = $(this).val();
        SysConfig.saveConfig({key:key,value:value});
        var type = key.substr(0,key.indexOf('_'));
        SysConfig.setSize(type,value);
    });


    $('.color-picker').on('colorpickerHide',function(){
        var key = $(this).attr('id').replace('_input','');
        var value = $(this).val();
        SysConfig.saveConfig({key:key,value:value});
        var type = key.substr(0,key.indexOf('_'));
        SysConfig.setColor(type,value);
    });

    var config = function(){

        var _config = {};

        function loadConfigs()
        {
            $.get(API_ROOT + '/api/sys-config',function(response){
                if (response.succeeded) {
                    response.data.forEach(sysConfig => {
                        $('#' + sysConfig.key + '_input').val(sysConfig.value);
                        if ($('#' + sysConfig.key + '_input').hasClass('color-picker')) {
                            $('#' + sysConfig.key + '_input').trigger('change');
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

        function saveConfig(data)
        {
            $.ajax({
                type: 'POST',
                url: API_ROOT + '/api/sys-config/or-update',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(data),
                dataType: 'json',
                success: function (response) {
                    if (response.succeeded) {
                        //Toast.show('提示','保存成功');
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
        }

        function setColor(type,color){
            viewer.entities.values.forEach(entity => {
                if (entity.id.startsWith(type) && entity.label) {
                    entity.label.fillColor = Cesium.Color.fromCssColorString(color);
                }
            });
        }


        function setSize(type,size){
            viewer.entities.values.forEach(entity => {
                if (entity.id.startsWith(type) && entity.label) {
                    entity.label.font = size + 'px Helvetica';
                }
            });
        }

        return {
            loadConfigs:loadConfigs,
            saveConfig:saveConfig,
            getConfig:getConfig,
            setSize:setSize,
            setColor:setColor
        }
    }

    window.SysConfig = config();
    SysConfig.loadConfigs();
}());