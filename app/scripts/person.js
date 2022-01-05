$(function(){

    var personTreeObj,deviceTreeObj;

    var data = [];

    var deviceData = []

    $('#modal_person').on('show.bs.modal', function (event) {
        Person.showPersonTree();
    });

    $('#modal_person').on('hide.bs.modal', function (event) {
        $('#btn_person_delete').attr('disabled',true); 
        $('#btn_person_edit').attr('disabled',true); 
        $('#btn_person_binding').attr('disabled',true); 
        $('#btn_person_unbinding').attr('disabled',true); 
    });

    /**
     * 编辑人员信息
     */
    $('#btn_person_edit').on('click',function(){
        var nodes = personTreeObj.getSelectedNodes();
        if (nodes.length > 0 && nodes[0].params)
        {
            Edit.showModal('人员',nodes[0].params,function(edata){
                var name = edata.name;
                nodes[0].name = name;
                personTreeObj.updateNode(nodes[0]);
                data.forEach(node => {
                    node.children.forEach(subNode => {
                        if (subNode.params.id == edata.id) {
                            subNode.params = edata;
                            subNode.name = name;
                            return;
                        }
                    });
                });
            });
        }
        else
        {
            Toast.show('提示','请选择人员');
        }
    });

    /**
     * 删除人员
     */
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
                        Person.deleteData(nodes[0].params.id);
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
                    Person.setDataAttribute(nodes[0].params.id,{deviceId:0});
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
                            personNodes[0].params.deviceId = response.data.deviceId;
                            personTreeObj.updateNode(personNodes[0]);
                            Person.setDataAttribute(personNodes[0].params.id,{deviceId:response.data.deviceId});
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

    setInterval(() => {
        Person.updateLocation();
    }, 15 * 1000);
      
    function person(){

        function init(){
            data = [];
            deviceData = [];
            $.get(`${API_ROOT}/api/fitting/by-type/人员`,function(response){
                response.data.forEach(fitting => {
                    fitting.children = [];
                    data.push(fitting);
                });
                loadPersons();
            });
            $.get(`${API_ROOT}/api/fitting/can-bind-list`,function(response){
                response.data.forEach(fitting => {
                    fitting.children = [];
                    deviceData.push(fitting);
                });
            });
        }

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
                            $('#btn_person_delete').attr('disabled',false); 
                            $('#btn_person_edit').attr('disabled',false); 
                            if (treeNode.params.deviceId) {
                                $('#btn_person_binding').attr('disabled',true); 
                                $('#btn_person_unbinding').attr('disabled',false); 
                            }
                            else
                            {
                                $('#btn_person_binding').attr('disabled',false); 
                                $('#btn_person_unbinding').attr('disabled',true); 
                            }
                        }
                        else
                        {
                            $('#btn_person_delete').attr('disabled',true); 
                            $('#btn_person_edit').attr('disabled',true); 
                            $('#btn_person_binding').attr('disabled',true); 
                            $('#btn_person_unbinding').attr('disabled',true); 
                        }
                    }
                }
            };
            
            personTreeObj = $.fn.zTree.init($('#person_tree'), setting, data);
            deviceTreeObj = $.fn.zTree.init($('#device_select_tree'), {}, deviceData);
        }

        function refreshDeviceTree(){
            clearDeviceNode();
            $.get(`${API_ROOT}/api/device/unbinding-list/${currentProject.id}`,function(response){
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
            $.get(`${API_ROOT}/api/person/${currentProject.id}`,function(response){
                if (response.succeeded) {
                    response.data.forEach(person => {
                        var name = person.name;
                        addEntity(person.id,name,person.type,person.longitude,person.latitude,person.height);
                        add(name,person.type,'person_' + person.id,person);
                    });
                }
            });
        }

        function addEntity(key,name,type,lng,lat,height){
            var fitting = getFitting(type);
            if (!fitting || !fitting.model) {
                return;
            }
            var uri = `${API_ROOT}/api/file/download/${fitting.model}`
            var scale = fitting.scale;
            viewer.entities.add({
                name: name,
                id:'person_' + key,
                position: new Cesium.Cartesian3.fromDegrees(lng, lat, height),
                model: {
                    uri: uri,
                    scale:scale,
                    maximumScale:scale * 3,
                    minimumPixelSize:128
                },
                label:{
                    text: name,
                    font: SysConfig.getConfig().person_label_size + 'px Helvetica',
                    fillColor: Cesium.Color.fromCssColorString(SysConfig.getConfig().person_label_color),
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

        function getLocationUrl(subNode,callback)
        {
            $.get(API_ROOT + '/api/device/one/' + subNode.params.deviceId,function(response){
                if (response.succeeded && response.data) {
                    subNode.params.locationUrl = response.data.locationUrl;
                    if (callback) {
                        callback(subNode.model, subNode.params.locationUrl);
                    }
                }
            })
        }

        /**
         * 更新位置，统一的
         */
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
            if (!locationUrl) {
                return;
            }
            var entity = viewer.entities.getById(entityId);
            if (entity) {
                $.post(locationUrl,async function(response){
                    if (response.data) {
                        var height = response.data.height;
                        if (!height) {
                            height = await viewer.scene.getHeight2(response.data.longitude, response.data.latitude);
                            (!height) && (height = 1)
                        }
                        var position = Cesium.Cartesian3.fromDegrees(response.data.longitude, response.data.latitude, height);
                        entity.position = position;
                    }
                })
            }
        }

        /***
         * 删除data下的数据
         */
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

        /***
         * 设置data下的属性
         */
        function setDataAttribute(id,attributes,nodes)
        {
            nodes = nodes||data;
            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i];
                if (node.params) {
                    if (node.params.id == id) {
                        for (const key in attributes) {
                            if (Object.hasOwnProperty.call(attributes, key)) {
                                node.params[key] = attributes[key]; 
                            }
                        }  
                        break;
                    }
                }
                else if(node.children)
                {
                    setDataAttribute(id,attributes,node.children)
                }
            }
        }

        /*****
         * 更新位置，专门针对对讲机
         */
        function UpdateUnipptLocation(location) {
            if (personTreeObj) {
                var nodes = personTreeObj.getNodes();
            }
            else
            {
                nodes = data;
            }
            nodes.forEach(node => {
                node.children.forEach(subNode => {
                    let entity = viewer.entities.getById(subNode.model);
                    if (subNode.params && subNode.params.deviceId && entity) {
                        getDeviceLicense(subNode.params.deviceId,async function(license){
                            if (license == location.Uid) {
                                let height = await viewer.scene.getHeight2(location.Lng, location.Lat);
                                (!height) && (height = 1)
                                var position = Cesium.Cartesian3.fromDegrees(location.Lng, location.Lat, height);
                                entity.position = position;
                            }
                        })
                    }
                });
            });
        }

        function getDeviceLicense(id,callback)
        {
            $.get(API_ROOT + '/api/device/one/' + id,function(response){
                if (response.succeeded && response.data) {
                    callback(response.data.license);
                }
            })
        }

        function getFitting(name)
        {
            for (let index = 0; index < data.length; index++) {
                const fitting = data[index];
                if (fitting.name == name) {
                    return fitting;
                }
            }
        }

        return{
            showPersonTree:showPersonTree,
            add:add,
            loadPersons:loadPersons,
            setModelVisible:setModelVisible,
            setLabelVisible:setLabelVisible,
            refreshDeviceTree:refreshDeviceTree,
            updateLocation:updateLocation,
            UpdateUnipptLocation:UpdateUnipptLocation,
            deleteData:deleteData,
            setDataAttribute:setDataAttribute,
            init:init
        }
    }

    window.Person = person();
}());