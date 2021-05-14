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
        // {
        //     name:'记录仪',
        //     children:[]
        // },
        // {
        //     name:'定位器',
        //     children:[]
        // }
    ]

    $('#modal_person').on('show.bs.modal', function (event) {
        Person.showPersonTree();
    });

    $('#modal_person').on('hide.bs.modal', function (event) {
        $('#btn_person_delete').attr("disabled",true); 
        $('#btn_person_binding').attr("disabled",true); 
        $('#btn_person_unbinding').attr("disabled",true); 
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

    /****
     * 显示绑定设备窗口
     */
    $('#btn_person_binding').on('click',function(){
        var nodes = personTreeObj.getSelectedNodes();
        if (nodes.length > 0 && nodes[0].params) {
            Person.refreshDeviceTree();
            $('#modal_device_select').modal('show');
        }
        else
        {
            Toast.show('提示','请选择人员');
        }
    });

    /**
     * 解绑设备
     */
    $('#btn_person_unbinding').on('click',function(){
        var nodes = personTreeObj.getSelectedNodes();
        if (nodes.length > 0 && nodes[0].params) {
            $.post(API_ROOT + '/api/person/un-bi-unbinding/' + nodes[0].params.id,function(response){
                if (response.succeeded) {
                    nodes[0].params.deviceId = 0;
                    personTreeObj.updateNode(nodes[0]);
                    Toast.show('提示','解绑成功');
                }
                else
                {
                    console.error(response.errors);
                }
            })
        }
        else
        {
            Toast.show('提示','请选择人员');
        }
    });

    /*****
     * 绑定设备
     */
    $('#btn_device_select_ok').on('click',function(){
        var deviceNodes = deviceTreeObj.getSelectedNodes();
        if (deviceNodes.length > 0 && deviceNodes[0].params) {
            var personNodes = personTreeObj.getSelectedNodes();
            if (personNodes.length > 0 && personNodes[0].params) {
                var data = {
                    personId:personNodes[0].params.id,
                    deviceId:deviceNodes[0].params.id
                }
                $.ajax({
                    type: 'POST',
                    url: API_ROOT + '/api/person/binding',
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(data),
                    dataType: 'json',
                    success: function (response) {
                        if (response.succeeded) {
                            debugger
                            personNodes[0].params.deviceId = response.data.deviceId;
                            personTreeObj.updateNode(personNodes[0]);
                            Toast.show('提示','绑定成功');
                            $('#modal_device_select').modal('hide');
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
        }
        else
        {
            Toast.show('提示','请选择设备');
        }
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

    setInterval(() => {
        Person.updateLocation();
    }, 15 * 1000);
      
    function person(){

        function showPersonTree(){
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
                            $('#btn_person_delete').attr("disabled",false); 
                            if (treeNode.params.deviceId) {
                                $('#btn_person_binding').attr("disabled",true); 
                                $('#btn_person_unbinding').attr("disabled",false); 
                            }
                            else
                            {
                                $('#btn_person_binding').attr("disabled",false); 
                                $('#btn_person_unbinding').attr("disabled",true); 
                            }
                        }
                        else
                        {
                            $('#btn_person_delete').attr("disabled",true); 
                            $('#btn_person_binding').attr("disabled",true); 
                            $('#btn_person_unbinding').attr("disabled",true); 
                        }
                    }
                }
            };
            
            personTreeObj = $.fn.zTree.init($('#person_tree'), setting, data);
            deviceTreeObj = $.fn.zTree.init($('#device_select_tree'), {}, deviceData);
        }

        function refreshDeviceTree(){
            clearDeviceNode();
            $.get(API_ROOT + '/api/device/unbinding-list',function(response){
                if (response.succeeded) {
                    var devices = response.data;
                    devices.forEach(device => {
                        var newNode = {
                            name:device.name?device.name:device.license,
                            params:device
                        };
                        
                        if (deviceTreeObj) {
                            var parentNode = deviceTreeObj.getNodeByParam('name',device.type);
                            parentNode && deviceTreeObj.addNodes(parentNode,-1,newNode);
                        }
                    });
                    
                }
            });

        }

        function clearDeviceNode()
        {
            deviceData.forEach(data => {
                var parentNode = deviceTreeObj.getNodeByParam('name',data.name);
                if (deviceTreeObj && parentNode) {
                    deviceTreeObj.removeChildNodes(parentNode);
                }
            });
        }

        function add(name,type,modelId,params)
        {
            var newNode = {
                name:name,
                model:modelId,
                params:params,
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

        function getLocationUrl(subNode,callback)
        {
            $.get(API_ROOT + '/api/device/one/' + subNode.params.deviceId,function(response){
                if (response.succeeded) {
                    subNode.params.locationUrl = response.data.locationUrl;
                    if (callback) {
                        callback(subNode.model, subNode.params.locationUrl);
                    }
                    
                }
            })
        }

        function updateLocation(){
            if (personTreeObj) {
                var nodes = personTreeObj.getNodes();
            }
            else
            {
                nodes = data;
            }
            nodes.forEach(node => {
                node.children.forEach(subNode => {
                    if (subNode.params && subNode.params.deviceId && subNode.model) {
                        if (subNode.locationUrl) {
                            setEntityLocation(subNode.model,subNode.locationUrl);
                        }
                        else
                        {
                            getLocationUrl(subNode,setEntityLocation);
                        }
                    }
                });
            });
        }

        function setEntityLocation(entityId,locationUrl)
        {
            var entity = viewer.entities.getById(entityId);
            if (entity) {
                $.get(locationUrl,function(response){
                    if (response.data) {
                        var height = response.data.height;
                        if (!height) {
                            height = viewer.scene.getHeight(response.data.longitude, response.data.latitude);
                            (!height) && (height = 1)
                        }
                        var position = Cesium.Cartesian3.fromDegrees(response.data.longitude, response.data.latitude, height);
                        entity.position = position;
                    }
                })
            }
        }

        return{
            showPersonTree:showPersonTree,
            add:add,
            loadPersons:loadPersons,
            setModelVisible:setModelVisible,
            setLabelVisible:setLabelVisible,
            refreshDeviceTree:refreshDeviceTree,
            updateLocation:updateLocation
        }
    }

    window.Person = person();
}());