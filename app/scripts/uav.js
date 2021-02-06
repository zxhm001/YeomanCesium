$(function(){
    var zTreeObj;

    var data = [{
        name:'闵行区',
        children:[
            {
                name:'江川路街道',
                children:[
                    {
                        name:'无人机1',
                        model:'uav_1'
                    }
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
            if (zTreeObj) {
                var parentNode = zTreeObj.getNodeByParam('name','江川路街道');
                zTreeObj.addNodes(parentNode,-1,newNode);
            }
            else
            {
                data[0].children[0].children.push(newNode);
            }
        }

        return{
            showUAVTree:showUAVTree,
            add:add
        }
    }

    window.UAV = uav();
}());