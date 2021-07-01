$(function(){
    var _editMode = 'add';
    var _selUser;
    var _currentPage = 1;

    $('#modal_add_user').on('hide.bs.modal', function (event) {
        _selUser = null;
    });

    $('#btn_adduser').on('click',function(){
        _editMode = 'add';
        $('#add_user_username').attr("disabled",false);
        $('#modal_add_user_title').html('<i class="bi bi-file-earmark-plus-fill"></i>添加用户');
        $('#modal_add_user').modal('show');
    });

    $('#add_user_save').on('click',function(){
        var params = $('#add_user_params').serializeToJSON();
        if (_editMode == 'add') {
            params.userName = params.userName.trim();
            params.password = params.password.trim();
            if (!params.userName) {
                Toast.show('提示','请输入用户名');
                return;
            }
            if (!params.password) {
                Toast.show('提示','请输入密码');
                return;
            }
            $.ajax({
                type: 'POST',
                url: `${API_ROOT}/api/user`,
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(params),
                dataType: 'json',
                success: function (response) {
                    if (response.succeeded) {
                        UserAdmin.loadDatas(_currentPage);
                        $('#add_user_params')[0].reset();
                        $('#modal_add_user').modal('hide');
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
        else
        {
            _selUser.realName = params.realName;
            _selUser.password = params.password;
            _selUser.company = params.company;
            _selUser.phone = params.phone;
            $.ajax({
                type: 'PUT',
                url: `${API_ROOT}/api/user`,
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(_selUser),
                dataType: 'json',
                success: function (response) {
                    if (response.succeeded) {
                        UserAdmin.loadDatas(_currentPage);
                        $('#add_user_params')[0].reset();
                        $('#modal_add_user').modal('hide');
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

    $('#add_user_cancle').on('click',function(){
        $('#add_user_params')[0].reset();
        $('#modal_add_user').modal('hide');
    });

    var userAdmin = function(){
        var pageSize = 10;
        var users = null;

        function loadDatas(page = 1) {
            _currentPage = page;
            $('#user_table tbody').empty();
            $.get(`${API_ROOT}/api/user/page-list/${page}/${pageSize}`, function (response) {
                if (response.succeeded) {
                    users = response.data.items;
                    var index = 1;
                    users.forEach(user => {
                        $('#user_table tbody').append(
                            `
                            <tr>
                                <th scope="row">${index}</th>
                                <td>${user.userName}</td>
                                <td>${user.realName}</td>
                                <td>${user.company}</td>
                                <td>${user.phone}</td>
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
            $('#user_table .option-delete').on('click',function(){
                var tr = $(this).parent().parent().parent();
                var index = tr.index();
                $.ajax({
                    type: 'DELETE',
                    url: `${API_ROOT}/api/user/${users[index].id}`,
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

            $('#user_table .option-edit').on('click',function(){
                var tr = $(this).parent().parent().parent();
                var index = tr.index();
                _selUser = users[index];
                _editMode = 'edit';
                $('#add_user_username').attr("disabled",true);
                $('#modal_add_user_title').html('<i class="bi bi-file-earmark-diff-fill"></i>编辑用户');
                $('#modal_add_user').modal('show');
                $('#add_user_username').val(_selUser.userName);
                $('#add_user_realname').val(_selUser.realName);
                $('#add_user_company').val(_selUser.company);
                $('#add_user_phone').val(_selUser.phone);
            });
        }

        /***
         * 展示分页
         */
        function showPagination(pageData) {
            $('#user_pagination').empty();
            var preBtn = $(`<li class="page-item ${pageData.hasPrevPages ? '' : 'disabled'}">${pageData.hasPrevPages ? '<a class="page-link" href="#">上一页</a>' : '<span class="page-link">上一页</span>'}</li>`);
            pageData.hasPrevPages && preBtn.on('click',function(){
                if (pageData.pageIndex > 1) {
                    loadDatas(pageData.pageIndex - 1);
                }
            })
            $('#user_pagination').append(preBtn);
            for (let i = 0; i < pageData.totalPages; i++) {
                var pageBtn = $(`<li class="page-item ${pageData.pageIndex == (i + 1) ? 'active' : ''}">${pageData.pageIndex == (i + 1) ? '<span class="page-link">' + (i + 1) + '</span>' : '<a class="page-link" href="#">' + (i + 1) + '</a>'}</li>`);
                pageData.pageIndex != (i + 1) && pageBtn.on('click',function(){
                    loadDatas(i+1);
                });
                $('#user_pagination').append(pageBtn);
            }
            var nextBtn = $(`<li class="page-item ${pageData.hasNextPages ? '' : 'disabled'}">${pageData.hasNextPages ? '<a class="page-link" href="#">下一页</a>' : '<span class="page-link">下一页</span>'}</li>`);
            pageData.hasNextPages && nextBtn.on('click',function(){
                if (pageData.pageIndex < pageData.totalPages) {
                    loadDatas(pageData.pageIndex + 1);
                }
            })
            $('#user_pagination').append(nextBtn);
        }


        return{
            loadDatas:loadDatas
        }
    }

    window.UserAdmin = userAdmin();
    //UserAdmin.loadDatas();

}());