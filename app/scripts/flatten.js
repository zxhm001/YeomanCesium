$(function(){

    setTimeout(() => {
        Flatten.show();
    }, 3 * 5000);

    function flatten(){

        var features = null;

        function show(){
            if (!features) {
                var sql = '1=1';
                Query.doCustomSqlQuery(sql,config.FLATTEN_DATASOURCE,function(qe){
                    features = qe.features;
                    setFlatten();
                })
            }
            else
            {
                setFlatten();
            }
        }

        function setFlatten()
        {
            features.forEach(feature => {
                var points = feature.geometry.points;
                var flatPoints = [];
                points.forEach(point => {
                    flatPoints.push(point.x);
                    flatPoints.push(point.y);
                    flatPoints.push(point.z);
                });
                flatPoints.push(points[0].x);
                flatPoints.push(points[0].y);
                flatPoints.push(points[0].z);
                var qxLayer = ScenceLayer.getLayerById('0-1-1');
                S3MTilesLayerUtils.addFlattenRegion([qxLayer.object], flatPoints);
            });
        }

        function hide(){
            var qxLayer = ScenceLayer.getLayerById('0-1-1');
            S3MTilesLayerUtils.removeAllFlattenRegion([qxLayer.object]);
        }

        return{
            show:show,
            hide:hide
        }
    }

    window.Flatten = flatten();
}());