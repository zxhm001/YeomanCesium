function init() {
    window.viewer = new Cesium.Viewer('cesium_container', {
        'selectionIndicator': false,
    });
    var initCamera = {};

    $.get(API_ROOT + '/api/project/current', function (response) {
        if (response.succeeded) {
            window.currentProject = response.data;
            var promise = viewer.scene.open(currentProject.scence);
            Cesium.when(promise, function (layer) {
                //初始化其他模块
                window.Deploy.init();
                var camera = viewer.scene.camera;
                initCamera.position = new Cesium.Cartesian3(camera.position.x,camera.position.y,camera.position.z);
                initCamera.direction = new Cesium.Cartesian3(camera.direction.x,camera.direction.y,camera.direction.z);
                initCamera.up = new Cesium.Cartesian3(camera.up.x,camera.up.y,camera.up.z);
                // var config = SysConfig.getConfig();
                
            });
            
        }
        else {
            alert('连接不上服务器！请联系管理员');
        }
    })
    

    viewer.imageryLayers.addImageryProvider(new Cesium.TiandituImageryProvider({
        mapStyle: Cesium.TiandituMapsStyle.CIA_C,
        token: '304bc664f193742e0ad7ad3b77d5dccd'
    }));

    viewer.imageryLayers.addImageryProvider(new Cesium.TiandituImageryProvider({
        mapStyle: Cesium.TiandituMapsStyle.VEC_C,
        token: '304bc664f193742e0ad7ad3b77d5dccd'
    }), 1);

    var _currentEntity = null;
    var _moving = false;

    //显示经纬度
    var handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

    handler.setInputAction(function (e) {
        var entity = viewer.scene.pick(e.position);
        if (entity && entity.id && entity.id.id != 'car_1' && entity.id.id != 'uav_1' && !entity.id.id.startsWith('building')) {
            // debugger
            _moving = true;
            _currentEntity = entity;
            viewer.scene.screenSpaceCameraController.enableRotate = false;
        }
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

    handler.setInputAction(function (e) {
        _moving = false;
        if (_currentEntity) {
            var cartographic = Cesium.Cartographic.fromCartesian(_currentEntity.id.position._value);
            var longitude = Cesium.Math.toDegrees(cartographic.longitude);
            var latitude = Cesium.Math.toDegrees(cartographic.latitude);
            var entityId = _currentEntity.id.id;
            var type = entityId.split('_')[0];
            var id = parseInt(entityId.split('_')[1]);
            var data = {
                id: id,
                longitude: longitude,
                latitude: latitude,
                height: cartographic.height
            };
            var url = API_ROOT + '/api/' + type + '/position';
            $.ajax({
                type: 'PUT',
                url: url,
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(data),
                dataType: 'json',
                success: function (response) {
                    if (response.succeeded) {
                    }
                    else {
                        console.error(response.errors);
                    }
                    console.log(response);
                },
                error: function (err) {
                    console.error(err);
                }
            });
        }
        _currentEntity = null;
        viewer.scene.screenSpaceCameraController.enableRotate = true;
    }, Cesium.ScreenSpaceEventType.LEFT_UP);

    handler.setInputAction(function (event) {
        var position = viewer.scene.pickPosition(event.endPosition);
        if (!position) {
            position = Cesium.Cartesian3.fromDegrees(0, 0, 0);
        }
        var cartographic = Cesium.Cartographic.fromCartesian(position);
        var longitude = Cesium.Math.toDegrees(cartographic.longitude);
        var latitude = Cesium.Math.toDegrees(cartographic.latitude);
        if (_moving && _currentEntity) {
            var height = viewer.scene.getHeight(longitude, latitude);
            var cartesian = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);
            _currentEntity.id.position = cartesian;
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);


    var carpositions = [];
    carpositions.push(new Cesium.Cartesian3.fromDegrees(121.35152, 31.03718, 15.84));
    carpositions.push(new Cesium.Cartesian3.fromDegrees(121.35116, 31.03892, 15.75));
    carpositions.push(new Cesium.Cartesian3.fromDegrees(121.35331, 31.03949, 16.32));
    carpositions.push(new Cesium.Cartesian3.fromDegrees(121.35734, 31.04057, 17.30));

    var uavPositions = [];
    uavPositions.push(new Cesium.Cartesian3.fromDegrees(121.35243, 31.03988, 100));
    uavPositions.push(new Cesium.Cartesian3.fromDegrees(121.35639, 31.04109, 100));
    uavPositions.push(new Cesium.Cartesian3.fromDegrees(121.35582, 31.04355, 100));
    uavPositions.push(new Cesium.Cartesian3.fromDegrees(121.35335, 31.04237, 100));

    var start = new Cesium.JulianDate.fromDate(new Date());
    var stop;
    var carPositionProperty = new Cesium.SampledPositionProperty();
    var uavPositionProperty = new Cesium.SampledPositionProperty();
    for (let i = 0; i < carpositions.length; i++) {
        const carPosition = carpositions[i];
        const uavPosition = uavPositions[i];
        var time = Cesium.JulianDate.addSeconds(start, 15 * i, new Cesium.JulianDate());
        carPositionProperty.addSample(time, carPosition);
        uavPositionProperty.addSample(time, uavPosition);
        if (i == carpositions.length - 1) {
            stop = time;
        }
    }

    viewer.clock.startTime = start.clone();
    viewer.clock.currentTime = start.clone();
    viewer.clock.stopTime = stop.clone();
    viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;

    var car = viewer.entities.add({
        name: 'JC_00001',
        id: 'car_1',
        position: carPositionProperty,
        orientation: new Cesium.VelocityOrientationProperty(carPositionProperty),
        model: {
            uri: '/data/model/police_car.glb',
            scale: 1
        },
        path: {
            resolution: 1,
            material: new Cesium.PolylineGlowMaterialProperty({ glowPower: 0.1, color: Cesium.Color.YELLOW, }),
            width: 10
        },
        viewFrom: new Cesium.Cartesian3(30, 0, 30),
        // label:{
        //     text: 'JC_00001',
        //     font: '20px Helvetica',
        //     fillColor: Cesium.Color.WHITE,
        //     outlineColor: Cesium.Color.BLACK,
        //     outlineWidth: 2,
        //     eyeOffset:new Cesium.Cartesian3(0.0, 4, 0.0),
        //     style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        //     scaleByDistance: new Cesium.NearFarScalar(100, 1.0, 200, 0.4)
        // }
    });

    var uav = viewer.entities.add({
        name: 'U_00001',
        id: 'uav_1',
        position: uavPositionProperty,
        orientation: new Cesium.VelocityOrientationProperty(uavPositionProperty),
        model: {
            uri: '/data/model/uav.glb',
            scale: 1
        },
        path: {
            resolution: 1,
            material: new Cesium.PolylineGlowMaterialProperty({ glowPower: 0.1, color: Cesium.Color.YELLOW, }),
            width: 10
        },
        viewFrom: new Cesium.Cartesian3(30, 0, 30),
        // label:{
        //     text: 'U_00001',
        //     font: '20px Helvetica',
        //     fillColor: Cesium.Color.WHITE,
        //     outlineColor: Cesium.Color.BLACK,
        //     outlineWidth: 2,
        //     eyeOffset:new Cesium.Cartesian3(0.0, 1, 0.0),
        //     style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        //     scaleByDistance: new Cesium.NearFarScalar(100, 1.0, 200, 0.4)
        // }
    });
    window.setExtent = function (maxx, minx, maxy, miny) {
        viewer.camera.flyTo({
            destination: Cesium.Rectangle.fromDegrees(minx, miny, maxx, maxy)
        });
    }

    // $('.core-btn').on('click', function () {
    //     viewer.scene.camera.setView({
    //         destination: new Cesium.Cartesian3(-2844445.995988, 4668163.510785, 3288134.420725),
    //         orientation: {
    //             direction: new Cesium.Cartesian3(0.4687117685901372, -0.7612987345932591, 0.4480329392933161),
    //             up: new Cesium.Cartesian3(-0.2309045971528698, 0.3839714733384412, 0.8940072565007388)
    //         }
    //     });
    // });

    $('.core-btn').on('click', function () {
        viewer.scene.camera.setView({
            destination: initCamera.position,
            orientation: {
                direction: initCamera.direction,
                up: initCamera.up
            }
        });
    });
}

if (typeof Cesium !== 'undefined') {
    window.startupCalled = true;
    init(Cesium);
}