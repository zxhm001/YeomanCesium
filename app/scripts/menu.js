var outterActiveIndex, innerActiveIndex;
$(document).ready(function(){
    $('.corner-btn-group .inner .box').click(function () {
        var index = $(this).index();
        if (innerActiveIndex != null && innerActiveIndex != index) {
            $('.corner-btn-group .outter:eq(0)').find('.box').animate({
                opacity: 0
            }, 'fast');
            $('.corner-btn-group').find('.outter-bg').animate({
                left: '202px',
                top: '202px',
                width: 0,
                height: 0
            }, 'fast')
        }
        innerActiveIndex = index;
        var selector = '.corner-btn-group .outter:eq(0)';
        if (!$(this).hasClass('active')) { //如果未处于active状态，则切换到active状态
            $(this).addClass('active').siblings().removeClass('active');
            if (index == 5) {
                $(selector).addClass('active').siblings().removeClass('active');
                $('.corner-btn-group').find('.outter-bg').addClass('active').animate({
                    left: '13px',
                    top: 0,
                    width: '404px',
                    height: '404px'
                });
                $(selector).find('.box').animate({
                    opacity: 1
                }, 2000);
            }
            
        } else { //否则去掉active状态，同时外部的按钮和背景也取消掉active状态
            $(this).removeClass('active');
            if (index == 5) {
                $(selector).removeClass('active');
                $('.corner-btn-group').find('.outter-bg').removeClass('active');
                $('.corner-btn-group .outter:eq(0)').find('.box').animate({
                    opacity: 0
                }, 'fast');
                $('.corner-btn-group').find('.outter-bg').animate({
                    left: '202px',
                    top: '202px',
                    width: 0,
                    height: 0
                }, 'fast')
            }
        }
        switch (index) {
            case 0:
                $('#modal_person').modal('show');
                $('#modal_car').modal('hide');
                $('#modal_device').modal('hide');
                $('#modal_building').modal('hide');
                $('#modal_region').modal('hide');
                break;
            case 1:
                $('#modal_car').modal('show');
                $('#modal_person').modal('hide');
                $('#modal_device').modal('hide');
                $('#modal_building').modal('hide');
                $('#modal_region').modal('hide');
                break;
            case 2:
                $('#modal_device').modal('show');
                $('#modal_person').modal('hide');
                $('#modal_car').modal('hide');
                $('#modal_building').modal('hide');
                $('#modal_region').modal('hide');
                break;
            case 3:
                $('#modal_building').modal('show');
                $('#modal_person').modal('hide');
                $('#modal_car').modal('hide');
                $('#modal_device').modal('hide');
                $('#modal_region').modal('hide');
                break;
            case 4:
                $('#modal_region').modal('show');
                $('#modal_person').modal('hide');
                $('#modal_car').modal('hide');
                $('#modal_device').modal('hide');
                $('#modal_building').modal('hide');
                break;
            default:
                break;
        }
    })

    $('.corner-btn-group .outter .box').click(function () {
        var index = $(this).index();
        outterActiveIndex = index;
        if($(this).hasClass('renyuan-box'))
        {
            //人员
            window.Deploy.showModel('person')
        }
        else if($(this).hasClass('cheliang-box'))
        {
            //车辆
            window.Deploy.showModel('car')
        }
        else if($(this).hasClass('shebei-box'))
        {
            //设备
            window.Deploy.showModel('device')
        }
        else if($(this).hasClass('jianzhu-box'))
        {
            //设备
            window.Deploy.showModel('building')
        }
        else if($(this).hasClass('quyu-box'))
        {
            //区域
            window.Deploy.showModel('region')
        }
        else if($(this).hasClass('celiang-box'))
        {
            //测量
            $('#modal_measure').modal('show');
            $('#modal_deploy').modal('hide');
            $('#modal_region').modal('hide');
            $('#modal_person').modal('hide');
            $('#modal_car').modal('hide');
            $('#modal_device').modal('hide');
            $('#modal_building').modal('hide');
        }
       
    })

})