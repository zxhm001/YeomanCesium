var _measureLengthTool,_measureAreaTool,_triangulationTool;
var _isMeasuring = false;
$(function(){
    //长度测量
    $('#btn_measure_lenght').on('click',function(){
        clearTools();
        if (!_measureLengthTool) {
            _measureLengthTool = new Cesium.MeasureLengthTool(viewer);
        }
        if ($('#sel_measure_mode').val() == 1) {
            _measureLengthTool.isTerrain = false;
        }
        else
        {
            _measureLengthTool.isTerrain = true;
        }
        _measureLengthTool.startTool();
    });

    //面积测量
    $('#btn_measure_area').on('click',function(){
        clearTools();
        if (!_measureAreaTool) {
            _measureAreaTool = new Cesium.MeasureAreaTool(viewer);
        }
        if ($('#sel_measure_mode').val() == 1) {
            _measureAreaTool.isTerrain = false;
        }
        else
        {
            _measureAreaTool.isTerrain = true;
        }
        _measureAreaTool.startTool();
    });

    //三角测量
    $('#btn_measure_height').on('click',function(){
        clearTools();
        if (!_triangulationTool) {
            _triangulationTool = new Cesium.TriangulationTool(viewer);
        }
        _triangulationTool.startTool();
    });

    $('#sel_measure_mode').on('change',function(){
        if ($('#sel_measure_mode').val() == 1) {
            if (_measureLengthTool) {
                _measureLengthTool.isTerrain = false;
            }
            if (_measureAreaTool) {
                _measureAreaTool.isTerrain = false;
            }
            
        }
        else
        {
            if (_measureLengthTool) {
                _measureLengthTool.isTerrain = true;
            }
            if (_measureAreaTool) {
                _measureAreaTool.isTerrain = true;
            }
        }
    })

    $('#modal_measure').on('hide.bs.modal', function (event) {
        clearTools();
        _isMeasuring = false;
    });

    $('#modal_measure').on('show.bs.modal', function (event) {
        _isMeasuring = true;
    });

    function clearTools()
    {
        if (_measureLengthTool && _measureLengthTool._start) {
            _measureLengthTool.stopTool();
        }
        if (_measureAreaTool && _measureAreaTool.active) {
            _measureAreaTool.stopTool();
        }
        if (_triangulationTool) {
            _triangulationTool.stopTool();
        }
    }
})