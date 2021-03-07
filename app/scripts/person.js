$(function(){

    var zTreeObj;

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
                            //     name:'人员1',
                            //     model:'person_1'
                            // }
                        ]
                    }
                ]
            }
        ]
    }];

    $('#modal_person').on('show.bs.modal', function (event) {
        Person.showPersonTree();
    });

    setTimeout(() => {
        Person.loadPersons();
    }, 2000);
      
    function person(){

        function showPersonTree(){
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
            
            zTreeObj = $.fn.zTree.init($('#person_tree'), setting, data);
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

        function loadPersons(){
            $.get(API_ROOT + '/api/person',function(response){
                if (response.succeeded) {
                    response.data.forEach(person => {
                        var numberStr = '';
                        if (person.number > 1) {
                            numberStr = '(' + person.number + ')';
                        }
                        var name = person.name + numberStr;
                        addEntity(person.id,name,person.type,person.longitude,person.latitude,person.height);
                        add(name,'person_' + person.id);
                    });
                }
            });
        }

        function addEntity(key,name,type,lng,lat,height){
            var uri = '';
            var scale = 1;
            switch (type) {
                case '警察':
                    uri = '/data/model/police.glb'
                    scale = 10;
                    break;
                case '医护人员':
                    uri = '/data/model/doctor.glb';
                    scale = 1.2;
                    break;
                case '保安':
                    uri = '/data/model/guard.glb';
                    scale = 0.45;
                    break;
                default:
                    break;
            }
            viewer.entities.add({
                name: name,
                id:'person_' + key,
                position: new Cesium.Cartesian3.fromDegrees(lng, lat, height),
                model: {
                    uri: uri,
                    scale:scale
                },
                label:{
                    text: name,
                    font: SysConfig.getConfig().model_label_size + 'px Helvetica',
                    fillColor: Cesium.Color.fromCssColorString(SysConfig.getConfig().model_label_color),
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2,
                    eyeOffset:new Cesium.Cartesian3(0.0, 2.5, 0.0),
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    scaleByDistance: new Cesium.NearFarScalar(100, 1.0, 200, 0.4)
                }
            });        
        }

        return{
            showPersonTree:showPersonTree,
            add:add,
            loadPersons:loadPersons
        }
    }

    window.Person = person();
}());