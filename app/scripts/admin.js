$(function () {
    $('#menu_admin').hide();
    $('#menu_front').show();

    $('.side-navbar li').on('click', function () {
        $('.side-navbar li').removeClass('active');
        $(this).addClass('active');

        $('.content-inner>section').hide();
        var id = $(this).attr('id');
        switch (id) {
            case 'menu_project':
                $('#admin_project').show();
                ProjectAdmin.loadDatas();
                break;
            case 'menu_device':
                $('#admin_device').show();
                DeviceAdmin.init();
                break;
            case 'menu_deploy':
                $('#admin_deploy').show();
                DeployAdmin.loadDatas();
                break;
            case 'menu_user':
                $('#admin_user').show();
                UserAdmin.loadDatas();
                break;
            case 'menu_setting':
                $('#admin_setting').show();
                Setting.init();
                break;

            default:
                break;
        }
    })

    $('.content-inner>section').hide();
    $('.content-inner #admin_project').show();
}());