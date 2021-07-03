$(function(){
    var _image = '';
    var _model = '';
    var _editMode = 'add';
    var _selFitting = null;
    var _currentPage = 1;

    $('.color-picker').colorpicker();

    $('.color-picker').on('change',function(){
        $(this).css('background',$(this).val());
    });

    $('#modal_add_fitting').on('hide.bs.modal', function (event) {
        _image = '';
        _model = '';
        _selFitting = null;
    });

    $('#btn_addfitting').on('click',function(){
        _editMode = 'add';
        $('#modal_add_fitting_title').html('<i class="bi bi-file-earmark-plus-fill"></i>添加部件');
        $('#add_fitting_type').attr('disabled',false);
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
                $('#add_fitting_scale').val(1);
                $('#fg_fitting_scale').show();
                $('#add_fitting_color').val('');
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
                $('#add_fitting_scale').val(1);
                $('#fg_fitting_scale').show();
                $('#add_fitting_color').val('');
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
                $('#add_fitting_scale').val(1);
                $('#fg_fitting_scale').show();
                $('#add_fitting_color').val('');
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
                $('#add_fitting_scale').val(0);
                $('#fg_fitting_scale').hide();
                $('#add_fitting_color').val('');
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
                $('#add_fitting_scale').val(0);
                $('#fg_fitting_scale').hide();
                $('#add_fitting_color').val('#FF0000');
                $('#add_fitting_color').trigger('change');
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
        var type = $('#add_fitting_type').val();
        if ($('#add_fitting_canbind').val() == 'true') {
            _image = '';
            $('#add_fitting_image').val('');
            $('#fg_fitting_image').hide();
            _model = '';
            $('#add_fitting_model').val('');
            $('#fg_fitting_model').hide();
            $('#add_fitting_scale').val(0);
            $('#fg_fitting_scale').hide();
            $('#add_fitting_canbatch').val('false');
            $('#fg_fitting_canbatch').hide();
        }
        else
        {
            $('#fg_fitting_image').show();
            if (type != '建筑'  && type != '区域') {
                $('#fg_fitting_model').show();
                $('#add_fitting_scale').val(1);
                $('#fg_fitting_scale').show();
            }
            $('#add_fitting_canbatch').val('true');
            $('#fg_fitting_canbatch').show();
        }
    });

    $('#add_fitting_image,#add_fitting_model').on('change',function(e){
        var id = $(e.target).attr('id');
        var ends = '.png';
        if (id.endsWith('model')) {
            ends = '.glb';
        }
        var file = e.target.files[0]; //获取图片资源
        var lowerName = file.name.toLowerCase();
        if (lowerName.endsWith(ends)) {
            var formData = new FormData();
            formData.append('file', file);
            $.ajax({
                type:'POST',
                url:`${API_ROOT}/api/file/upload`,
                data:formData,
                dataType: 'json',
                processData: false,
                contentType: false, 
                success:function(response){
                    if (response.succeeded) {
                        if (ends == '.png') {
                            _image = response.data;
                        } else {
                            _model = response.data;
                        }
                        Toast.show('提示','上传成功');
                    }
                    else
                    {
                        console.error(response);
                    }
                },error:function(error){
                    console.error(error);
                }
            })
        }
        else
        {
            if (ends == '.png') {
                Toast.show('提示','请选择PNG图片文件');
                $('#add_fitting_image').val('');
                _image = '';
            } else {
                Toast.show('提示','请选择GLB模型文件');
                $('#add_fitting_model').val('');
                _model = '';
            }
            
        }
    });


    $('#add_fitting_save').on('click',function(){
        var params = $('#add_fitting_params').serializeToJSON();
        params.name = params.name.trim();
        if (!params.name) {
            Toast.show('提示','请输入部件名称');
            return;
        }

        if (_editMode == 'add') {
            params.model = _model;
            params.image = _image;
            $.ajax({
                type: 'POST',
                url: `${API_ROOT}/api/fitting`,
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(params),
                dataType: 'json',
                success: function (response) {
                    if (response.succeeded) {
                        DeployAdmin.loadDatas(_currentPage);
                        $('#add_fitting_params')[0].reset();
                        $('#modal_add_fitting').modal('hide');
                        Toast.show('提示','添加成功');
                    }
                    else
                    {
                        console.error(response.errors);
                    }
                },
                error: function (err) {
                    console.error(err);
                }
            });
        }
        else if (_editMode == 'edit') {
            _selFitting.name = params.name;
            _selFitting.hasName = params.hasName;
            _selFitting.hasLicense = params.hasLicense;
            _selFitting.canBind = params.canBind;
            _selFitting.scale = params.scale;
            _selFitting.canBatch = params.canBatch;
            _selFitting.hasLocation = params.hasLocation;
            _selFitting.hasStream = params.hasStream;
            _selFitting.hasViewshed = params.hasViewshed;
            _selFitting.color = params.color;
            _selFitting.model = _model;
            _selFitting.image = _image;
            $.ajax({
                type: 'PUT',
                url: `${API_ROOT}/api/fitting`,
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(_selFitting),
                dataType: 'json',
                success: function (response) {
                    if (response.succeeded) {
                        DeployAdmin.loadDatas(_currentPage);
                        $('#add_fitting_params')[0].reset();
                        $('#modal_add_fitting').modal('hide');
                        Toast.show('提示','修改成功');
                    }
                    else
                    {
                        console.error(response.errors);
                    }
                },
                error: function (err) {
                    console.error(err);
                }
            });
        }
    });


    $('#add_fitting_cancle').on('click',function(){
        $('#add_fitting_params')[0].reset();
        $('#modal_add_fitting').modal('hide');
    });


    var deployAdmin = function(){
        var pageSize = 10;
        var fittings = null;

        function loadDatas(page = 1) {
            _currentPage = page;
            $('#fitting_table tbody').empty();
            $.get(`${API_ROOT}/api/fitting/page-list/${page}/${pageSize}`, function (response) {
                if (response.succeeded) {
                    fittings = response.data.items;
                    var index = 1;
                    fittings.forEach(fitting => {
                        $('#fitting_table tbody').append(
                            `
                            <tr>
                                <th scope="row">${index}</th>
                                <td>${fitting.name}</td>
                                <td>${fitting.type}</td>
                                <td>${fitting.model}</td>
                                <td>${fitting.scale}</td>
                                <td>${fitting.image}</td>
                                <td>${fitting.canBind?'是':'否'}</td>
                                <td>${fitting.hasStream?'是':'否'}</td>
                                <td>${fitting.hasLocation?'是':'否'}</td>
                                <td>${fitting.hasViewshed?'是':'否'}</td>
                                <td>
                                    <span>
                                        <a class="option-edit">编辑</a>
                                        <div role="separator" class="divider divider-vertical"></div>
                                        <a class="option-delete">删除</a>
                                    </span>
                                </td>
                            </tr>
                            `
                        );
                        index++;
                    });
                    setOptions();
                    showPagination(response.data);
                }

            });
        }

        /**
         * 设置表的操作事件
         */
         function setOptions(){
            $('#fitting_table .option-delete').on('click',function(){
                var tr = $(this).parent().parent().parent();
                var index = tr.index();
                $.ajax({
                    type: 'DELETE',
                    url: `${API_ROOT}/api/fitting/${fittings[index].id}`,
                    success: function (response) {
                        if (response.succeeded) {
                            loadDatas();
                            Toast.show('提示','删除成功');
                        }
                        else
                        {
                            console.error(response);
                        }
                    },
                    error: function (err) {
                        console.error(err);
                    }
                });
            });

            $('#fitting_table .option-edit').on('click',function(){
                var tr = $(this).parent().parent().parent();
                var index = tr.index();
                _selFitting = fittings[index];
                _editMode = 'edit';
                $('#modal_add_fitting_title').html('<i class="bi bi-file-earmark-diff-fill"></i>编辑组件');
                $('#add_fitting_type').attr('disabled',true);
                $('#modal_add_fitting').modal('show');
                $('#add_fitting_name').val(_selFitting.name);
                $('#add_fitting_type').val(_selFitting.type);
                $('#add_fitting_type').trigger('change');
                $('#add_fitting_canbind').val(_selFitting.canBind+ '');
                $('#add_fitting_canbind').trigger('change');
                $('#add_fitting_hasname').val(_selFitting.hasName + '');
                $('#add_fitting_haslicense').val(_selFitting.hasLicense+ '');
                $('#add_fitting_canbatch').val(_selFitting.canBatch+ '');
                $('#add_fitting_scale').val(_selFitting.scale);
                $('#add_fitting_color').val(_selFitting.color);
                $('#add_fitting_haslocation').val(_selFitting.hasLocation+ '');
                $('#add_fitting_hasstream').val(_selFitting.hasStream+ '');
                $('#add_fitting_hasviewshed').val(_selFitting.hasViewshed+ '');
                _model = _selFitting.model;
                _image = _selFitting.image;
                $('#add_fitting_color').trigger('change');
            });
        }

        /***
         * 展示分页
         */
        function showPagination(pageData) {
            $('#fitting_pagination').empty();
            var preBtn = $(`<li class="page-item ${pageData.hasPrevPages ? '' : 'disabled'}">${pageData.hasPrevPages ? '<a class="page-link" href="#">上一页</a>' : '<span class="page-link">上一页</span>'}</li>`);
            pageData.hasPrevPages && preBtn.on('click',function(){
                if (pageData.pageIndex > 1) {
                    loadDatas(pageData.pageIndex - 1);
                }
            })
            $('#fitting_pagination').append(preBtn);
            for (let i = 0; i < pageData.totalPages; i++) {
                var pageBtn = $(`<li class="page-item ${pageData.pageIndex == (i + 1) ? 'active' : ''}">${pageData.pageIndex == (i + 1) ? '<span class="page-link">' + (i + 1) + '</span>' : '<a class="page-link" href="#">' + (i + 1) + '</a>'}</li>`);
                pageData.pageIndex != (i + 1) && pageBtn.on('click',function(){
                    loadDatas(i+1);
                });
                $('#fitting_pagination').append(pageBtn);
            }
            var nextBtn = $(`<li class="page-item ${pageData.hasNextPages ? '' : 'disabled'}">${pageData.hasNextPages ? '<a class="page-link" href="#">下一页</a>' : '<span class="page-link">下一页</span>'}</li>`);
            pageData.hasNextPages && nextBtn.on('click',function(){
                if (pageData.pageIndex < pageData.totalPages) {
                    loadDatas(pageData.pageIndex + 1);
                }
            })
            $('#fitting_pagination').append(nextBtn);
        }


        return{
            loadDatas:loadDatas
        }
    }
    window.DeployAdmin = deployAdmin();
    //DeployAdmin.loadDatas();
}());