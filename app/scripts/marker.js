$(function(){
    var plotting;
    var plottingLayer;
    var plotEditControl;
    var plotDrawControl;
    var inited = false;

    $('#modal_marker').on('show.bs.modal', function (event) {
        window.open('http://localhost:8090/iserver/iClient/for3D/webgl/zh/examples/webgl/plot_dynamicPlot.html')
    });

    function InitPlot(serverUrl) {
        if (!viewer) {
            return;
        }
        plottingLayer = new Cesium.PlottingLayer(viewer.scene, 'plottingLayer');
        viewer.scene.plotLayers.add(plottingLayer);

        plotEditControl = new Cesium.PlotEditControl(viewer.scene, plottingLayer);//编辑控件
        plotDrawControl = new Cesium.PlotDrawControl(viewer.scene, plottingLayer);//绘制控件
        plotDrawControl.drawControlEndEvent.addEventListener(function () {//标绘结束，激活编辑控件
            plotEditControl.activate();
        });

        plotting = Cesium.Plotting.getInstance(serverUrl, viewer.scene);
        //标绘面板
        initPlotPanel('plotPanel', serverUrl, plotDrawControl, plotEditControl, plotting);
        stylePanel = new StylePanel('stylePanel', plotEditControl, plotting);
    }

     //删除指定标号
     function deleteSeleGeo() {
        plottingLayer.removeGeoGraphicObject(plottingLayer.selectedFeature);
    }
    //“Delete”按键删除选中标号
    $(document).on('keydown',function (event) {
        if (event.keyCode === 46) {
            deleteSeleGeo();
        }
    }); 
}());