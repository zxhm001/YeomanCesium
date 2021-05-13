function init(){
    window.viewer = new Cesium.Viewer('cesium_container',{
        infoBox: false,
    });

    viewer.showLayer = new LayerCollection(viewer);
    viewer.popup = new Popup(viewer);

    $('.corner-btn-group .inner .box').on('click',function () {
        var index = $(this).index();
        switch (index) {
            case 0:
                $('#modal_layer').modal('show')
                break;
            case 1:
                if ($(this).hasClass('active')) {
                    $(this).removeClass('active');
                    MapTool.clearShutter();
                }
                else
                {
                    $(this).addClass('active');
                    MapTool.rollerShutter();
                }
                break;
            case 2:
                if ($(this).hasClass('active')) {
                    $(this).removeClass('active');
                    MapTool.clearExcavation();
                }
                else
                {
                    $(this).addClass('active');
                    MapTool.Excavation();
                }
                break;
            case 3:
                if ($(this).hasClass('active')) {
                    $(this).removeClass('active');
                    People.clearQuery();
                }
                else
                {
                    $(this).addClass('active');
                    People.clickQuery();
                }
                break;
            case 4:
                if ($(this).hasClass('active')) {
                    $(this).removeClass('active');
                    Pipe.clearQuery();
                }
                else
                {
                    $(this).addClass('active');
                    Pipe.clickQuery();
                }
                break;
            case 5:
                if ($(this).hasClass('active')) {
                    $(this).removeClass('active');
                    MapTool.clearMeasure();
                }
                else
                {
                    $(this).addClass('active');
                    MapTool.spatialMeasure();
                }
                break;
            default:
                break;
        }
    });

    ScenceLayer.init();
}

if (typeof Cesium !== 'undefined') {
    window.startupCalled = true;
    init(Cesium);
}