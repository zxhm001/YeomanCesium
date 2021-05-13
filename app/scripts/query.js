$(function(){
    function query(){

        /*****
         * 执行空间查询
         * @param {SuperMap.Geometry} geometry 执行空间查询的图形
         * @param {Array} datasets 查询的数据集
         * @param {Function} callback 查询成功的回调函数
         * @param {Function} errorback 查询失败时的回调函数
         */
         var doSpatialQuery = function (geometry, datasets, callback, errorback) {
            var params = new SuperMap.REST.GetFeaturesByGeometryParameters({
                geometry: geometry,
                datasetNames: datasets,
                spatialQueryMode: "INTERSECT",
                toIndex: -1,
            });

            var getFeaturesByGeometryService = new SuperMap.REST.GetFeaturesByGeometryService(config.SM_DATA_SERVICE, {
                eventListeners: {
                    "processCompleted": callback,
                    "processFailed": errorback
                },
            });
            getFeaturesByGeometryService.processAsync(params);
        }

        return{
            doSpatialQuery:doSpatialQuery
        }

    }
    

    window.Query = query();
}())