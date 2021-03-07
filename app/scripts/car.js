$(function(){
    var zTreeObj;

    var data = [{
        name:'闵行区',
        children:[
            {
                name:'江川路街道',
                children:[
                    // {
                    //     name:'车辆1',
                    //     model:'car_1'
                    // }
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

    setTimeout(() => {
        Car.loadCars();
    }, 2000);
      
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

        function loadCars()
        {
            $.get(API_ROOT + '/api/car',function(response){
                if (response.succeeded) {
                    response.data.forEach(car => {
                        if (car.id != 1) {
                            addEntity(car.id,car.license,car.type,car.longitude,car.latitude,car.height,car.path);
                        }
                        add(car.license,'car_' + car.id);
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
                    scale = 15;
                    break;
                case '消防车':
                    uri = '/data/model/fire_truck.glb';
                    scale = 1;
                    break;
                case '救护车':
                    uri = '/data/model/ambulance.glb';
                    scale = 1.5;
                    break;
                case '警用摩托':
                    uri = '/data/model/motorcycle.glb';
                    scale = 0.02;
                    break;
                case '反制车':
                    uri = '/data/model/armored_car.glb';
                    scale = 1;
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
                    scale:scale
                },
                label:{
                    text: license,
                    font: SysConfig.getConfig().model_label_size + 'px Helvetica',
                    fillColor: Cesium.Color.fromCssColorString(SysConfig.getConfig().model_label_color),
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2,
                    eyeOffset:new Cesium.Cartesian3(0.0, 4, 0.0),
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    scaleByDistance: new Cesium.NearFarScalar(100, 1.0, 200, 0.4)
                }
            });                   
        }
            

        return{
            showCarTree:showCarTree,
            add:add,
            loadCars:loadCars
        }
    }

    window.Car = car();
}());