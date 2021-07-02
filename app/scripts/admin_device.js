$(function(){
    var currentId = 0;

    $('#btn_adddevice').on('click',function(){
        currentId = 0;
        $('#modal_add_device').modal('show');
    });

    $('#add_device_cancle').on('click',function(){
        $('#add_device_params')[0].reset();
        $('#modal_add_device').modal('hide');
    });

    $('#add_device_save').on('click',function(){
        var params = $('#add_device_params').serializeToJSON();
        if (!params.name || !params.license) {
            Toast.show('提示','请输入设备名称和参数');
            return;
        }
        DeviceAdmin.edit(params);
    });

    $('#modal_add_device').on('hide.bs.modal', function (event) {
        currentId = 0;
    });

    $('#btn_device_search').on('click',function(){
        DeviceAdmin.loadDatas();
    })


    var deviceAdmin = function(){
        var pageSize = 10;
        var devices = null;
        var currentPage = 1;

        function init(){
            $.get(API_ROOT + '/api/project/active-list',function(response){
                if (response.succeeded) {
                    window.projects = response.data;
                    loadDatas();

                    $('#device_input_project').empty();
                    projects.forEach(project => {
                        $('#device_input_project').append(`<option value="${project.id}">${project.name}</option>`)
                    });
                }
            })

            $.get(API_ROOT + '/api/fitting/can-bind-list',function(response){
                if (response.succeeded) {
                    $('#device_input_type').empty();
                    response.data.forEach(fitting => {
                        $('#device_input_type').append(`<option value="${fitting.name}">${fitting.name}</option>`);
                    });
                }
            });
        }

        function loadDatas(page = 1) {
            currentPage = page;
            $('#device_table tbody').empty();
            var data = {
                keyword: $('#input_device_search').val(),
                page: page,
                size: pageSize
            };
            $.ajax({
                type: 'POST',
                url: `${API_ROOT}/api/device/page-list`,
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(data),
                dataType: 'json',
                success: function (response) {
                    if (response.succeeded) {
                        devices = response.data.items;
                        var index = 1;
                        devices.forEach(device => {
                            $('#device_table tbody').append(
                                `
                                <tr>
                                <th scope="row">${index}</th>
                                <td>${device.name}</td>
                                <td>${device.license}</td>
                                <td>${device.type}</td>
                                <td>${getProjectName(device.projectId)}</td>
                                <td>${device.rtmpUrl?device.rtmpUrl:''}</td>
                                <td>${device.locationUrl?device.locationUrl:''}</td>
                                <td><span><a class="option-detail">详情</a><div role="separator" class="divider divider-vertical"></div><a class="option-delete">删除</a></span></td>
                                </tr>
                                `
                            );
                            index++;
                        });
                        setOptions();
                        showPagination(response.data);
                    }
                },
                error: function (err) {
                    console.error(err);
                }
            });
        }

        function getProjectName(id)
        {
            for (let i = 0; i < projects.length; i++) {
                if (projects[i].id == id) {
                    return projects[i].name;
                } ;
            }
        }

        function edit(params){
            var data = {
                name:params.name,
                license:params.license,
                type:params.type,
                locationUrl:params.locationurl,
                rtmpUrl:params.rtmpurl,
                projectId:params.project
            };
            if (currentId) {
                data.id = currentId;
                $.ajax({
                    type: 'PUT',
                    url: API_ROOT + '/api/device',
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(data),
                    dataType: 'json',
                    success: function (response) {
                        if (response.succeeded) {
                            loadDatas(currentPage);
                            Toast.show('提示','保存成功');
                            $('#add_device_params')[0].reset();
                            $('#modal_add_device').modal('hide');
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
            else
            {
                $.ajax({
                    type: 'POST',
                    url: API_ROOT + '/api/device',
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(data),
                    dataType: 'json',
                    success: function (response) {
                        if (response.succeeded) {
                            loadDatas();
                            Toast.show('提示','添加成功');
                            $('#add_device_params')[0].reset();
                            $('#modal_add_device').modal('hide');
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
        }

        /**
         * 设置表的操作事件
         */
        function setOptions(){
            $('#device_table .option-detail').on('click',function(){
                var tr = $(this).parent().parent().parent();
                var device = devices[tr.index()];
                currentId = device.id;
                $('#device_input_name').val(device.name);
                $('#device_input_license').val(device.license);
                $('#device_input_type').val(device.type);
                $('#device_input_project').val(device.projectId);
                $('#device_input_rtmpurl').val(device.rtmpurl);
                $('#device_input_locationurl').val(device.locationurl);
                $('#modal_add_device').modal('show');
            })

            $('#device_table .option-delete').on('click',function(){
                var tr = $(this).parent().parent().parent();
                var index = tr.index();
                $.ajax({
                    type: 'DELETE',
                    url: `${API_ROOT}/api/device/${devices[index].id}`,
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
            })
        }

        /***
         * 展示分页
         */
         function showPagination(pageData) {
            $('#device_pagination').empty();
            var preBtn = $(`<li class="page-item ${pageData.hasPrevPages ? '' : 'disabled'}">${pageData.hasPrevPages ? '<a class="page-link" href="#">上一页</a>' : '<span class="page-link">上一页</span>'}</li>`);
            pageData.hasPrevPages && preBtn.on('click',function(){
                if (pageData.pageIndex > 1) {
                    loadDatas(pageData.pageIndex - 1);
                }
            })
            $('#device_pagination').append(preBtn);
            for (let i = 0; i < pageData.totalPages; i++) {
                var pageBtn = $(`<li class="page-item ${pageData.pageIndex == (i + 1) ? 'active' : ''}">${pageData.pageIndex == (i + 1) ? '<span class="page-link">' + (i + 1) + '</span>' : '<a class="page-link" href="#">' + (i + 1) + '</a>'}</li>`);
                pageData.pageIndex != (i + 1) && pageBtn.on('click',function(){
                    loadDatas(i+1);
                });
                $('#device_pagination').append(pageBtn);
            }
            var nextBtn = $(`<li class="page-item ${pageData.hasNextPages ? '' : 'disabled'}">${pageData.hasNextPages ? '<a class="page-link" href="#">下一页</a>' : '<span class="page-link">下一页</span>'}</li>`);
            pageData.hasNextPages && nextBtn.on('click',function(){
                if (pageData.pageIndex < pageData.totalPages) {
                    loadDatas(pageData.pageIndex + 1);
                }
            })
            $('#device_pagination').append(nextBtn);
        }


        return{
            loadDatas:loadDatas,
            edit:edit,
            init:init
        };
    }

    window.DeviceAdmin = deviceAdmin();
    //DeviceAdmin.init();
}());