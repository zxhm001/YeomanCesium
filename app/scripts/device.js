$(function(){
    var zTreeObj,_rangeEntity,_player;

    var data = [
        {
            name:'布控球',
            children:[]
        },
        {
            name:'反制枪',
            children:[]
        },
        {
            name:'无人机',
            children:[]
        },
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
    ];

    $('#modal_device').on('show.bs.modal', function (event) {
        Device.showDeviceTree();
    });

    $('#modal_device').on('hide.bs.modal', function (event) {
        $('.corner-btn-group .inner .box').removeClass('active')
        if (_rangeEntity) {
            viewer.entities.remove(_rangeEntity);
        }
        $('#player-container').hide();
        if (_player) {
            _player.stop();
        }
    });

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
        $('#device-params').show();
    });

    $('#btn_device_cancle').on('click',function(){
        $('#device-params').hide();
    });

    $('#btn_device_submit').on('click',function(){
        var params = $('#device-params').serializeToJSON();
        var url = API_ROOT + '/api/device';
        var data = {
            name:params.name,
            license:params.license,
            type:params.type,
            locationUrl:params.locationurl,
            rtmpUrl:params.rtmpurl,
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
                    $('#device-params').hide();
                    $('#device-params')[0].reset()
                }
                else
                {
                    console.error(response.errors);
                }
                console.log(response);
            },
            error: function (err) {
                console.error(err);
            }
        });
        console.log(params);
    });

    setTimeout(() => {
        Device.loadDevices();
    }, 2000);

    function device(){
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
                        if (_rangeEntity) {
                            viewer.entities.remove(_rangeEntity);
                        }
                        if (treeNode.params) {
                            if (treeNode.params.range) {
                                var model = viewer.entities.getById(treeNode.model);
                                Device.showRange(model._position._value,treeNode.params.range);
                            }
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

        function addEntity(key,license,type,lng,lat,height)
        {
            var uri = '';
            var scale = 1;
            switch (type) {
                case '反制枪':
                    uri = '/data/model/gun.glb';
                    break;
                case '布控球':
                    uri = '/data/model/camera.glb';
                    break;
                case '无人机':
                    uri = '/data/model/uav.glb';
                    break;
                default:
                    return;
            }
            viewer.entities.add({
                name: license,
                id:'device_' + key,
                position: new Cesium.Cartesian3.fromDegrees(lng, lat, height),
                model: {
                    uri: uri,
                    scale:scale
                },
                label:{
                    text: license,
                    font: SysConfig.getConfig().device_label_size +'px Helvetica',
                    fillColor: Cesium.Color.fromCssColorString(SysConfig.getConfig().device_label_color),
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2,
                    eyeOffset:new Cesium.Cartesian3(0.0, 1.0, 0.0),
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    scaleByDistance: new Cesium.NearFarScalar(100, 1.0, 200, 0.4)
                }
            });  
        }

        function loadDevices()
        {
            $.get(API_ROOT + '/api/device',function(response){
                if (response.succeeded) {
                    response.data.forEach(device => {
                        var numberStr = '';
                        if (device.number > 1) {
                            numberStr = '(' + device.number + ')';
                        }
                        var license = device.name?device.name:device.license + numberStr;
                        addEntity(device.id,license,device.type,device.longitude,device.latitude,device.height);
                        add(license,device.type,'device_' + device.id,device);
                    });
                }
            });
        }

        var r1 = 1,r2 = 1;
        var _maxR = 100;

        //TODO:对于辐射范围可能应该用圆形
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
            showDeviceTree:showDeviceTree,
            add:add,
            showRange:showRange,
            loadDevices:loadDevices,
            setModelVisible:setModelVisible,
            setLabelVisible:setLabelVisible
        }
    }

    window.Device = device();
});