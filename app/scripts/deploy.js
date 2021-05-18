$(function () {

    $('#modal_deploy').on('hide.bs.modal', function (event) {
        Deploy.resetDraw();
    });

    var deployData = {
        person: [
            {
                name: '警察',
                model: '/data/model/police.glb',
                image: '/images/model/police.png',
                scale: 2,
                params: ['name','number'],
            },
            {
                name: '医护人员',
                model: '/data/model/doctor.glb',
                image: '/images/model/doctor.png',
                scale: 2,
                params: ['name','number'],
            },
            {
                name: '安保人员',
                model: '/data/model/guard.glb',
                image: '/images/model/guard.png',
                scale: 2,
                params: ['name','number'],
            },
            {
                name: '消防员',
                model: '/data/model/fire_man.glb',
                image: '/images/model/fire_man.png',
                scale: 2,
                params: ['name','number'],
            }
        ],
        car: [
            {
                name: '警车',
                model: '/data/model/police_car.glb',
                image: '/images/model/police_car.png',
                scale: 1,
                params: ['license'],
                //params: ['license','text','path','locationurl'],
            },
            {
                name: '消防车',
                model: '/data/model/fire_truck.glb',
                image: '/images/model/fire_truck.png',
                scale: 1,
                params: ['license'],
            },
            {
                name: '救护车',
                model: '/data/model/ambulance.glb',
                image: '/images/model/ambulance.png',
                scale: 1,
                params: ['license'],
            },
            {
                name: '警用摩托',
                model: '/data/model/motorcycle.glb',
                image: '/images/model/motorcycle.png',
                scale: 1,
                params: ['license'],
            },
            {
                name: '反制车',
                model: '/data/model/armored_car.glb',
                image: '/images/model/armored_car.png',
                scale: 1,
                params: ['license'],
            }
        ],
        device: [
            {
                name: '反制枪',
                model: '/data/model/gun.glb',
                image: '/images/model/gun.png',
                scale: 2,
                params: ['license','name', 'number','range'],
            },
            {
                name: '无人机',
                model: '/data/model/uav.glb',
                image: '/images/model/uav.png',
                scale: 1,
                params: ['license','name','rtmpurl'],
            },
            {
                name: '布控球',
                model: '/data/model/camera.glb',
                image: '/images/model/camera.png',
                scale: 1,
                params: ['license','name','rtmpurl','shed'],
            },
        ],
        region: [
            {
                name: '危险区域',
                color: [255, 0, 0],
                image: '/images/model/danger.png',
                params: ['name']
            },
            {
                name: '重点区域',
                color: [255, 127, 0],
                image: '/images/model/important.png',
                params: ['name']
            },
            {
                name: '安全区域',
                color: [0, 255, 0],
                image: '/images/model/safe.png',
                params: ['name']
            },
        ],
        building:[
            {
                name: '建筑',
                image: '/images/model/building.png',
                params: ['name']
            },
        ]
    };


    function deploy() {
        var _drawHandler,_polygonHandler, _tempEntity, _currentModel, _pickPosition, _lnglats,_maxHeight;

        function init() {
            //先将模型都加进来，之后就不用重新加载glb
            var index = 0;
            for (const key in deployData) {
                if (Object.hasOwnProperty.call(deployData, key)) {
                    const type = deployData[key];
                    type.forEach(model => {
                        if (model.model) {
                            viewer.entities.add({
                                name: 'model_template_' + index,
                                position: new Cesium.Cartesian3.fromDegrees(0, 0, -200),
                                model: {
                                    uri: model.model,
                                    scale:0.0001
                                }
                            }); 
                        }
                        index ++;
                    });
                }
            }


            $('#deploy_add').on('click',function(){
                var key = '';
                if (_currentModel.params.includes('name')) {
                    key = $('#deploy_input_name').val();
                }
                else if (_currentModel.params.includes('license')) {
                    key = $('#deploy_input_license').val();
                }
                if (key == null || key.trim().length == 0) {
                    Toast.show('提示','请输入名称或者车牌号');
                    return;
                }
                if (!_pickPosition && !_lnglats) {
                    Toast.show('提示','请在地图场景中左键点击选择要部署的位置或绘制区域');
                    return;
                }
                var modelKey = 'person'
                var sizeStr = 20;
                var colorStr = '#FFFFFF';
                switch (_currentModel.name) {
                    case '警车':
                    case '消防车': 
                    case '救护车':
                    case '警用摩托':
                    case '反制车':
                        modelKey = 'car';
                        sizeStr = SysConfig.getConfig().car_label_size;
                        colorStr = SysConfig.getConfig().car_label_color;
                        break;
                    case '警察':
                    case '医护人员':
                    case '安保人员':
                    case '消防员':
                        modelKey = 'person';
                        sizeStr = SysConfig.getConfig().person_label_size;
                        colorStr = SysConfig.getConfig().person_label_color;
                        break;
                    case '反制枪':
                    case '布控球':
                    case '无人机':
                        modelKey = 'device';
                        sizeStr = SysConfig.getConfig().device_label_size;
                        colorStr = SysConfig.getConfig().device_label_color;
                        break;
                    default:
                        break;
                }
                var params = $('.deploy-params').serializeToJSON();
                if (_currentModel.model) {
                    if (_tempEntity) {
                        viewer.entities.remove(_tempEntity)
                    }
                    
                    persistenceModel(_currentModel,_pickPosition,params,rdata=>{
                        switch (_currentModel.name) {
                            case '警车':
                            case '消防车': 
                            case '救护车':
                            case '警用摩托':
                            case '反制车':
                                Car.add(key,_currentModel.name,modelKey + '_' + rdata.id,rdata);
                                break;
                            case '警察':
                            case '医护人员':
                            case '安保人员':
                            case '消防员':
                                params.deviceId = 0;
                                Person.add(key,_currentModel.name,modelKey + '_' + rdata.id,rdata);
                                break;
                            case '反制枪':
                            case '布控球':
                            case '无人机':
                                Device.add(key,_currentModel.name,modelKey + '_' + rdata.id,rdata);
                                break;
                            default:
                                break;
                        }
                        viewer.entities.add({
                            name: key,
                            id: modelKey + '_' + rdata.id,
                            position: _pickPosition,
                            model: {
                                uri: _currentModel.model,
                                scale: _currentModel.scale
                            },
                            label:{
                                text: key,
                                font: sizeStr + 'px Helvetica',
                                fillColor: Cesium.Color.fromCssColorString(colorStr),
                                outlineColor: Cesium.Color.BLACK,
                                outlineWidth: 2,
                                eyeOffset:new Cesium.Cartesian3(0,0,-10),
                                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                                scaleByDistance: new Cesium.NearFarScalar(100, 1.0, 3000, 0.2)
                            }
                        });
                        _pickPosition = null;
                    });
                }
                else if (_currentModel.color) {
                    var color = new Cesium.Color(_currentModel.color[0]/255, _currentModel.color[1]/255, _currentModel.color[2]/255)
                    persistenceRegion(_currentModel,_lnglats,params,rdata=>{
                        Region.add(key,_currentModel.name,color,_lnglats,rdata);
                        _lnglats = null;
                        _maxHeight = 0;
                    });
                    if (_polygonHandler) {
                        _polygonHandler.clear();
                        _polygonHandler.deactivate();
                    }
                }
                else if (_currentModel.name == '建筑') {
                    persistenceBuilding(_lnglats,params,rdata=>{
                        Building.add(rdata);
                        _lnglats = null;
                        _maxHeight = 0;
                    });
                    if (_polygonHandler) {
                        _polygonHandler.clear();
                        _polygonHandler.deactivate();
                    }
                }
                
                $('.deploy-params')[0].reset()
                $('.deploy-params').hide();
                $('.deploy-params .form-group').hide();
                
                
            });

            $('#deploy_cancle').on('click',function(){
                resetDraw();
            });

        };

        function resetDraw(){
            if (_tempEntity) {
                viewer.entities.remove(_tempEntity)
            }
            if (_drawHandler) {
                _drawHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
                _drawHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            }
            if (_polygonHandler) {
                _polygonHandler.clear();
                _polygonHandler.deactivate();
            }
            _pickPosition = null;
            _lnglats = null;
            _maxHeight = 0;
            $('.deploy-params')[0].reset()
            $('.deploy-params').hide();
            $('.deploy-params .form-group').hide();
        }

        var showModel = function(type){
            $('#symbol_list').empty();
            var models = deployData[type];
            models.forEach(model => {
                var item = $(`<div class="symbol-item">
                    <img alt="${model.name}" src="${model.image}">
                    <p>${model.name}</p>
                </div>`);
                item.on('click', function () {
                    onModelSelct(model);
                });
                $('#symbol_list').append(item);
            });
            $('.deploy-params').hide();
            $('.deploy-params .form-group').hide();
            $('#modal_deploy').modal();
        }

        /**
         * 选中绘制模型时
         * @param {*} model 
         */
        var onModelSelct = function (model) {
            _currentModel = model;
            _pickPosition = null;
            _lnglats = null;
            $('.deploy-params').show();
            $('.deploy-params .form-group').hide();
            model.params.forEach(param => {
                $('.deploy-params-' + param).show();
            });
            if (_polygonHandler) {
                _polygonHandler.clear();
                _polygonHandler.deactivate();
            }
            if (model.model) {
                //模型
                if (!_drawHandler) {
                    _drawHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
                }

                _drawHandler.setInputAction(function (mouseEvent) {
                    if (_tempEntity) {
                        viewer.entities.remove(_tempEntity)
                    }
                    var position = viewer.scene.pickPosition(mouseEvent.endPosition);
                    _tempEntity = viewer.entities.add({
                        name: model.name,
                        id: model.name,
                        position: position,
                        model: {
                            uri: model.model,
                            scale: model.scale
                        }
                    });
                }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

                _drawHandler.setInputAction(function (mouseEvent) {
                    _pickPosition = viewer.scene.pickPosition(mouseEvent.position);
                    _drawHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
            }
            else {
                //区域和建筑
                if (!_polygonHandler) {
                    _polygonHandler = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Polygon, 0);
                    _polygonHandler.enableDepthTest = false;
                    _polygonHandler.activeEvt.addEventListener(function (isActive) {
                        if (isActive == true) {
                            viewer.enableCursorStyle = false;
                            viewer._element.style.cursor = '';
                            $('body').removeClass('drawCur').addClass('drawCur');
                        } else {
                            viewer.enableCursorStyle = true;
                            $('body').removeClass('drawCur');
                        }
                    });
                    _polygonHandler.drawEvt.addEventListener(function (result) {
                        var polygon = result.object;
                        if (!polygon) {
                            return;
                        }
                        var positions = [].concat(polygon.positions);
                        positions = Cesium.arrayRemoveDuplicates(positions, Cesium.Cartesian3.equalsEpsilon);
                        _lnglats = [];
                        _maxHeight = 0;
                        for (var i = 0; i < positions.length;i++) {
                            var cartographic = Cesium.Cartographic.fromCartesian(polygon.positions[i]);
                            var longitude = Cesium.Math.toDegrees(cartographic.longitude);
                            var latitude = Cesium.Math.toDegrees(cartographic.latitude);
                            var height = cartographic.height;
                            _lnglats.push(longitude);
                            _lnglats.push(latitude);
                            _lnglats.push(height);
                            if (height > _maxHeight) {
                                _maxHeight = height;
                            }
                        }

                        //加起点
                        var cartographic = Cesium.Cartographic.fromCartesian(polygon.positions[0]);
                        var longitude = Cesium.Math.toDegrees(cartographic.longitude);
                        var latitude = Cesium.Math.toDegrees(cartographic.latitude);
                        var height = cartographic.height;
                        _lnglats.push(longitude);
                        _lnglats.push(latitude);
                        _lnglats.push(height);

                        //获取最高高度
                        var lnglats = [];
                        for (let i = 0; i < _lnglats.length; i+=3) {
                            lnglats.push([_lnglats[i],_lnglats[i+1]]);
                            
                        }
                        var polygon = turf.polygon([lnglats], { name: 'building' });
                        var centroid = turf.centroid(polygon);
                        var centerCoord = centroid.geometry.coordinates;
                        var height = viewer.scene.getHeight(centerCoord[0],centerCoord[1]);
                        if (height > _maxHeight) {
                            _maxHeight = height;
                        }
                        _maxHeight += 5;
                    });
                }
                console.log(model.name);
                _polygonHandler.activate();
            }
        };

        /**
         * 保存模型到服务器
         * @param {*} model 
         * @param {*} position 
         * @param {*} params 
         * @param {*} callback 
         */
        var persistenceModel = function(model,position,params,callback){
            var url = '';
            var data = {};
            var cartographic = Cesium.Cartographic.fromCartesian(position);
            var longitude = Cesium.Math.toDegrees(cartographic.longitude);
            var latitude = Cesium.Math.toDegrees(cartographic.latitude);
            var height = cartographic.height;
            switch (model.name) {
                case '警车':
                case '消防车': 
                case '救护车':
                case '警用摩托':
                case '反制车':
                    url = API_ROOT + '/api/car';
                    data = {
                        license:params.license,
                        text:params.text,
                        number:params.number,
                        type:model.name,
                        longitude:longitude,
                        latitude:latitude,
                        height:height,
                        locationUrl:params.locationurl
                    };
                    break;
                case '警察':
                case '医护人员':
                case '安保人员':
                case '消防员':
                    url = API_ROOT + '/api/person';
                    data = {
                        name:params.name,
                        type:model.name,
                        longitude:longitude,
                        latitude:latitude,
                        height:height,
                        deviceId:params.device
                    };
                    break;
                case '无人机':
                case '反制枪':
                case '布控球':
                    url = API_ROOT + '/api/device';
                    data = {
                        name:params.name,
                        license:params.license,
                        type:model.name,
                        number:params.number,
                        range:params.range,
                        longitude:longitude,
                        latitude:latitude,
                        height:height,
                        locationUrl:params.locationurl,
                        rtmpUrl:params.rtmpurl,
                        direction:params.shed_direction?params.shed_direction:0,
                        pitch:params.shed_angle?params.shed_angle:0,
                        distance:params.shed_distance?params.shed_distance:0,
                        verticalFov:params.verticalFov,
                        horizontalFov:params.horizontalFov
                    };
                    break;
                default:
                    break;
            }
            $.ajax({
                type: 'POST',
                url: url,
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(data),
                dataType: 'json',
                success: function (response) {
                    if (response.succeeded) {
                        if (callback) {
                            callback(response.data);
                        }
                        Toast.show('提示','添加成功');
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
        };

        /**
         * 保存区域到服务器
         * @param {*} model 
         * @param {*} lnglats 
         * @param {*} params 
         * @param {*} callback 
         */
        var persistenceRegion = function(model,lnglats,params,callback){
            var url = API_ROOT + '/api/region';
            var locations = [];
            for (let i = 0; i < lnglats.length - 3; i+=3) {
                locations.push({
                    longitude: lnglats[i],
                    latitude: lnglats[i + 1],
                    height: lnglats[i + 2]
                });
            }
            var data = {
                name:params.name,
                type:model.name,
                locations:locations
            };

            $.ajax({
                type: 'POST',
                url: url,
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(data),
                dataType: 'json',
                success: function (response) {
                    if (response.succeeded) {
                        if (callback) {
                            callback(response.data);
                        }
                        Toast.show('提示','添加成功');
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
        }

        /**
         * 保存建筑到服务器
         * @param {*} lnglats 
         * @param {*} params 
         * @param {*} callback 
         */
        function persistenceBuilding(lnglats,params,callback)
        {
            var url = API_ROOT + '/api/building';
            var coords = [];
            for (let i = 0; i < lnglats.length; i+=3) {
                coords.push({
                    longitude: lnglats[i],
                    latitude: lnglats[i + 1],
                });
            }
            params.coords = coords;
            var data = {
                name:params.name,
                maxHeight:_maxHeight,
                coords:coords
            };

            $.ajax({
                type: 'POST',
                url: url,
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(data),
                dataType: 'json',
                success: function (response) {
                    if (response.succeeded) {
                        if (callback) {
                            callback(response.data);
                        }
                        Toast.show('提示','添加成功');
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
        }

        function getDeployConfig(){
            return deployData;
        }


        return {
            init:init,
            showModel:showModel,
            resetDraw:resetDraw,
            getDeployConfig:getDeployConfig
        };
    }
    window.Deploy = deploy();

}());