$(function () {
    var zTreeObj;

    $('#modal_building').on('show.bs.modal', function (event) {
        Building.showBuildingTree(); 
    });

    $('#modal_building').on('hide.bs.modal', function (event) {
        viewer.dataSources.removeAll();
        $('.corner-btn-group .inner .box').removeClass('active')
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
                        var height = viewer.scene.getHeight(coords[0],coords[1]);
                        Building.addEnitiy(geometry,nodes[0].name,coords[0],coords[1],height + 5);
                        Building.persistence(geometry,nodes[0].name,coords[0],coords[1],height + 5);
                        console.log(centroid);
                    }
                    
                });
            })
        }
    });

    $('#btn_building_delete').on('click',function(){
        var nodes = zTreeObj.getSelectedNodes();
        if (nodes.length > 0 && nodes[0].name && nodes[0].geometry) {
            var geometry = nodes[0].geometry;
            var entity = viewer.entities.getById('label_' + geometry);
            if (entity) {
                var url = API_ROOT + '/api/label/by-key/' + geometry;
                $.ajax({
                    type: 'DELETE',
                    url: url,
                    success: function (response) {
                        if (response.succeeded) {
                            viewer.entities.remove(entity);
                            Toast.show('提示','删除成功');
                        }
                        else
                        {
                            console.error(response.errors);
                        }
                    },
                    error: function (err) {
                        console.error(err);
                    }
                });
            }
            else
            {
                Toast.show('提示','该建筑没有标注');
            }
        }
    });

    $('#building_show_label').on('change',function(){
        Building.setLabelVisible($(this).prop('checked'));
    })

    setTimeout(() => {
        Building.loadLabels();
    }, 2000);

    var data = [{
        name: '闵行区',
        children: [
            {
                name: '江川路街道',
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
    }];


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
            
            zTreeObj = $.fn.zTree.init($('#building_tree'), setting, data);
        }

        function persistence(key,text,lng,lat,height){
            var url = API_ROOT + '/api/label';
            var data = {
                key:key,
                text: text,
                longitude: lng,
                latitude: lat,
                height: height
            };
            $.ajax({
                type: 'POST',
                url: url,
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(data),
                dataType: 'json',
                success: function (response) {
                    if (response.succeeded) {
                        Toast.show('提示','添加成功');
                    }
                    else
                    {
                        console.error(response.errors);
                    }
                    console.log(response);
                },
                error: function (err) {
                    console.error(err);
                }
            });
        }

        function addEnitiy(key,text,lng,lat,height)
        {
            var label = new Cesium.Entity({
                position : Cesium.Cartesian3.fromDegrees(lng, lat,height),
                name : '建筑物_' + key,
                id:'building_' + key,
                label:{
                    text: text,
                    font: SysConfig.getConfig().building_label_size + 'px Helvetica',
                    fillColor: Cesium.Color.fromCssColorString(SysConfig.getConfig().building_label_color),
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    scaleByDistance: new Cesium.NearFarScalar(100, 1.0, 200, 0.4)
                }
            });
            viewer.entities.add(label);
        }

        function loadLabels()
        {
            $.get(API_ROOT + '/api/label',function(response){
                if (response.succeeded) {
                    response.data.forEach(label => {
                        addEnitiy(label.key,label.text,label.longitude,label.latitude,label.height);
                    });
                }
            });
        }

        function setLabelVisible(visible)
        {
            var modelIds = getModelNodes();
            modelIds.forEach(modelId => {
                var entity = viewer.entities.getById('label_' + modelId);
                if (entity) {
                    entity.show = visible;
                }
            });
        }

        function getModelNodes()
        {
            var modelIds = [];
            data.forEach(node => {
                node.children.forEach(subNode => {
                    subNode.children.forEach(bnode => {
                        if (bnode.geometry) {
                            modelIds.push(bnode.geometry)
                        }
                    });
                });
            });
            return modelIds;
        }

        return {
            showBuildingTree: showBuildingTree,
            persistence:persistence,
            addEnitiy:addEnitiy,
            loadLabels:loadLabels,
            setLabelVisible:setLabelVisible
        }
    }

    window.Building = building();
}());