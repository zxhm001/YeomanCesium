var outterActiveIndex, innerActiveIndex;
$(document).ready(function(){
    $('.corner-btn-group .inner .box').click(function () {
        var index = $(this).index();
        if (innerActiveIndex != null && innerActiveIndex != index) {
            $('.corner-btn-group .outter:eq(' + innerActiveIndex + ')').find('.box').animate({
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
        var selector = '.corner-btn-group .outter:eq(' + index + ')';
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
                $('.corner-btn-group .outter:eq(' + innerActiveIndex + ')').find('.box').animate({
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
                break;
            case 1:
                $('#modal_car').modal('show');
                break;
            case 2:
                $('#modal_device').modal('show');
                break;
            case 3:
                $('#modal_building').modal('show');
                break;
            case 4:
                $('#modal_region').modal('show');
                break;
            default:
                break;
        }
    })

    $('.corner-btn-group .outter .box').click(function () {
        var index = $(this).index();
        outterActiveIndex = index;

        //人员
        if ($(this).hasClass('jingcha-box')) {
            //警察
            console.log('jingcha');
        }
        else if($(this).hasClass('anbao-box'))
        {
            //安保人员
        }
        else if($(this).hasClass('xiaofang-box'))
        {
            //消防员
        }
        else if($(this).hasClass('yihu-box'))
        {
            //医护人员
        }
        //车辆
        else if($(this).hasClass('jingche-box'))
        {
            //警车
        }
        else if($(this).hasClass('xiaofangche-box'))
        {
            //消防车
        }
        else if($(this).hasClass('jiuhuche-box'))
        {
            //救护车
        }
        else if($(this).hasClass('fanzhiche-box'))
        {
            //反制车
        }
        else if($(this).hasClass('motuoche-box'))
        {
            //警用摩托
        }
        //设备
        else if($(this).hasClass('guanli-box'))
        {
            //设备管理
        }
        else if($(this).hasClass('bukongqiu-box'))
        {
            //布控球
        }
        else if($(this).hasClass('fanzhiqiang-box'))
        {
            //反制枪
        }
        else if($(this).hasClass('wurenji-box'))
        {
            //无人机
        }
        //建筑
        else if($(this).hasClass('liebiao-box'))
        {
            //建筑列表
        }
        //区域
        else if($(this).hasClass('weixian-box'))
        {
            //危险区域
        }
        else if($(this).hasClass('zhongdian-box'))
        {
            //重点区域
        }
        else if($(this).hasClass('anquan-box'))
        {
            //安全区域
        }
        //标绘
        else if($(this).hasClass('renyuan-box'))
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
        else if($(this).hasClass('quyu-box'))
        {
            //区域
            window.Deploy.showModel('region')
        }
       
    })

})