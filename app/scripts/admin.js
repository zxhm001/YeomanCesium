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
                break;
            case 'menu_person':
                $('#admin_person').show();
                break;
            case 'menu_device':
                $('#admin_device').show();
                break;
            case 'menu_car':
                $('#admin_car').show();
                break;
            case 'menu_user':
                $('#admin_user').show();
                break;

            default:
                break;
        }
    })

    $('.content-inner>section').hide();
    $('.content-inner #admin_project').show();
}());