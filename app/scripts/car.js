$(function(){
    var zTreeObj;

    var data = [{
        name:'闵行区',
        children:[
            {
                name:'江川路街道',
                children:[
                    {
                        name:'车辆1',
                        model:'car_1'
                    }
                ]
            }
        ]
    }];

    $('#modal_car').on('show.bs.modal', function (event) {
        Car.showCarTree();
    });

    $('#modal_car').on('hide.bs.modal', function (event) {
        viewer.trackedEntity = null;
    });

    $('#btn_track_car').on('click',function(){
        var nodes = zTreeObj.getSelectedNodes();
        if (nodes.length > 0 && nodes[0].model) {
            var model = viewer.entities.getById(nodes[0].model);
            viewer.trackedEntity = model;
        }
    });
      
    function car(){

        function showCarTree(){
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
            zTreeObj = $.fn.zTree.init($('#car_tree'), setting, data);
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
            

        return{
            showCarTree:showCarTree,
            add:add
        }
    }

    window.Car = car();
}());