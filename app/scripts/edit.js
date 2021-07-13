$(function(){

    $('#modal_edit').on('show.bs.modal', function (event) {

    });

    $('#modal_edit').on('hide.bs.modal', function (event) {
        $('.edit-params')[0].reset()
    });

    $('#edit_save').on('click',function(){
        Edit.save();
    });

    $('#edit_cancle').on('click',function(){
        $('#modal_edit').modal('hide');
    });

    function edit(){
        var _type,_data,_callback;
        function showModal(type,data,callback)
        {
            _type = type;
            _data = data;
            _callback = callback;
            $('#modal_edit').modal('show');
            $('.modal-backdrop:last').show();
            $('.edit-params .form-group').hide();
            var deployDatas = Deploy.getDeployConfig();
            for (const key in deployDatas) {
                if (Object.hasOwnProperty.call(deployDatas, key)) {
                    const deployData = deployDatas[key];
                    for (let j = 0; j < deployData.length; j++) {
                        const model = deployData[j];
                        if (data.type == model.name) {
                            model.params.forEach(param => {
                                $('.edit-params-' + param).show();
                            });
                            break;
                        }
                        // else if(type == '对讲机' || type == '记录仪' ||type == '定位器')
                        // {
                        //     $('.edit-params-name').show();
                        //     $('.edit-params-license').show();
                        //     $('.edit-params-rtmpurl').show();
                        //     $('.edit-params-locationurl').show();
                        // }
                    }
                }
            }
            if (data.name) {
                $('#edit_input_name').val(data.name);
            }
            if (data.license) {
                $('#edit_input_license').val(data.license);
            }
            if (data.rtmpUrl) {
                $('#edit_input_rtmpurl').val(data.rtmpUrl);
            }
            if (data.locationUrl) {
                $('#edit_input_locationurl').val(data.locationUrl);
            }
            if (data.range) {
                $('#edit_input_range').val(data.range);
            }
            if (data.direction || data.distance || data.pitch || data.verticalFov || data.horizontalFov) {
                $('#edit_input_shed_direction').val(data.direction);
                $('#edit_input_shed_distance').val(data.distance);
                $('#edit_input_shed_angle').val(data.pitch);
                $('#edit_input_shed_vertical_fov').val(data.verticalFov);
                $('#edit_input_shed_horizontal_fov').val(data.horizontalFov);
            }
        }

        function save(){
            if (!$('.edit-params-name').is(':hidden')) {
                _data.name = $('#edit_input_name').val();
            }
            if (!$('.edit-params-license').is(':hidden')) {
                _data.license = $('#edit_input_license').val();
            }
            if (!$('.edit-params-number').is(':hidden')) {
                _data.number = $('#edit_input_number').val();
            }
            if (!$('.edit-params-rtmpurl').is(':hidden')) {
                _data.rtmpUrl = $('#edit_input_rtmpurl').val();
            }
            if (!$('.edit-params-locationurl').is(':hidden')) {
                _data.locationUrl = $('#edit_input_locationurl').val();
            }
            if (!$('.edit-params-range').is(':hidden')) {
                _data.range = $('#edit_input_range').val();
            }
            if (!$('.edit-params-shed').is(':hidden')) {
                _data.direction = $('#edit_input_shed_direction').val();
                _data.distance = $('#edit_input_shed_distance').val();
                _data.pitch = $('#edit_input_shed_angle').val();
                _data.direction = $('#edit_input_shed_direction').val();
                _data.verticalFov = $('#edit_input_shed_vertical_fov').val();
                _data.horizontalFov = $('#edit_input_shed_horizontal_fov').val();
            }
            
            var modelKey = '';
            switch (_type) {
                case '车辆':
                    modelKey = 'car';
                    break;
                case '人员':
                    modelKey = 'person';
                    break;
                case '设备':
                    modelKey = 'device';
                    break;
                case '建筑':
                    modelKey = 'building';
                    break;
                case '区域':
                    modelKey = 'region';
                    break;
                default:
                    break;
            }
            var url = API_ROOT + '/api/' + modelKey;
            var entity = viewer.entities.getById(modelKey + '_' + _data.id);
            if (entity && entity.position) {
                var cartographic = Cesium.Cartographic.fromCartesian(entity.position._value);
                var longitude = Cesium.Math.toDegrees(cartographic.longitude);
                var latitude = Cesium.Math.toDegrees(cartographic.latitude);
                if (_data.longitude) {
                    _data.longitude = longitude;
                    _data.latitude = latitude;
                    _data.height = cartographic.height;
                }
            }
            
            $.ajax({
                type: 'PUT',
                url: url,
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(_data),
                dataType: 'json',
                success: function (response) {
                    if (response.succeeded) {
                        $('#modal_edit').modal('hide');
                        if (entity && entity.label) {
                            var text = _data.name?_data.name:_data.license;
                            entity.label.text = text;
                        }
                        if (_callback) {
                            _callback(_data);
                        }
                        Toast.show('提示','修改成功');
                    }
                    else {
                        console.error(response.errors);
                    }
                    console.log(response);
                },
                error: function (err) {
                    console.error(err);
                }
            });
            
        }


        return{
            showModal:showModal,
            save:save
        }
    }

    window.Edit = edit();
}());