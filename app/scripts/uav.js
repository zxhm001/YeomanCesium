$(function(){
    var zTreeObj;

    var data = [{
        name:'闵行区',
        children:[
            {
                name:'江川路街道',
                children:[
                    // {
                    //     name:'无人机1',
                    //     model:'uav_1'
                    // }
                ]
            }
        ]
    }];

    $('#modal_uav').on('show.bs.modal', function (event) {
        UAV.showUAVTree();
    });

    $('#modal_uav').on('hide.bs.modal', function (event) {
        viewer.trackedEntity = null;
        $('#video_uav').hide();
        $('#video_uav').trigger('pause');
    });

    $('#btn_track_uav').on('click',function(){
        var nodes = zTreeObj.getSelectedNodes();
        if (nodes.length > 0 && nodes[0].model) {
            var model = viewer.entities.getById(nodes[0].model);
            viewer.trackedEntity = model;
        }
    });

    $('#btn_video_uav').on('click',function(){
        $('#video_uav').show();
        $('#video_uav').trigger('play');
    });

    setTimeout(() => {
        UAV.loadUAVs();
    }, 2000);
      
    function uav(){
        function showUAVTree(){
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
            zTreeObj = $.fn.zTree.init($('#uav_tree'), setting, data);
        }

        function add(name,modelId)
        {
            var newNode = {
                name:name,
                model:modelId
            };
            data[0].children[0].children.push(newNode);
            if (zTreeObj) {
                var parentNode = zTreeObj.getNodeByParam('name','江川路街道');
                zTreeObj.addNodes(parentNode,-1,newNode);
            }
        }

        function loadUAVs()
        {
            $.get(API_ROOT + '/api/uav',function(response){
                if (response.succeeded) {
                    response.data.forEach(uav => {
                        if (uav.id != 1) {
                            addEntity(uav.id,uav.license,uav.longitude,uav.latitude,uav.height,uav.path);
                        }
                        add(uav.license,'uav_' + uav.id);
                    });
                }
            });
        }

        function addEntity(key,license,lng,lat,height,path)
        {
            viewer.entities.add({
                name: license,
                id:'uav_' + key,
                position: new Cesium.Cartesian3.fromDegrees(lng, lat, height),
                model: {
                    uri: '/data/model/uav.glb',
                    scale:2
                },
                label:{
                    text: license,
                    font: SysConfig.getConfig().model_label_size + 'px Helvetica',
                    fillColor: Cesium.Color.fromCssColorString(SysConfig.getConfig().model_label_color),
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2,
                    eyeOffset:new Cesium.Cartesian3(0.0, 1, 0.0),
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    scaleByDistance: new Cesium.NearFarScalar(100, 1.0, 200, 0.4)
                }
            });                   
        }

        return{
            showUAVTree:showUAVTree,
            add:add,
            loadUAVs:loadUAVs
        }
    }

    window.UAV = uav();
}());