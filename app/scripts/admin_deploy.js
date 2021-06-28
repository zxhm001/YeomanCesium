$(function(){
    var _image = '';
    var _model = '';
    var _editMode = 'add';

    $('#modal_add_fitting').on('hide.bs.modal', function (event) {
        _image = '';
        _model = '';
    });

    $('#btn_addfitting').on('click',function(){
        _editMode = 'add';
        $('#modal_add_fitting_title').html('<i class="bi bi-file-earmark-plus-fill"></i>添加部件');
        $('#modal_add_fitting').modal('show');
        $('#add_fitting_type').trigger('change');
    });

    /***
     * 类型改变时相应的参数改变
     */
    $('#add_fitting_type').on('change',function(){
        var type = $('#add_fitting_type').val();
        switch (type) {
            case '人员':
                $('#add_fitting_haslicense').val('true');
                $('#fg_fitting_haslicense').show();
                $('#add_fitting_canbind').val('false');
                $('#fg_fitting_canbind').hide();
                $('#add_fitting_canbatch').val('true');
                $('#fg_fitting_canbatch').show();
                $('#fg_fitting_model').show();
                $('#add_fitting_color').val('false');
                $('#fg_fitting_color').hide();
                $('#add_fitting_haslocation').val('false');
                $('#fg_fitting_haslocation').hide();
                $('#add_fitting_hastream').val('false');
                $('#fg_fitting_hastream').hide();
                $('#add_fitting_hasviewshed').val('false');
                $('#fg_fitting_hasviewshed').hide();
                break;
            case '车辆':
                $('#add_fitting_haslicense').val('true');
                $('#fg_fitting_haslicense').show();
                $('#add_fitting_canbind').val('false');
                $('#fg_fitting_canbind').hide();
                $('#add_fitting_canbatch').val('true');
                $('#fg_fitting_canbatch').show();
                $('#fg_fitting_model').show();
                $('#add_fitting_color').val('false');
                $('#fg_fitting_color').hide();
                $('#add_fitting_haslocation').val('true');
                $('#fg_fitting_haslocation').show();
                $('#add_fitting_hastream').val('false');
                $('#fg_fitting_hastream').hide();
                $('#add_fitting_hasviewshed').val('false');
                $('#fg_fitting_hasviewshed').hide();
                break;
            case '设备':
                $('#add_fitting_haslicense').val('true');
                $('#fg_fitting_haslicense').show();
                $('#add_fitting_canbind').val('false');
                $('#fg_fitting_canbind').show();
                $('#add_fitting_cancle').trigger('change');
                $('#add_fitting_canbatch').val('true');
                $('#fg_fitting_canbatch').show();
                $('#fg_fitting_model').show();
                $('#add_fitting_color').val('false');
                $('#fg_fitting_color').hide();
                $('#add_fitting_haslocation').val('true');
                $('#fg_fitting_haslocation').show();
                $('#add_fitting_hastream').val('true');
                $('#fg_fitting_hastream').show();
                $('#add_fitting_hasviewshed').val('true');
                $('#fg_fitting_hasviewshed').show();
                break;
            case '建筑':
                $('#add_fitting_haslicense').val('false');
                $('#fg_fitting_haslicense').hide();
                $('#add_fitting_canbind').val('false');
                $('#fg_fitting_canbind').hide();
                $('#add_fitting_canbatch').val('false');
                $('#fg_fitting_canbatch').hide();
                _model = '';
                $('#add_fitting_model').val('');
                $('#fg_fitting_model').hide();
                $('#add_fitting_color').val('false');
                $('#fg_fitting_color').hide();
                $('#add_fitting_haslocation').val('false');
                $('#fg_fitting_haslocation').hide();
                $('#add_fitting_hastream').val('false');
                $('#fg_fitting_hastream').hide();
                $('#add_fitting_hasviewshed').val('false');
                $('#fg_fitting_hasviewshed').hide();
                break;
            case '区域':
                $('#add_fitting_haslicense').val('false');
                $('#fg_fitting_haslicense').hide();
                $('#add_fitting_canbind').val('false');
                $('#fg_fitting_canbind').hide();
                $('#add_fitting_canbatch').val('false');
                $('#fg_fitting_canbatch').hide();
                _model = '';
                $('#add_fitting_model').val('');
                $('#fg_fitting_model').hide();
                $('#add_fitting_color').val('true');
                $('#fg_fitting_color').show();
                $('#add_fitting_haslocation').val('false');
                $('#fg_fitting_haslocation').hide();
                $('#add_fitting_hastream').val('false');
                $('#fg_fitting_hastream').hide();
                $('#add_fitting_hasviewshed').val('false');
                $('#fg_fitting_hasviewshed').hide();
                break;
            default:
                break;
        }
    });
    /***
     * 是否能绑定的设备改变时参数做出改变
     * 绑定到人身上的设备不需要模型，不使用标绘添加，使用管理添加
     */
    $('#add_fitting_canbind').on('change',function(){
        if ($('#add_fitting_canbind').val() == 'true') {
            _image = '';
            $('#add_fitting_image').val('');
            $('#fg_fitting_image').hide();
            _model = '';
            $('#add_fitting_model').val('');
            $('#fg_fitting_model').hide();
        }
        else
        {
            $('#fg_fitting_image').show();
            $('#fg_fitting_model').show();
        }
    });


    $('#add_fitting_save').on('click',function(){

    });


    $('#add_fitting_cancle').on('click',function(){
        $('#add_fitting_params')[0].reset();
        $('#modal_add_fitting').modal('hide');
    });


    var deployAdmin = function(){
        
        return{
        }
    }
    window.DeployAdmin = deployAdmin();
}());