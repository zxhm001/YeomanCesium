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
                spatialQueryMode: 'INTERSECT',
                toIndex: -1,
            });

            if (!errorback) {
                errorback = function(error){
                    console.error('空间查询错误：' + error);
                }
            }
            
            var getFeaturesByGeometryService = new SuperMap.REST.GetFeaturesByGeometryService(config.SM_DATA_SERVICE, {
                eventListeners: {
                    'processCompleted': callback,
                    'processFailed': errorback
                },
            });
            getFeaturesByGeometryService.processAsync(params);
        }

        /****
         * 执行SQL查询
         * @param {String} sql sql语句
         * @param {Array} datasets 查询的数据集
         * @param {Function} callback 查询成功的回调函数
         * @param {Function} errorback 查询失败时的回调函数
         */
         var doSqlQuery = function doSqlQuery(sql, datasets, callback, errorback) {
            var getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams;
            getFeatureParam = new SuperMap.REST.FilterParameter({
                attributeFilter: sql
            });
            getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
                queryParameter: getFeatureParam,
                toIndex: -1,
                datasetNames: datasets, // 本例中“户型面”为数据源名称，“专题户型面2D”为楼层面相应的数据集名称
                maxFeatures:999999
            });
            if (!errorback) {
                errorback = function(error){
                    console.error('SQL查询错误：' + error);
                }
            }
            getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(config.SM_DATA_SERVICE, {
                eventListeners: {
                    'processCompleted': callback, // 查询成功时的回调函数
                    'processFailed': errorback // 查询失败时的回调函数
                },
            });
            getFeatureBySQLService.processAsync(getFeatureBySQLParams);
        }
        
        var doCustomSqlQuery = function(sql,datasets,callback, errorback)
        {
            var url = config.SM_DATA_SERVICE + '/featureResults.json';
            var params = {
                returnContent:true,
                fromIndex : 0,
                toIndex : -1,
                _method:'POST',
                sectionCount:1,
                sectionIndex:0,
            }
            var requestEntity = {
                'datasetNames':datasets,
                'getFeatureMode':'SQL',
                'queryParameter':{
                    'attributeFilter':sql,
                    'name':null,
                    'joinItems':null,
                    'linkItems':null,
                    'ids':null,
                    'orderBy':null,
                    'groupBy':null,
                    'fields':null
                },
                'maxFeatures':999999
            }
            params.requestEntity = JSON.stringify(requestEntity)
            var urlParams = Object.keys(params).map(function (key) {
                return encodeURIComponent(key) + '=' + encodeURIComponent((params[key]));
            }).join('&');
            url = url + '?' + urlParams;
            
            if (!errorback) {
                errorback = function(error){
                    console.error('SQL查询错误：' + error);
                }
            }

            $.ajax({
                type: 'GET',
                url: url,
                dataType: 'json',
                success: callback,
                error:errorback
            });
        }

        return{
            doSpatialQuery:doSpatialQuery,
            doSqlQuery:doSqlQuery,
            doCustomSqlQuery:doCustomSqlQuery
        }

    }
    

    window.Query = query();
}())