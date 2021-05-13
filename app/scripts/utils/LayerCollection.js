(function (win) {
    function LayerCollection(viewer) {
        this._viewer = viewer;
        this._entityLayers = {};
    }

    Object.defineProperties(LayerCollection, {
        layers: {
            get: function () {
                return this._entityLayers;
            }
        }
    });

    LayerCollection.prototype.add = function (name) {
        if (name === undefined) {
            // 创建GUID作为图层名
            name = Cesium.createGuid();
        }
        var dataSource = new Cesium.CustomDataSource(name);
        this._viewer.dataSources.add(dataSource);
        this._entityLayers[name] = dataSource.entities;
        return this._entityLayers[name];
    };

    LayerCollection.prototype.hidden = function (name) {
        if (!Cesium.defined(name)) {
            throw new Cesium.DeveloperError('name is required.');
        }

        this._entityLayers[name].show = false;
    };

    LayerCollection.prototype.get = function (name) {
        if (!Cesium.defined(name)) {
            throw new Cesium.DeveloperError('name is required.');
        }
        return this._entityLayers[name];
    };

    LayerCollection.prototype.getOrCreate = function (name) {
        if (!Cesium.defined(name)) {
            throw new Cesium.DeveloperError('name is required.');
        }
        if (Cesium.defined(this._entityLayers[name])) {
            return this._entityLayers[name];
        } else {
            return this.add(name);
        }
    };

    LayerCollection.prototype.clear = function (name) {
        if (!Cesium.defined(name)) {
            throw new Cesium.DeveloperError('name is required.');
        }
        if (Cesium.defined(this._entityLayers[name])) {
            this._entityLayers[name].removeAll();
        }
    };

    LayerCollection.prototype.clearAll = function () {
        for (var i in this._entityLayers) {
            this._entityLayers[i].removeAll();
        }
    };

    LayerCollection.prototype.removeById = function (id) {
        for (var i in this._entityLayers) {
            this._entityLayers[i].removeById(id);
        }
    };

    // options: {layer:,lon:,lat:,height:,imageUrl:}
    LayerCollection.prototype.addSymbol = function (options) {
        if (!Cesium.defined(options)) {
            throw new Cesium.DeveloperError('options is required.');
        }

        var layerName = options.layer || 'custom';
        var entityLayer = this.getOrCreate(layerName);
        if (!entityLayer.show) {
            entityLayer.show = true;
        }

        var lon = options.lon;
        var lat = options.lat;
        var height = options.height || 0.1;
        var imageUrl = options.imageUrl;
        var entity = entityLayer.add({
            position: Cesium.Cartesian3.fromDegrees(lon, lat, height),
            billboard: {
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                image: imageUrl,
                disableDepthTestDistance: height > 0 ? height + 150 : 150
            }
        });

        return entity;
    };

    // 全局注册
    window.LayerCollection = LayerCollection;
})(this)