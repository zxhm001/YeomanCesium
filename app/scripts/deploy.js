$(function () {

    var deployData = {
        person: [
            {
                name: '警察',
                model: '/data/model/police.glb',
                image: '/images/model/police.png',
                scale: 10,
                params: ['name', 'location'],
            },
            {
                name: '医护人员',
                model: '/data/model/doctor.glb',
                image: '/images/model/doctor.png',
                scale: 1.2,
                params: ['name', 'location'],
            },
            {
                name: '保安',
                model: '/data/model/guard.glb',
                image: '/images/model/guard.png',
                scale: 0.45,
                params: ['name', 'location'],
            }
        ],
        car: [
            {
                name: '警车',
                model: '/data/model/police_car.glb',
                image: '/images/model/police_car.png',
                scale: 15,
                params: ['license', 'location', 'path'],
            },
            {
                name: '消防车',
                model: '/data/model/fire_truck.glb',
                image: '/images/model/fire_truck.png',
                scale: 1,
                params: ['license', 'location', 'path'],
            },
            {
                name: '救护车',
                model: '/data/model/ambulance.glb',
                image: '/images/model/ambulance.png',
                scale: 1.5,
                params: ['license', 'location', 'path'],
            },
            {
                name: '警用摩托',
                model: '/data/model/motorcycle.glb',
                image: '/images/model/motorcycle.png',
                scale: 0.02,
                params: ['license', 'location', 'path'],
            },
            {
                name: '反制车',
                model: '/data/model/armored_car.glb',
                image: '/images/model/armored_car.png',
                scale: 1,
                params: ['license', 'location', 'path', 'shed'],
            }
        ],
        camera: [
            {
                name: '摄像头',
                model: '/data/model/camera.glb',
                image: '/images/model/camera.png',
                scale: 0.1,
                params: ['license','location', 'video', 'control', 'shed'],
            },
            {
                name: '无人机',
                model: '/data/model/uav.glb',
                image: '/images/model/uav.png',
                scale: 2,
                params: ['license', 'location', 'video', 'path', 'control'],
            }
        ],
        defence: [
            {
                name: '反制枪',
                model: '/data/model/gun.glb',
                image: '/images/model/gun.png',
                scale: 2,
                params: ['name', 'location', 'range'],
            },
            {
                name: '大型反制设备',
                model: '/data/model/smoking.glb',
                image: '/images/model/smoking.png',
                scale: 10,
                params: ['name', 'location', 'range'],
            }
        ],
        region: [
            {
                name: '危险区域',
                color: [255, 0, 0],
                image: '/images/model/danger.png',
                params: ['name', 'location']
            },
            {
                name: '安全区域',
                color: [0, 255, 0],
                image: '/images/model/safe.png',
                params: ['name', 'location']
            },
        ]
    };


    function deploy() {
        var _drawHandler,_polygonHandler, _tempEntity, _currentModel, _pickPosition, _lnglats;

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

            $('#deploy li').on('click', function (e) {
                var type = $(e.target).data('type');
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
            });


            $('#deploy_add').on('click',function(){
                var key = "";
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
                if (_currentModel.model) {
                    if (_tempEntity) {
                        viewer.entities.remove(_tempEntity)
                    }
                    viewer.entities.add({
                        name: key,
                        id: _currentModel.name + '_' + key,
                        position: _pickPosition,
                        model: {
                            uri: _currentModel.model,
                            scale: _currentModel.scale
                        },
                        label:{
                            text: key,
                            font: '20px Helvetica',
                            fillColor: Cesium.Color.WHITE,
                            outlineColor: Cesium.Color.BLACK,
                            outlineWidth: 2,
                            eyeOffset:new Cesium.Cartesian3(0.0, 5, 0.0),
                            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                            scaleByDistance: new Cesium.NearFarScalar(100, 1.0, 200, 0.4)
                        }
                    });
                    var params = $(".deploy-params").serializeToJSON();
                    switch (_currentModel.name) {
                        case '警车':
                        case '消防车': 
                        case '救护车':
                        case '警用摩托':
                        case '反制车':
                            Car.add(key,_currentModel.name + '_' + key);
                            break;
                        case '警察':
                        case '医护人员':
                        case '保安':
                            Person.add(key,_currentModel.name + '_' + key);
                            break;
                        case '摄像头':
                            Camera.add(key,_currentModel.name + '_' + key);
                            break;
                        case '无人机':
                            UAV.add(key,_currentModel.name + '_' + key);
                            break;
                        case '反制枪':
                        case '大型反制设备':
                            Defence.add(key,_currentModel.name + '_' + key,params);
                            break;
                        default:
                            break;
                    }
                }
                else if (_currentModel.color) {
                    var color = new Cesium.Color(_currentModel.color[0]/255, _currentModel.color[1]/255, _currentModel.color[2]/255)
                    Region.add(key,color,_lnglats);
                    Toast.show('提示','添加成功');
                    if (_polygonHandler) {
                        _polygonHandler.clear();
                        _polygonHandler.deactivate();
                    }
                }
                
                $('.deploy-params')[0].reset()
                $('.deploy-params').hide();
                $('.deploy-params .form-group').hide();
                _pickPosition = null;
                _lnglats = null;
            });

            $('#deploy_cancle').on('click',function(){
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
                $('.deploy-params')[0].reset()
                $('.deploy-params').hide();
                $('.deploy-params .form-group').hide();
            });

        };

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
                //区域
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
                        for (var i = 0; i < positions.length;i++) {
                            var cartographic = Cesium.Cartographic.fromCartesian(polygon.positions[i]);
                            var longitude = Cesium.Math.toDegrees(cartographic.longitude);
                            var latitude = Cesium.Math.toDegrees(cartographic.latitude);
                            var height = cartographic.height;
                            _lnglats.push(longitude);
                            _lnglats.push(latitude);
                            _lnglats.push(height);
                        }
                        var cartographic = Cesium.Cartographic.fromCartesian(polygon.positions[0]);
                        var longitude = Cesium.Math.toDegrees(cartographic.longitude);
                        var latitude = Cesium.Math.toDegrees(cartographic.latitude);
                        var height = cartographic.height;
                        _lnglats.push(longitude);
                        _lnglats.push(latitude);
                        _lnglats.push(height);
                    });
                }
                _polygonHandler.activate();
            }
        };

        return {
            init:init,
        };
    }
    window.Deploy = deploy();

}());