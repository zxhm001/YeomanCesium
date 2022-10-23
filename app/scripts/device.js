$(function(){
    var zTreeObj,viewshed3D,_rangeEntity,_player;
    var _pocWSState = 0,_locWSState = 0,_unipptDeviceState = [],_unipptDeviceLocation = [];


    var data = [];

    $('#modal_device').on('show.bs.modal', function (event) {
        Device.showDeviceTree();
        $.get(API_ROOT + '/api/fitting/can-bind-list',function(response){
            if (response.succeeded) {
                $('#device_input_type').empty();
                response.data.forEach(fitting => {
                    $('#device_input_type').append(`<option value="${fitting.name}">${fitting.name}</option>`);
                });
            }
        });
    });

    $('#modal_device').on('hide.bs.modal', function (event) {
        if (_rangeEntity) {
            viewer.entities.remove(_rangeEntity);
        }
        Device.clearViewshed();
        $('#player-container').hide();
        if (_player) {
            _player.stop();
        }
        $('#btn_device_delete').attr('disabled',true); 
    });


    /**
     * 编辑设备信息
     */
     $('#btn_device_edit').on('click',function(){
        var nodes = zTreeObj.getSelectedNodes();
        if (nodes.length > 0 && nodes[0].params)
        {
            Edit.showModal('设备',nodes[0].params,function(edata){
                var license = edata.name?edata.name:edata.license;
                nodes[0].name = license;
                //nodes[0].params = data;
                zTreeObj.updateNode(nodes[0]);
                data.forEach(node => {
                    node.children.forEach(subNode => {
                        if (subNode.params.id == edata.id) {
                            subNode.params = edata;
                            subNode.name = license;
                            return;
                        }
                    });
                });
            });
        }
        else
        {
            Toast.show('提示','请选择设备');
        }
    });


    /**
     * 删除设备
     */
    $('#btn_device_delete').on('click',function(){
        var nodes = zTreeObj.getSelectedNodes();
        if (nodes.length > 0 && nodes[0].params) {
            var entity = viewer.entities.getById(nodes[0].model);
            var url = API_ROOT + '/api/device/' + nodes[0].params.id;
            $.ajax({
                type: 'DELETE',
                url: url,
                success: function (response) {
                    if (response.succeeded) {
                        if (entity) {
                            viewer.entities.remove(entity);
                        }
                        if (_rangeEntity) {
                            viewer.entities.remove(_rangeEntity);
                        }
                        zTreeObj.removeNode(nodes[0]);
                        Device.deleteData(nodes[0].params.id);
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
            Toast.show('提示','请选择设备');
        }
    });

    $('#device_show_model').on('change',function(){
        Device.setModelVisible($(this).prop('checked'));
    })

    $('#device_show_label').on('change',function(){
        Device.setLabelVisible($(this).prop('checked'));
    })

    $('#btn_device_add').on('click',function(){
        $('#device_params').show();
    });

    $('#btn_device_cancle').on('click',function(){
        $('#device_params').hide();
        $('#device_params')[0].reset()
    });

    $('#btn_device_submit').on('click',function(){
        var params = $('#device_params').serializeToJSON();
        var url = API_ROOT + '/api/device';
        var data = {
            name:params.name,
            license:params.license,
            type:params.type,
            locationUrl:params.locationurl,
            rtmpUrl:params.rtmpurl,
            projectId:currentProject.id
        };
        $.ajax({
            type: 'POST',
            url: url,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(data),
            dataType: 'json',
            success: function (response) {
                if (response.succeeded) {
                    Device.add(params.name,params.type,null,params);
                    Toast.show('提示','添加成功');
                    $('#device_params').hide();
                    $('#device_params')[0].reset()
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
    });

    function device(){

        function init(){
            
            data = [];
            $.get(`${API_ROOT}/api/fitting/by-type/设备`,function(response){
                response.data.forEach(fitting => {
                    fitting.children = [];
                    data.push(fitting);
                });
                loadDevices();
                if (!_pocWSState) {
                    startPocWS();
                }
                if (!_locWSState) {
                    startLocaWS();
                }
            });
            
            // if (zTreeObj) {
            //     $.fn.zTree.destroy("device_tree");
            //     zTreeObj = null;
            // }
        }

        function showDeviceTree(){
            var setting = {
                callback:{
                    onDblClick:function(event, treeId, treeNode){
                        $('#device-params').hide();
                        if (treeNode.model) {
                            $('#player-container').hide();
                            if (_player) {
                                _player.stop();
                            }
                            var model = viewer.entities.getById(treeNode.model);
                            viewer.flyTo(model); 
                            if (treeNode.params.rtmpUrl) {
                                setTimeout(() => {
                                    $('#player-container').show();
                                }, 1500);
                                _player = cyberplayer('player-container').setup({
                                    width: 320,
                                    height: 180,
                                    file: treeNode.params.rtmpUrl,
                                    autostart: true,
                                    stretching: 'uniform',
                                    volume: 100,
                                    controls: true,
                                    rtmp: {
                                        reconnecttime: 5, // rtmp直播的重连次数
                                        bufferlength: 1 // 缓冲多少秒之后开始播放 默认1秒
                                    },
                                    ak: '8f401f03112143f2802e00dfe2ba25bd' // 公有云平台注册即可获得accessKey
                                });
                                
                            }
                        }
                    },
                    onClick:function(event, treeId, treeNode)
                    {
                        Device.clearViewshed();
                        if (_rangeEntity) {
                            viewer.entities.remove(_rangeEntity);
                        }
                        if (treeNode.params) {
                            $('#btn_device_edit').attr('disabled',false); 
                            $('#btn_device_delete').attr('disabled',false); 
                            if (treeNode.params.range) {
                                var model = viewer.entities.getById(treeNode.model);
                                Device.showRange(model._position._value,treeNode.params.range);
                            }
                            if (treeNode.params.distance) {
                                Device.showViewshed(treeNode.params.longitude,treeNode.params.latitude,treeNode.params.height,
                                    treeNode.params.direction,treeNode.params.pitch,treeNode.params.distance,treeNode.params.verticalFov,treeNode.params.horizontalFov);
                            }
                        }
                        else
                        {
                            $('#btn_device_edit').attr('disabled',true); 
                            $('#btn_device_delete').attr('disabled',true); 
                        }
                    }
                }
            };
            zTreeObj = $.fn.zTree.init($('#device_tree'), setting, data);
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

        function addEntity(key,license,type,lng,lat,height,orientation)
        {
            var fitting = getFitting(type);
            if (!fitting || !fitting.model || fitting.canBind) {
                return;
            }
            var uri = `${API_ROOT}/api/file/download/${fitting.model}`
            var scale = fitting.scale;
            const position = new Cesium.Cartesian3.fromDegrees(lng, lat, height);
            viewer.entities.add({
                name: license,
                id:'device_' + key,
                position: position,
                orientation:getOrientation(position,orientation),
                model: {
                    uri: uri,
                    scale:scale,
                    maximumScale:scale * 10,
                    minimumPixelSize:128
                },
                label:{
                    text: license,
                    font: SysConfig.getConfig().device_label_size +'px Helvetica',
                    fillColor: Cesium.Color.fromCssColorString(SysConfig.getConfig().device_label_color),
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2,
                    eyeOffset:new Cesium.Cartesian3(0,0,-15),
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    scaleByDistance: new Cesium.NearFarScalar(100, 1.0, 3000, 0.4)
                }
            });  
        }
        
        var getOrientation = (position,ori)=>{
            const heading = Cesium.Math.toRadians(ori||0);
            const pitch = Cesium.Math.toRadians(0);
            const roll = Cesium.Math.toRadians(0);
            const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
            const orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);
            return orientation;
        }

        function loadDevices()
        {
            $.get(`${API_ROOT}/api/device/${currentProject.id}`,function(response){
                if (response.succeeded) {
                    response.data.forEach(device => {
                        var license = device.name?device.name:device.license;
                        addEntity(device.id,license,device.type,device.longitude,device.latitude,device.height,device.orientation);
                        add(license,device.type,'device_' + device.id,device);
                    });
                }
            });
        }

        var r1 = 1,r2 = 1;
        var _maxR = 100;

        function showRange(position,maxR)
        {
            if (_rangeEntity) {
                viewer.entities.remove(_rangeEntity);
            }
            _maxR = maxR;
            var cartographic = Cesium.Cartographic.fromCartesian(position);
            var height = cartographic.height;
            _rangeEntity = viewer.entities.add({
                position:position,
                ellipse : {
                    semiMinorAxis :new Cesium.CallbackProperty(setR1,false),
                    semiMajorAxis :new Cesium.CallbackProperty(setR2,false),
                    height:height,
                    material:new Cesium.ImageMaterialProperty({
                        image:'/images/ellipse.png',
                        repeat:new Cesium.Cartesian2(1.0, 1.0),
                        transparent:true,
                        color:new Cesium.CallbackProperty(function () {
                            var alp=1-r1/maxR;
                            return Cesium.Color.WHITE.withAlpha(alp)
                        },false)
                    })
                }
            });
        }

        
        function setR1()
        {
            r1=r1+1;
            if(r1>=_maxR){
                r1=1;
            }
            return r1;
        }

        function setR2()
        {
            r2=r2+1;
            if(r2>=_maxR){
                r2=1;
            }
            return r2;
        }

        function showViewshed(longitude,latitude,height,direction,pitch,distance,verticalFov,horizontalFov)
        {
            if (PLATFORM == 'SuperMap') {
                if (horizontalFov < 180) {
                    if (!viewshed3D) {
                        viewshed3D = new Cesium.ViewShed3D(viewer.scene);
                    }
                    viewshed3D = new Cesium.ViewShed3D(viewer.scene);
                    viewshed3D.direction = direction;
                    viewshed3D.pitch = pitch;
                    viewshed3D.distance = distance;
                    viewshed3D.verticalFov = verticalFov?verticalFov:90;
                    viewshed3D.horizontalFov = horizontalFov?horizontalFov:120;
                    //viewshed3D.hintLineColor  = Cesium.Color.TRANSPARENT;
                    viewshed3D.viewPosition = [longitude, latitude, height + 1.5];
                    viewshed3D.build();
                }
                else
                {
                    let ehorizontalFov = horizontalFov;
                    let cDirction = direction;
                    //MultiViewShed3D不好用
                    //viewshed3D = new Cesium.MultiViewShed3D(viewer.scene);
                    viewshed3D = [];
                    while (ehorizontalFov > 0) {
                        let chorizontalFov = 120;
                        if (ehorizontalFov < 120) {
                            chorizontalFov = ehorizontalFov;
                        }
                        if (cDirction != direction) {
                            cDirction += chorizontalFov/2;
                        }
                        var viewshed3DPartial = new Cesium.ViewShed3D(viewer.scene);
                        viewshed3DPartial.direction = cDirction;
                        viewshed3DPartial.pitch = pitch;
                        viewshed3DPartial.distance = distance;
                        viewshed3DPartial.verticalFov = verticalFov?verticalFov:90;
                        viewshed3DPartial.horizontalFov = chorizontalFov;
                        //viewshed3DPartial.hintLineColor  = Cesium.Color.TRANSPARENT;
                        viewshed3DPartial.viewPosition = [longitude, latitude, height + 1.5];
                        //viewshed3D.addViewShed(viewshed3DPartial);
                        viewshed3DPartial.build();
                        viewshed3D.push(viewshed3DPartial);
                        cDirction += chorizontalFov/2;
                        ehorizontalFov = ehorizontalFov - chorizontalFov;
                    }
                    //viewshed3D.build();
                }
            }
            else if (PLATFORM == 'MapGIS')
            {
                if (horizontalFov < 180) {
                    var advancedAnalysisManager = new CesiumZondy.Manager.AdvancedAnalysisManager({
                        viewer: viewer
                    });
                    //创建可视化分析对象
                    viewshed3D = advancedAnalysisManager.createViewshedAnalysis();
                    viewshed3D.viewPosition = new Cesium.Cartesian3.fromDegrees(longitude, latitude, height + 1.5);
                    viewshed3D.horizontAngle = horizontalFov;
                    viewshed3D.verticalAngle = verticalFov;
                    var destination = calculatingTargetPoints(longitude, latitude,height + 1.5,direction,distance);
                    viewshed3D.targetPosition = new Cesium.Cartesian3.fromDegrees(destination[0], destination[1], height + 1.5);
                    viewer.scene.VisualAnalysisManager.add(viewshed3D);
                }
                else
                {
                    let ehorizontalFov = horizontalFov;
                    let cDirction = direction;
                    viewshed3D = [];
                    var advancedAnalysisManager = new CesiumZondy.Manager.AdvancedAnalysisManager({
                        viewer: viewer
                    });
                    while (ehorizontalFov > 0) {
                        let chorizontalFov = 60;
                        if (ehorizontalFov < 60) {
                            chorizontalFov = ehorizontalFov;
                        }
                        if (cDirction != direction) {
                            cDirction += chorizontalFov/2;
                        }
                        var viewshed3DPartial = advancedAnalysisManager.createViewshedAnalysis();
                        viewshed3DPartial._depthTestEnabled = false
                        viewshed3DPartial.viewPosition = new Cesium.Cartesian3.fromDegrees(longitude, latitude, height + 1.5);
                        viewshed3DPartial.horizontAngle = chorizontalFov;
                        viewshed3DPartial.verticalAngle = verticalFov;
                        var destination = calculatingTargetPoints(longitude, latitude,height + 1.5,cDirction * Math.PI/180,distance);
                        viewshed3DPartial.targetPosition = new Cesium.Cartesian3.fromDegrees(destination[0], destination[1], height + 1.5);
                        viewer.scene.VisualAnalysisManager.add(viewshed3DPartial);
                        viewshed3D.push(viewshed3DPartial);
                        cDirction += chorizontalFov/2;
                        ehorizontalFov = ehorizontalFov - chorizontalFov;
                    }
                }
                
            }
        }

        function clearViewshed()
        {
            if (PLATFORM == 'SuperMap') {
                if (viewshed3D) {
                    if (viewshed3D instanceof Array) {
                        viewshed3D.forEach(viewshed3DPartial => {
                            viewshed3DPartial.destroy();
                        });
                    }
                    else
                    {
                        viewshed3D.destroy();
                    }
                    viewshed3D = null;
                }
            }
            else if (PLATFORM == 'MapGIS')
            {
                if (viewshed3D) {
                    viewer.scene.VisualAnalysisManager.removeAll()
                    viewshed3D = null;
                }
            }
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

        function setPositionData(id,longitude,latitude,height)
        {
            data.forEach(node => {
                node.children.forEach(subNode => {
                    if (subNode.params.id == id) {
                        subNode.params.longitude = longitude;
                        subNode.params.latitude = latitude;
                        subNode.params.height = height;
                    }
                });
            });
            if (zTreeObj) {
                var node = zTreeObj.getNodeByParam('model','device_' + id)
                node.params.longitude = longitude;
                node.params.latitude = latitude;
                node.params.height = height;
            }
        }

        function startPocWS()
        {
            setInterval(() => {
                
                if (!_pocWSState) {
                    var pocWs = new WebSocket(Uniptt_POC_URL);
                    pocWs.onopen = function(evt){
                        pocWs.send(`{"Code":40000,"SerialNum":1,"LoginName":"${SysConfig.getConfig().uniptt_user_name}","Password":"${SysConfig.getConfig().uniptt_password}","Lang":"zh"}`);
                    };

                    pocWs.onmessage  = function(evt){
                        var data = JSON.parse(evt.data);
                        if (data.Code == 40000 && data.Result == 2200) {
                            _pocWSState = 1;
                        }
                        else if (data.Code == 40019 && data.Result == 2200) {
                            _unipptDeviceState = data.Users;
                        }
                    };

                    pocWs.onerror = function(evt){
                        console.error('对讲机状态SOCKET错误',evt);
                    };

                    pocWs.onclose = function(evt){
                        _pocWSState = 0;
                    };
                }
            }, 10 * 1000);
        }

        function startLocaWS(){
            setInterval(() => {
                if (!_locWSState) {
                    var locWs = new WebSocket(Uniptt_LOC_URL);
                    locWs.onopen = function(evt){
                        locWs.send(`{"Code":20000,"Data":{"LoginName":"${SysConfig.getConfig().uniptt_user_name}","Password":"${SysConfig.getConfig().uniptt_password}","Lang":"zh"}}`);
                    };

                    locWs.onmessage  = function(evt){
                        var data = JSON.parse(evt.data);
                        if (data.Code == 24000 && data.Data.Result == 2200) {
                            locWs.send('{"Code":20002}');
                            _locWSState = 1;
                        }
                        else if (data.Code == 24001) {
                            _unipptDeviceLocation = data.Data;
                        }
                        else if(data.Code == 24002)
                        {
                            for (let i = 0; i < _unipptDeviceLocation.length; i++) {
                                const element = _unipptDeviceLocation[i];
                                if (element.Uid == data.Data.Uid) {
                                    _unipptDeviceLocation.splice(i,1);
                                    break;
                                }
                            }
                            _unipptDeviceLocation.push(data.Data)
                            Person.UpdateUnipptLocation(data.Data);
                        }
                    };

                    locWs.onerror = function(evt){
                        console.error('对讲机位置SOCKET错误',evt);
                    };

                    locWs.onclose = function(evt){
                        _locWSState = 0;
                    };
                }
            }, 10 * 1000);
        }

        function isOnline(license){
            var isOnline = false;
            for (let i = 0; i < _unipptDeviceState.length; i++) {
                const deviceState = _unipptDeviceState[i];
                if (deviceState.Uid == license) {
                    return deviceState.State;
                } 
            }
            for (let i = 0; i < _unipptDeviceLocation.length; i++) {
                const deviceLocation = _unipptDeviceLocation[i];
                if (deviceLocation.Uid == license) {
                    var time = new Date(parseInt(deviceLocation.Time) * 1000);
                    return (new Date() - time < 60 * 1000);
                } 
            }
            return isOnline;
        }

        function getLocation(license)
        {
            for (let i = 0; i < _unipptDeviceLocation.length; i++) {
                const deviceLocation = _unipptDeviceLocation[i];
                if (deviceLocation.Uid == license) {
                    return {
                        longitude:deviceLocation.Lng,
                        latitude:deviceLocation.Lat,
                        time:deviceLocation.Time
                    };
                } 
            }
        }

        /**
         * 根据距离方向和观察点计算目标点（109.878321 19.963493 82 0 500）
         * @param {Object} lon 经度
         * @param {Object} lat 维度
         * @param {Object} height 高度
         * @param {Object} direction 方向
         * @param {Object} radius 可视距离
         */
        function calculatingTargetPoints(lon, lat, height, direction, radius) {
            // 观察点
            var viewPoint = Cesium.Cartesian3.fromDegrees(lon, lat, height);
            // 世界坐标转换为投影坐标
            var webMercatorProjection = new Cesium.WebMercatorProjection(viewer.scene.globe.ellipsoid);
            var viewPointWebMercator = webMercatorProjection.project(Cesium.Cartographic.fromCartesian(viewPoint));
            // 计算目标点
            var toPoint = new Cesium.Cartesian3(viewPointWebMercator.x + radius * Math.cos(direction), viewPointWebMercator.y +
                radius * Math.sin(direction), 0);
            // 投影坐标转世界坐标
            toPoint = webMercatorProjection.unproject(toPoint);
            toPoint = Cesium.Cartographic.toCartesian(toPoint.clone());
            // 世界坐标转地理坐标
            var cartographic = Cesium.Cartographic.fromCartesian(toPoint);
            var point = [Cesium.Math.toDegrees(cartographic.longitude), Cesium.Math.toDegrees(cartographic.latitude)];
            return point;
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
            showDeviceTree:showDeviceTree,
            add:add,
            showRange:showRange,
            loadDevices:loadDevices,
            showViewshed:showViewshed,
            clearViewshed:clearViewshed,
            setModelVisible:setModelVisible,
            setLabelVisible:setLabelVisible,
            deleteData:deleteData,
            startPocWS:startPocWS,
            startLocaWS:startLocaWS,
            isOnline:isOnline,
            getLocation:getLocation,
            setPositionData:setPositionData,
            init:init
        }
    }

    window.Device = device();
});