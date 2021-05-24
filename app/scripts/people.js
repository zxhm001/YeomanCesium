$(function(){
    var queryHander,boxEntity;

    var fwFields = {
        ARCHITECTURE:'建筑名称',
        NAME:'户主姓名',
        NUMBER_USER:'成员数',
        TELE:'联系方式',
        ADDRESS:'地址'
    }

    function people(){
        function clickQuery(){
            queryHander = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
            queryHander.setInputAction(function (e) {
                // 获取点击位置笛卡尔坐标
                var position = viewer.scene.pickPosition(e.position);
                if (!position) {
                    position = Cesium.Cartesian3.fromDegrees(0, 0, 0);
                }
                var scenePosition = position; // 气泡相关 2/4
                // 从笛卡尔坐标获取经纬度
                var cartographic = Cesium.Cartographic.fromCartesian(position);
                var longitude = Cesium.Math.toDegrees(cartographic.longitude);
                var latitude = Cesium.Math.toDegrees(cartographic.latitude);
                var height = cartographic.height;
                var smPoint = new SuperMap.Geometry.Point(longitude, latitude);
                Query.doSpatialQuery(smPoint, ['FC:FCFH'], function (qe) {
                    var features = qe.result.features;
                    var selFeature;
                    for (let index = 0; index < features.length; index++) {
                        const feature = features[index];
                        var top = Number(feature.data['BOTTOM']) + Number(feature.data['NEWFIELD']);
                        var bottom = Number(feature.data['BOTTOM']);
                        if (bottom < height && top > height) {
                            selFeature = feature;
                            break;
                        }
                    }
                    if (selFeature != null) {
                        showBox(selFeature,scenePosition);
                        showModal(selFeature.data['ID_6']);
                    }

                }, function (e) {
                    console.error(e);
                });
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        }

        var showModal = function(buildId)
        {
            var sql = 'id_6=\'' + buildId + '\'';
            Query.doSqlQuery(sql, ['FC:FCFH'],function(qe){
                var features = qe.result.features;
                var hus = features.length;
                var rens = 0;
                var lougao = 0;

                features.forEach(feature => {
                    rens += feature.data['NUMBER_USER'] ? Number(feature.data['NUMBER_USER']) : 0;
                    var top = Number(feature.data['BOTTOM']) + Number(feature.data['NEWFIELD']);
                    if (lougao < top) {
                        lougao = top;
                    }
                });
                $('#span_height').text(lougao + '米');
                $('#span_house').text(hus + '户');
                $('#span_person').text(rens + '人');
                $('#modal_building').modal('show');
            });
        }

        var showBox = function(feature,position)
        {
            if (boxEntity) {
                viewer.entities.remove(boxEntity);
                boxEntity = null;
            }
            Cesium.GroundPrimitive.bottomAltitude = Number(feature.data['BOTTOM']); // 矢量面贴对象的底部高程
            Cesium.GroundPrimitive.extrudeHeight = Number(feature.data['NEWFIELD']); // 矢量面贴对象的拉伸高度

            var points3D = []; // [经度, 纬度, 经度, 纬度, ...]的形式，存放楼层面上的点坐标
            var points = feature.geometry.components[0].components[0].components;
            points.forEach(point => {
                points3D.push(point.x);
                points3D.push(point.y);
            });
            boxEntity = viewer.entities.add({
                id: 'box_entity',
                polygon: {
                    hierarchy: Cesium.Cartesian3.fromDegreesArray(points3D),
                    material: new Cesium.Color(223 / 255, 199 / 255, 0 / 255, 0.4)
                },
                clampToS3M: true // 贴在S3M模型表面
            });
            if (position != null) {
                viewer.popup.showPosition(position, feature.data,fwFields);
            }
        }

        function clearQuery(){
            if (boxEntity) {
                viewer.entities.remove(boxEntity);
                boxEntity = null;
            }
            viewer.popup.show = false;
            queryHander.destroy();
            $('#modal_building').modal('hide');
        }

        return{
            clickQuery: clickQuery,
            clearQuery: clearQuery
        }
    }

    window.People = people();
}());