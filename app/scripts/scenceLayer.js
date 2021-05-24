$(function(){
    var zTreeSetting = {
        callback:{
            onCheck:function(event, treeId, treeNode){
                var layerObject = ScenceLayer.getLayerObject(treeNode.id);
                ScenceLayer.setLayervisibility(layerObject,treeNode.checked);
            },
            onDblClick:function(event, treeId, treeNode){
                var layerObject = ScenceLayer.getLayerObject(treeNode.id);
                if (layerObject.object) {
                    if (layerObject.object.getViewableRectangle) {
                        layerObject.object.getViewableRectangle().then(function (rectangle) {
                            return viewer.camera.flyTo({
                                destination: rectangle
                            });
                        });
                    }
                    else
                    {
                        viewer.flyTo(layerObject.object);
                    }
                }
            }
        },
        check:
        {
            enable: true
        },
    };

    var layerTreeObj,layers;

    function scenceLayer(){
        function init() {
            $.getJSON('/data/scence.json',function (scenceData) {
                var camera = scenceData.camera;
                viewer.scene.camera.setView({
                    destination : new Cesium.Cartesian3(camera.destination.x, camera.destination.y, camera.destination.z),
                    orientation : {
                        direction : new Cesium.Cartesian3(camera.direction.x, camera.direction.y, camera.direction.z ),
                        up : new Cesium.Cartesian3(camera.up.x, camera.up.y, camera.up.z)
                    }
                });

                layers = scenceData.layers;
                layerTreeObj = $.fn.zTree.init($('#layer_tree'), zTreeSetting, layers);
                layers.forEach(layerNode => {
                    addLayer(layerNode);
                });
                

                $('.core-btn').on('click',function(){
                    viewer.scene.camera.setView({
                        destination : new Cesium.Cartesian3(camera.destination.x, camera.destination.y, camera.destination.z),
                        orientation : {
                            direction : new Cesium.Cartesian3(camera.direction.x, camera.direction.y, camera.direction.z ),
                            up : new Cesium.Cartesian3(camera.up.x, camera.up.y, camera.up.z)
                        }
                    });
                });
            });
        }

        function addLayer(node) {
            if (node.type == 'group') {
                node.children.forEach(subNode => {
                    addLayer(subNode);
                });
            }
            else if (node.type == 'tianditu') {
                var imageProvider = new Cesium.TiandituImageryProvider({
                    mapStyle : Cesium.TiandituMapsStyle[node.layer], 
                    token: node.token
                })
                var imageLayer = viewer.imageryLayers.addImageryProvider(imageProvider);
                node.object = imageLayer;
                setLayervisibility(node,node.checked);
            }
            else if (node.type == 's3m') {
                var s3mPromise = viewer.scene.addS3MTilesLayerByScp(node.service, {
                    name: node.name
                });
                s3mPromise.then(function(s3mLayer) {
                    node.object = s3mLayer;
                    if (node.datasource != null) {
                        node.datasource.url = config.SM_DATA_SERVICE;
                        s3mLayer.setQueryParameter(node.datasource);
                    }
                    setLayervisibility(node,node.checked);
                });
            }
        }

        function setLayervisibility(layerObject,visibility)
        {
            layerObject.checked = visibility;
            if (layerObject.object != null) {
                if (typeof(layerObject.object.show) != 'undefined') {
                    layerObject.object.show = visibility;
                }
                if (typeof(layerObject.object.visible) != 'undefined') {
                    layerObject.object.visible  = visibility;
                }
            }
            if (layerObject.children != null) {
                layerObject.children.forEach(element => {
                    setLayervisibility(element,visibility);
                });
            }
        }

        /*****
         * 获取与图层节点相关的图层对象
         * @param {Sttring} key 图层名称或者ID
         * @param {Array} objectArray 对象列表
         *****/
         function getLayerObject(key,objectArray)
         {
            objectArray = objectArray || layers;
             for (let index = 0; index < objectArray.length; index++) {
                 const element = objectArray[index];
                 if (element.name == key || element.id == key) {
                     return element;
                 }
                 else if (element.children != null) {
                     var subLayerObj = getLayerObject(key,element.children);
                     if (subLayerObj != null) {
                         return subLayerObj;
                     }
                 }
             }
         }

         function getLayerById(key,layerNodes)
         {
            layerNodes = layerNodes || layers;
            for (let index = 0; index < layerNodes.length; index++) {
                if (layerNodes[index].id == key || layerNodes[index].name == key) {
                    return layerNodes[index];
                }
                else if (layerNodes[index].children) {
                    var layerNode =  getLayerById(key,layerNodes[index].children);
                    if (layerNode) {
                        return layerNode;
                    }
                }
            }
         }

        return{
            init:init,
            setLayervisibility:setLayervisibility,
            getLayerObject:getLayerObject,
            getLayerById:getLayerById
        }
    }

    window.ScenceLayer = scenceLayer();
}());