$(function () {

    //当前图片
    var image = '';

    $('#btn_addproject').on('click',function(){
        $('#modal_add_project').modal('show');
    });

    $('#add_project_save').on('click',function(){
        var params = $('#add_project_params').serializeToJSON();
        params.name = params.name.trim();
        params.scence = params.scence.trim();
        if (!image) {
            Toast.show('提示','请上传图片');
            return;
        }
        if (!params.name) {
            Toast.show('提示','请输入项目名字');
            return;
        }
        var reg=/(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/;
        if (!reg.test(params.scence)) {
            Toast.show('提示','场景URL应该是一个网址');
            return;
        }
        params.image = image;
        $.ajax({
            type: 'POST',
            url: `${API_ROOT}/api/project`,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(params),
            dataType: 'json',
            success: function (response) {
                if (response.succeeded) {
                    ProjectAdmin.loadDatas();
                    $('#add_project_params')[0].reset();
                    $('#modal_add_project').modal('hide');
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
    });

    $('#add_project_cancle').on('click',function(){
        $('#add_project_params')[0].reset();
        $('#modal_add_project').modal('hide');
    });

    $('#add_project_image').on('change',function(e){
        var file = e.target.files[0]; //获取图片资源
        var lowerName = file.name.toLowerCase();
        if (lowerName.endsWith('.jpg') || lowerName.endsWith('.png')) {
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
                        image = response.data;
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
            Toast.show('提示','请选择图片文件');
            $('#add_project_image').val('');
            image = '';
        }
    });

    var projectAdmin = function () {
        var pageSize = 10;
        var projects = null;
        var currentPage = 1;

        function loadDatas(page = 1) {
            currentPage = page;
            $('#project_table tbody').empty();
            $.get(`${API_ROOT}/api/project/page-list/${page}/${pageSize}`, function (response) {
                if (response.succeeded) {
                    projects = response.data.items;
                    var index = 1;
                    projects.forEach(project => {
                        $('#project_table tbody').append(
                            `
                            <tr>
                                <th scope="row">${index}</th>
                                <td>${project.name}</td>
                                <td>${project.scence}</td>
                                <td>${project.isActive ? '是' : '否'}</td>
                                <td><span><a class="option-active">${project.isActive ? '停止' : '激活'}</a><div role="separator" class="divider divider-vertical"></div><a class="option-delete">删除</a></span></td>
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
            $('.option-active').on('click',function(){
                var tr = $(this).parent().parent().parent();
                var index = tr.index();
                var text = $(this).text();
                if (text == '激活') {
                    $.post(`${API_ROOT}/api/project/set-active/${projects[index].id}`,function(response){
                        if (response.succeeded) {
                            loadDatas(currentPage);
                        }
                        else
                        {
                            console.error(response);
                        }
                    })
                }
                else if (text == '停止') {
                    $.post(`${API_ROOT}/api/project/set-deactive/${projects[index].id}`,function(response){
                        if (response.succeeded) {
                            loadDatas(currentPage);
                        }
                        else
                        {
                            console.error(response);
                        }
                    })
                }
            });

            $('.option-delete').on('click',function(){
                var tr = $(this).parent().parent().parent();
                var index = tr.index();
                $.ajax({
                    type: 'DELETE',
                    url: `${API_ROOT}/api/project/${projects[index].id}`,
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
            $('#project_pagination').empty();
            var preBtn = $(`<li class="page-item ${pageData.hasPrevPages ? '' : 'disabled'}">${pageData.hasPrevPages ? '<a class="page-link" href="#">上一页</a>' : '<span class="page-link">上一页</span>'}</li>`);
            pageData.hasPrevPages && preBtn.on('click',function(){
                if (pageData.pageIndex > 1) {
                    loadDatas(pageData.pageIndex - 1);
                }
            })
            $('#project_pagination').append(preBtn);
            for (let i = 0; i < pageData.totalPages; i++) {
                var pageBtn = $(`<li class="page-item ${pageData.pageIndex == (i + 1) ? 'active' : ''}">${pageData.pageIndex == (i + 1) ? '<span class="page-link">' + (i + 1) + '</span>' : '<a class="page-link" href="#">' + (i + 1) + '</a>'}</li>`);
                pageData.pageIndex != (i + 1) && pageBtn.on('click',function(){
                    loadDatas(i+1);
                });
                $('#project_pagination').append(pageBtn);
            }
            var nextBtn = $(`<li class="page-item ${pageData.hasNextPages ? '' : 'disabled'}">${pageData.hasNextPages ? '<a class="page-link" href="#">下一页</a>' : '<span class="page-link">下一页</span>'}</li>`);
            pageData.hasNextPages && nextBtn.on('click',function(){
                if (pageData.pageIndex < pageData.totalPages) {
                    loadDatas(pageData.pageIndex + 1);
                }
            })
            $('#project_pagination').append(nextBtn);
        }

        return {
            loadDatas: loadDatas
        };
    }

    window.ProjectAdmin = projectAdmin();
    ProjectAdmin.loadDatas();
}());