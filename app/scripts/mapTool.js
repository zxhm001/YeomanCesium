$(function(){
    var handlerHeight,handlerPolygon;

    function mapTool(){
        
        function spatialMeasure(){
            // 初始化测量高度
            if (!handlerHeight) {
                handlerHeight = new Cesium.MeasureHandler(viewer, Cesium.MeasureMode.DVH)
                var removeMeasureHeight = handlerHeight.measureEvt.addEventListener(function (result) {
                    handlerHeight.disLabel.text = '空间距离:' + result.distance + 'm';
                    handlerHeight.vLabel.text = '垂直高度:' + result.verticalHeight + 'm';
                    handlerHeight.hLabel.text = '水平距离:' + result.horizontalDistance + 'm';
                })
                var removeActiveHeight = handlerHeight.activeEvt.addEventListener(function (isActive) {
                    if (isActive == true) {
                        viewer.enableCursorStyle = false;
                        viewer._element.style.cursor = '';
                        $('body').removeClass('measureCur').addClass('measureCur');
                    } else {
                        viewer.enableCursorStyle = true;
                        $('body').removeClass('measureCur');
                    }
                })
            }
            handlerHeight.activate();
        }

        function clearMeasure()
        {
            if (handlerHeight) {
                handlerHeight.clear();
                handlerHeight.deactivate();
            }
        }

        $('#vertical-slider').on('mousedown',function(){
            $(document).on('mousemove',function(e){
                if (e.preventDefault) {
                    e.preventDefault()
                } else {
                    e.returnValue = false
                }
                $('#vertical-slider').css('left',e.clientX + 'px');
                setShutter(e.clientX / $('#cesium_container').width());
            })
        })

        $('#vertical-slider').on('mouseup',function(){
            $(document).off('mousemove');
        })


        function rollerShutter(){
            $('#vertical-slider').show();
            let verticalSlider = document.getElementById('vertical-slider');
            verticalSlider.style.display = 'block';
            setShutter(0.5);
        }

        function setShutter(startX)
        {
            var ghLayer = ScenceLayer.getLayerById('0-1-2');
            let scratchSwipeRegion = new Cesium.BoundingRectangle()
            Cesium.BoundingRectangle.unpack([startX, 0, 1, 1], 0,  scratchSwipeRegion);
            ghLayer.object.swipeEnabled = true;
            ghLayer.object.swipeRegion = scratchSwipeRegion;
        }

        function clearShutter(){
            var ghLayer = ScenceLayer.getLayerById('0-1-2');
            ghLayer.object.swipeEnabled = false;
            $('#vertical-slider').hide();
        }

        function Excavation(){
            if (!handlerPolygon) {
                handlerPolygon = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Polygon);
                handlerPolygon.enableDepthTest = false;
                handlerPolygon.activeEvt.addEventListener(function (isActive) {
                    if (isActive == true) {
                        viewer.enableCursorStyle = false;
                        viewer._element.style.cursor = '';
                        $('body').removeClass('drawCur').addClass('drawCur');
                    } else {
                        viewer.enableCursorStyle = true;
                        $('body').removeClass('drawCur');
                    }
                });
                handlerPolygon.drawEvt.addEventListener(function (result) {
                    handlerPolygon.polygon.show = false;
                    handlerPolygon.polyline.show = false;
                    var polygon = result.object;
                    var positions = polygon.positions;
                    var flatPoints = [];
                    for (var i = 0, j = positions.length; i < j; i++) { //获取经纬度和高度
                        var position = positions[i];
                        var cartographic = Cesium.Cartographic.fromCartesian(position);
                        var lon = Cesium.Math.toDegrees(cartographic.longitude);
                        var lat = Cesium.Math.toDegrees(cartographic.latitude);
                        var height = cartographic.height;
                        flatPoints.push(lon);
                        flatPoints.push(lat);
                        flatPoints.push(height);
                    }
                    var qxLayer = ScenceLayer.getLayerById('0-1-1');
                    var ghLayer = ScenceLayer.getLayerById('0-1-2');
                    var groundLayers = [qxLayer.object,ghLayer.object];
                    S3MTilesLayerUtils.addExcavationRegion(viewer, groundLayers, flatPoints, 10);
                    handlerPolygon.deactivate();
                });
            }
            handlerPolygon.activate();
        }

        function clearExcavation(){
            var qxLayer = ScenceLayer.getLayerById('0-1-1');
            var ghLayer = ScenceLayer.getLayerById('0-1-2');
            var groundLayers = [qxLayer.object,ghLayer.object];
            S3MTilesLayerUtils.removeAllExcavationRegion(viewer, groundLayers);
        }


        return{
            spatialMeasure:spatialMeasure,
            clearMeasure:clearMeasure,
            rollerShutter:rollerShutter,
            clearShutter:clearShutter,
            Excavation:Excavation,
            clearExcavation:clearExcavation
        }
    }

    window.MapTool = mapTool();
}());