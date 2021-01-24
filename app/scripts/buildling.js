$(function () {
    var zTreeObj;

    $('#modal_building').on('show.bs.modal', function (event) {
        Building.showBuildingTree(); 
    });

    $('#modal_building').on('hide.bs.modal', function (event) {
        viewer.dataSources.removeAll();
    });

    $('#btn_building_marker').on('click',function(){
        var nodes = zTreeObj.getSelectedNodes();
        if (nodes.length > 0 && nodes[0].name && nodes[0].geometry) {
            var geometry = nodes[0].geometry;
            if (viewer.entities.getById('label_' + geometry)) {
                return;
            }
            var kmlpromise = Cesium.KmlDataSource.load('/data/' + geometry,
            {
                camera: viewer.scene.camera,
                canvas: viewer.scene.canvas,
            });
            kmlpromise.then(function(ds){
                var entities = ds.entities.values;
                entities.forEach(entity=>{
                    if (entity.polygon) {
                        var positions = entity.polygon.hierarchy.getValue().positions;
                        var lnglats = [];
                        positions.forEach(position => {
                            var cartographic = Cesium.Cartographic.fromCartesian(position);
                            var lon = Cesium.Math.toDegrees(cartographic.longitude);
                            var lat = Cesium.Math.toDegrees(cartographic.latitude);
                            lnglats.push([lon,lat])
                        });
                        var polygon = turf.polygon([lnglats], { name: 'building' });
                        var centroid = turf.centroid(polygon);
                        var coords = centroid.geometry.coordinates;
                        var hegiht = viewer.scene.getHeight(coords[0],coords[1]);
                        var label = new Cesium.Entity({
                            position : Cesium.Cartesian3.fromDegrees(coords[0], coords[1],hegiht + 5),
                            name : '标注_' + geometry,
                            id:'label_' + geometry,
                            label:{
                                text: nodes[0].name,
                                font: '36px Helvetica',
                                fillColor: Cesium.Color.WHITE,
                                outlineColor: Cesium.Color.BLACK,
                                outlineWidth: 2,
                                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                                scaleByDistance: new Cesium.NearFarScalar(100, 1.0, 200, 0.4)
                            }
                        });
                        viewer.entities.add(label);
                        console.log(centroid);
                    }
                    
                });
            })
        }
    });

    function building() {

        function showBuildingTree() {
            var setting = {
                callback: {
                    onDblClick: function (event, treeId, treeNode) {
                        viewer.dataSources.removeAll();
                        if (treeNode.geometry) {
                            var kmlpromise = Cesium.KmlDataSource.load('/data/' + treeNode.geometry, {
                                camera: viewer.scene.camera,
                                canvas: viewer.scene.canvas,
                                clampToS3M: true
                            });
                            kmlpromise.then(function(ds){
                                var entities = ds.entities.values;
                                entities.forEach(entity=>{
                                    if (entity.polygon) {
                                        entity.polygon.outline = false;
                                        entity.polygon.material  = Cesium.Color.RED.withAlpha(0.4);
                                    }
                                    
                                });
                                viewer.dataSources.add(ds);
                                viewer.flyTo(ds);
                            });

                        }
                    }
                }
            };
            var data = [{
                name: '闵行区',
                children: [
                    {
                        name: '江川路街道',
                        children: [
                            {
                                name: '网格1',
                                children: [
                                    {
                                        name: '旗忠网球中心中央场馆',
                                        geometry: 'venues_center.kml'
                                    },
                                    {
                                        name: '旗忠网球中心中西场馆',
                                        geometry: 'venues_west.kml'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }];
            zTreeObj = $.fn.zTree.init($('#building_tree'), setting, data);
        }

        return {
            showBuildingTree: showBuildingTree
        }
    }

    window.Building = building();
}());