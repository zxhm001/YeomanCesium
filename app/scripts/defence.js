$(function(){
    var zTreeObj,viewshed3D;
    var data = [{
        name:'闵行区',
        children:[
            {
                name:'江川路街道',
                children:[
                    {
                        name:'反制枪1',
                        model:'gun_1'
                    }
                ]
            }
        ]
    }];

    $('#modal_defence').on('show.bs.modal', function (event) {
        Defence.showDefenceTree();
    });

    $('#modal_defence').on('hide.bs.modal', function (event) {
        if (viewshed3D) {
            viewshed3D.distance = 0.01;
        }
    });

    $('#btn_defence_viewshed').on('click',function(){
        var nodes = zTreeObj.getSelectedNodes();
        if (nodes.length > 0 && nodes[0].model) {
            var model = viewer.entities.getById(nodes[0].model);
            Defence.showViewshed(model._position._value);
        }
    });

    function defence()
    {
        function showDefenceTree(){
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
            zTreeObj = $.fn.zTree.init($('#defence_tree'), setting, data);
        }

        //TODO:对于辐射范围可能应该用圆形
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
            showDefenceTree:showDefenceTree,
            showViewshed:showViewshed,
            add:add
        };
    }
    window.Defence = defence();

}());