$(function(){

    var personTreeObj,deviceTreeObj;

    var data = [
        {
            name:'警察',
            children:[]
        },
        {
            name:'安保人员',
            children:[]
        },
        {
            name:'医护人员',
            children:[]
        },
        {
            name:'消防员',
            children:[]
        }
    ];

    var deviceData = [
        {
            name:'对讲机',
            children:[]
        },
        {
            name:'记录仪',
            children:[]
        },
        {
            name:'定位器',
            children:[]
        }
    ]

    $('#modal_person').on('show.bs.modal', function (event) {
        Person.showPersonTree();
    });

    $('#modal_person').on('hide.bs.modal', function (event) {
        $('.corner-btn-group .inner .box').removeClass('active')
    });

    $('#btn_person_delete').on('click',function(){
        var nodes = personTreeObj.getSelectedNodes();
        if (nodes.length > 0 && nodes[0].params && nodes[0].model) {
            var entity = viewer.entities.getById(nodes[0].model);
            var url = API_ROOT + '/api/person/' + nodes[0].params.id;
            $.ajax({
                type: 'DELETE',
                url: url,
                success: function (response) {
                    if (response.succeeded) {
                        if (entity) {
                            viewer.entities.remove(entity);
                        }
                        personTreeObj.removeNode(nodes[0]);
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
            Toast.show('提示','请选择人员');
        }
    });

    $('#btn_person_binding').on('click',function(){
        var nodes = personTreeObj.getSelectedNodes();
        if (nodes.length > 0 && nodes[0].params) {
            $('#modal_device_select').modal('show');
        }
        else
        {
            Toast.show('提示','请选择人员');
        }
    });

    $('#btn_person_unbinding').on('click',function(){
        var nodes = personTreeObj.getSelectedNodes();
        if (nodes.length > 0 && nodes[0].params) {
            
        }
        else
        {
            Toast.show('提示','删除成功');
        }

    });

    $('#btn_device_select_ok').on('click',function(){

    });

    $('#btn_device_select_cancle').on('click',function(){
        $('#modal_device_select').modal('hide');
    });

    $('#person_show_model').on('change',function(){
        Person.setModelVisible($(this).prop('checked'));
    })

    $('#person_show_label').on('change',function(){
        Person.setLabelVisible($(this).prop('checked'));
    })

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
            
            personTreeObj = $.fn.zTree.init($('#person_tree'), setting, data);

            deviceTreeObj = $.fn.zTree.init($('#device_select_tree'), {}, deviceData);
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
            if (personTreeObj) {
                var parentNode = personTreeObj.getNodeByParam('name',type);
                personTreeObj.addNodes(parentNode,-1,newNode);
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
                        add(name,person.type,'person_' + person.id,person);
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
                    break;
                case '医护人员':
                    uri = '/data/model/doctor.glb';
                    break;
                case '安保人员':
                    uri = '/data/model/guard.glb';
                    break;
                case '消防员':
                    uri = '/data/model/fire_man.glb';
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
                    font: SysConfig.getConfig().person_label_size + 'px Helvetica',
                    fillColor: Cesium.Color.fromCssColorString(SysConfig.getConfig().person_label_color),
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2,
                    eyeOffset:new Cesium.Cartesian3(0.0, 2.5, 0.0),
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    scaleByDistance: new Cesium.NearFarScalar(100, 1.0, 200, 0.4)
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

        return{
            showPersonTree:showPersonTree,
            add:add,
            loadPersons:loadPersons,
            setModelVisible:setModelVisible,
            setLabelVisible:setLabelVisible
        }
    }

    window.Person = person();
}());