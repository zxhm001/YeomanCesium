$(function(){
    var zTreeObj;

    var data = [
        {
            name:'警车',
            children:[]
        },
        {
            name:'消防车',
            children:[]
        },
        {
            name:'救护车',
            children:[]
        },
        {
            name:'反制车',
            children:[]
        },
        {
            name:'警用摩托',
            children:[]
        }
    ];

    $('#modal_car').on('show.bs.modal', function (event) {
        Car.showCarTree();
    });

    $('#modal_car').on('hide.bs.modal', function (event) {
        viewer.trackedEntity = null;
        $('#btn_car_track').attr('disabled',true); 
        $('#btn_car_delete').attr('disabled',true); 
    });

    $('#btn_car_track').on('click',function(){
        var nodes = zTreeObj.getSelectedNodes();
        if (nodes.length > 0 && nodes[0].model) {
            var model = viewer.entities.getById(nodes[0].model);
            viewer.trackedEntity = model;
        }
    });


    /**
     * 编辑车辆信息
     */
     $('#btn_car_edit').on('click',function(){
        var nodes = zTreeObj.getSelectedNodes();
        if (nodes.length > 0 && nodes[0].params)
        {
            Edit.showModal(nodes[0].params.type,nodes[0].params,function(data){
                nodes[0].name = data.license;
                zTreeObj.updateNode(nodes[0]);
                //TODO:还没有更新data数据
            });
        }
        else
        {
            Toast.show('提示','请选择车辆');
        }
    });

    /**
     * 删除车辆信息
     */
    $('#btn_car_delete').on('click',function(){
        var nodes = zTreeObj.getSelectedNodes();
        if (nodes.length > 0 && nodes[0].model && nodes[0].params) {
            var entity = viewer.entities.getById(nodes[0].model);
            var url = API_ROOT + '/api/car/' + nodes[0].params.id;
            $.ajax({
                type: 'DELETE',
                url: url,
                success: function (response) {
                    if (response.succeeded) {
                        if (entity) {
                            viewer.entities.remove(entity);
                        }
                        zTreeObj.removeNode(nodes[0]);
                        Car.deleteData(nodes[0].params.id);
                        Toast.show('提示','删除成功');
                    }
                    else
                    {
                        console.error(response.errors);
                    }
                },
                error: function (err) {
                    console.error(err);
                }
            });
        }
        else
        {
            Toast.show('提示','请选择车辆');
        }
    });

    $('#car_show_model').on('change',function(){
        Car.setModelVisible($(this).prop('checked'));
    })

    $('#car_show_label').on('change',function(){
        Car.setLabelVisible($(this).prop('checked'));
    })
      
    function car(){

        function init(){
            data = [
                {
                    name:'警车',
                    children:[]
                },
                {
                    name:'消防车',
                    children:[]
                },
                {
                    name:'救护车',
                    children:[]
                },
                {
                    name:'反制车',
                    children:[]
                },
                {
                    name:'警用摩托',
                    children:[]
                }
            ];
            loadCars();
            // if (zTreeObj) {
            //     $.fn.zTree.destroy("car_tree");
            //     zTreeObj = null;
            // }
        }

        function showCarTree(){
            var setting = {
                callback:{
                    onDblClick:function(event, treeId, treeNode){
                        if (treeNode.model) {
                            var model = viewer.entities.getById(treeNode.model);
                            viewer.flyTo(model); 
                        }
                    },
                    onClick:function(event, treeId, treeNode)
                    {
                        if (treeNode.params) {
                            $('#btn_car_track').attr('disabled',false); 
                            $('#btn_car_edit').attr('disabled',false); 
                            $('#btn_car_delete').attr('disabled',false); 
                        }
                        else
                        {
                            $('#btn_car_track').attr('disabled',true); 
                            $('#btn_car_edit').attr('disabled',true); 
                            $('#btn_car_delete').attr('disabled',true); 
                        }
                    }
                }
            };
            zTreeObj = $.fn.zTree.init($('#car_tree'), setting, data);
        }

        function add(name,type,modelId,params)
        {
            var newNode = {
                name:name,
                model:modelId,
                params:params
            };
            data.forEach(node => {
                if (node.name == type) {
                    node.children.push(newNode);
                }
            });
            if (zTreeObj) {
                var parentNode = zTreeObj.getNodeByParam('name',type);
                zTreeObj.addNodes(parentNode,-1,newNode);
            }
        }

        function loadCars()
        {
            $.get(`${API_ROOT}/api/car/${currentProject.id}`,function(response){
                if (response.succeeded) {
                    response.data.forEach(car => {
                        if (car.id != 1) {
                            addEntity(car.id,car.license,car.type,car.longitude,car.latitude,car.height,car.path);
                        }
                        add(car.license,car.type,'car_' + car.id,car);
                    });
                }
            });
        }

        function addEntity(key,license,type,lng,lat,height,path)
        {
            var uri = '';
            var scale = 1;
            switch (type) {
                case '警车':
                    uri = '/data/model/police_car.glb';
                    break;
                case '消防车':
                    uri = '/data/model/fire_truck.glb';
                    break;
                case '救护车':
                    uri = '/data/model/ambulance.glb';
                    break;
                case '警用摩托':
                    uri = '/data/model/motorcycle.glb';
                    break;
                case '反制车':
                    uri = '/data/model/armored_car.glb';
                    break;
                default:
                    break;
            }

            viewer.entities.add({
                name: license,
                id:'car_' + key,
                position: new Cesium.Cartesian3.fromDegrees(lng, lat, height),
                model: {
                    uri: uri,
                    scale:scale,
                },
                label:{
                    text: license,
                    font: SysConfig.getConfig().car_label_size + 'px Helvetica',
                    fillColor: Cesium.Color.fromCssColorString(SysConfig.getConfig().car_label_color),
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2,
                    eyeOffset:new Cesium.Cartesian3(0,0,-15),
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    scaleByDistance: new Cesium.NearFarScalar(100, 1.0, 3000, 0.4)
                }
            });                   
        }

        function setModelVisible(visible)
        {
            var modelIds = getModelNodes();
            modelIds.forEach(modelId => {
                var entity = viewer.entities.getById(modelId);
                if (entity) {
                    entity.show = visible
                }
            });
        }

        function setLabelVisible(visible)
        {
            var modelIds = getModelNodes();
            modelIds.forEach(modelId => {
                var entity = viewer.entities.getById(modelId);
                if (entity && entity.label) {
                    entity.label.show = visible;
                }
            });
        }

        function getModelNodes()
        {
            var modelIds = [];
            data.forEach(node => {
                node.children.forEach(subNode => {
                    if (subNode.model) {
                        modelIds.push(subNode.model)
                    }
                });
            });
            return modelIds;
        }

        function deleteData(id,nodes){
            nodes = nodes||data;
            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i];
                if (node.params) {
                    if (node.params.id == id) {
                        nodes.splice(i,1);
                        break;
                    }
                }
                else if(node.children)
                {
                    deleteData(id,node.children)
                }
            }
        }
            

        return{
            showCarTree:showCarTree,
            add:add,
            loadCars:loadCars,
            setModelVisible:setModelVisible,
            setLabelVisible:setLabelVisible,
            deleteData:deleteData,
            init:init
        }
    }

    window.Car = car();
}());