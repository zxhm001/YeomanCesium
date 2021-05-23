(function (win) {
    // 设置一组图层的透明度
    function setAlpha(layers, alpha) {
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            if (isS3MTilesLayer(layer)) {
                layer.style3D.fillForeColor.alpha = parseFloat(alpha);
            }
        }
    }

    // 记录土壤几何体
    var excavationEntirys = {};
    // 地面开挖，针对模型图层
    function addExcavationRegion(viewer, layers, position, depth) {
        depth = depth || 10.0;
        var len = position.length;
        var count = Math.floor(len / 3);
        // 至少有3个点
        if (len < 9) {
            console.warn('模型开挖至少传入3个点');
            return;
        }
        var cartesianWall = [];
        var cartesianBottom = [];
        var minHeight = Number.MAX_VALUE;
        var minimumHeights = [];
        for (var i = 0; i < count; i++) {
            var height = position[i*3 + 2];
            // 取最低点
            if (height < minHeight) minHeight = height;
        }
        for (var i = 0; i < count; i++) {
            var lon = position[i*3];
            var lat = position[i*3 + 1];
            var height = position[i*3 + 2];
            cartesianWall.push(Cesium.Cartesian3.fromDegrees(lon, lat, minHeight));
            cartesianBottom.push(Cesium.Cartesian3.fromDegrees(lon, lat, minHeight- depth))
            minimumHeights.push(minHeight - depth);
        }
        cartesianWall.push(cartesianWall[0]);
        cartesianBottom.push(cartesianBottom[0]);
        minimumHeights.push(minHeight - depth);

        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            if (isS3MTilesLayer(layer)) {
                var guid = Cesium.createGuid();
                // 倾斜开挖
                layer.addExcavationRegion({
                    position: position,
                    name: guid
                });

                // 土壤几何体绘制
                var wallMaterial = new Cesium.ImageMaterialProperty({
                    image : '/images/texture/soil1.jpg',
                    repeat : new Cesium.Cartesian2(8.0, 1.0)
                });
                var bottomMaterial = new Cesium.ImageMaterialProperty({
                    image : '/images/texture/soil2.jpg',
                    repeat : new Cesium.Cartesian2(4.0, 2.0)
                });
                var entityLayer = viewer.showLayer.getOrCreate(guid);
                entityLayer.add({
                    wall: {
                        positions: cartesianWall,
                        minimumHeights: minimumHeights,
                        material: wallMaterial
                    },
                    polygon: {
                        hierarchy: cartesianBottom,
                        perPositionHeight: true,
                        material: bottomMaterial
                    }
                });
                excavationEntirys[guid] = entityLayer;
            }
        }
    }

    // 清除所有地面开挖
    function removeAllExcavationRegion(viewer,layers) {
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            if (isS3MTilesLayer(layer)) {
                layer.removeAllExcavationRegion();
            }
        }
        for (var key in excavationEntirys) {
            if (excavationEntirys.hasOwnProperty(key)) {
                viewer.showLayer.clear(key);
                delete excavationEntirys[key];
            }
        }
    }

    function addFlattenRegion(layers, position){
        var len = position.length;
        // 至少有3个点
        if (len < 9) {
            console.warn('模型压平至少传入3个点');
            return;
        }
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            if (isS3MTilesLayer(layer)) {
                var guid = Cesium.createGuid();
                // 倾斜压平
                layer.addFlattenRegion({
                    position: position,
                    name: guid
                });
            }
        }
    }

    function removeAllFlattenRegion(layers)
    {
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            if (isS3MTilesLayer(layer)) {
                layer.removeAllFlattenRegion();
            }
        }
    }

    function isS3MTilesLayer(obj) {
        if (obj instanceof Cesium.S3MTilesLayer) return true;
        else return false;
    }

    var S3MTilesLayerUtils = {
        setAlpha: setAlpha,
        addExcavationRegion: addExcavationRegion,
        removeAllExcavationRegion: removeAllExcavationRegion,
        addFlattenRegion:addFlattenRegion,
        removeAllFlattenRegion:removeAllFlattenRegion
    }

    // 全局注册
    window.S3MTilesLayerUtils = S3MTilesLayerUtils;
})(this)