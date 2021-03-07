$(function(){
    var zTreeObj,viewshed3D;

    var data = [{
        name:'闵行区',
        children:[
            {
                name:'江川路街道',
                children:[
                    {
                        name:'网格1',
                        children:[
                            // {
                            //     name:'摄像头1',
                            //     model:'camera_1'
                            // }
                        ]
                    }
                ]
            }
        ]
    }];

    $('#modal_camera').on('show.bs.modal', function (event) {
        Camera.showCameraTree();
    });

    $('#modal_camera').on('hide.bs.modal', function (event) {
        $('#video_camera').hide();
        $('#btngroup_camera_control').hide();
        $('#video_camera').trigger('pause');
        if (viewshed3D) {
            viewshed3D.distance = 0.01;
        }
    });

    $('#btn_camera_video').on('click',function(){
        $('#video_camera').show();
        $('#video_camera').trigger('play');
    });

    $('#btn_camera_control').on('click',function(){
        $('#btngroup_camera_control').css('display','inline-flex')
    });

    $('#btn_camera_viewshed').on('click',function(){
        var nodes = zTreeObj.getSelectedNodes();
        if (nodes.length > 0 && nodes[0].model) {
            var model = viewer.entities.getById(nodes[0].model);
            Camera.showViewshed(model._position._value);
        }
    });

    $('#btn_camera_up').on('click',function(){
        viewshed3D.pitch = viewshed3D.pitch + 5;
    });

    $('#btn_camera_down').on('click',function(){
        viewshed3D.pitch = viewshed3D.pitch - 5;
    });

    $('#btn_camera_left').on('click',function(){
         viewshed3D.direction = viewshed3D.direction - 10;
    });

    $('#btn_camera_right').on('click',function(){
        viewshed3D.direction = viewshed3D.direction + 10;
    });

    $('#btn_camera_zoomin').on('click',function(){
        viewshed3D.distance = viewshed3D.distance + 50;
        viewshed3D.verticalFov = viewshed3D.verticalFov - 30;
        viewshed3D.horizontalFov = viewshed3D.horizontalFov - 30;
    });

    $('#btn_camera_zoomout').on('click',function(){
        viewshed3D.distance = viewshed3D.distance - 50;
        viewshed3D.verticalFov = viewshed3D.verticalFov + 30;
        viewshed3D.horizontalFov = viewshed3D.horizontalFov + 30;
    });

    setTimeout(() => {
        Camera.loadCameras();
    }, 2000);
      
    function camera(){

        function showCameraTree(){
            var setting = {
                callback:{
                    onDblClick:function(event, treeId, treeNode){
                        if (treeNode.model) {
                            var model = viewer.entities.getById(treeNode.model);
                            viewer.flyTo(model); 
                        }
                    }
                }
            };
            zTreeObj = $.fn.zTree.init($('#camera_tree'), setting, data);
        }

        function showViewshed(position)
        {
            var cartographic = Cesium.Cartographic.fromCartesian(position);
            var longitude = Cesium.Math.toDegrees(cartographic.longitude);
            var latitude = Cesium.Math.toDegrees(cartographic.latitude);
            var height = cartographic.height;
            if (!viewshed3D) {
                viewshed3D = new Cesium.ViewShed3D(viewer.scene);
            }
            viewshed3D.direction = 90;
            viewshed3D.pitch = -15;
            viewshed3D.distance = 100;
            viewshed3D.verticalFov = 90;
            viewshed3D.horizontalFov = 120;
            viewshed3D.viewPosition = [longitude, latitude, height];
            viewshed3D.build();
        }

        function add(name,modelId)
        {
            var newNode = {
                name:name,
                model:modelId
            };
            data[0].children[0].children[0].children.push(newNode);
            if (zTreeObj) {
                var parentNode = zTreeObj.getNodeByParam('name','网格1');
                zTreeObj.addNodes(parentNode,-1,newNode);
            }
        }

        function addEntity(key,license,lng,lat,height){
            viewer.entities.add({
                name: license,
                id:'camera_' + key,
                position: new Cesium.Cartesian3.fromDegrees(lng, lat, height),
                model: {
                    uri: '/data/model/camera.glb',
                    scale:0.1
                },
                label:{
                    text: license,
                    font: SysConfig.getConfig().model_label_size + 'px Helvetica',
                    fillColor: Cesium.Color.fromCssColorString(SysConfig.getConfig().model_label_color),
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2,
                    eyeOffset:new Cesium.Cartesian3(0.0, 1.0, 0.0),
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    scaleByDistance: new Cesium.NearFarScalar(100, 1.0, 200, 0.4)
                }
            });        
        }

        function loadCameras(){
            $.get(API_ROOT + '/api/camera',function(response){
                if (response.succeeded) {
                    response.data.forEach(camera => {
                        addEntity(camera.id,camera.license,camera.longitude,camera.latitude,camera.height);
                        add(camera.license,'camera_' + camera.id);
                    });
                }
            });
        }

        return{
            showCameraTree:showCameraTree,
            showViewshed:showViewshed,
            add:add,
            loadCameras:loadCameras
        }
    }

    window.Camera = camera();
}());