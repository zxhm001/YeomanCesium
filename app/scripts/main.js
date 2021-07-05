function init() {
    $('#menu_admin').show();
    $('#menu_front').hide();

    //椭球模式
    //Cesium默认的是椭球模式
    //超图默认的是圆球模式
    // var obj = [6378137.0, 6378137.0, 6356752.3142451793];
    // Cesium.Ellipsoid.WGS84 = Object.freeze(new Cesium.Ellipsoid(obj[0], obj[1], obj[2]));

    if (PLATFORM == 'SuperMap') {

        window.viewer = new Cesium.Viewer('cesium_container', {
            'selectionIndicator': false,
            terrainProvider : new Cesium.CesiumTerrainProvider({
                url : SHANGHAI_TERRAIN,
                isSct : true,
                invisibility:true
            }),
        });
        
        $.get(API_ROOT + '/api/project/active-list',function(response){
            if (response.succeeded) {
                window.projects = response.data;
                if ($.cookie('current_project_id')) {
                    for (let i = 0; i < window.projects.length; i++) {
                        const project = window.projects[i];
                        if (project.id == $.cookie('current_project_id')) {
                            window.currentProject = project;
                            break;
                        }
                    }
                }
                
                if(!window.currentProject)
                {
                    for (let i = 0; i < window.projects.length; i++) {
                        const project = window.projects[i];
                        if (project.isCurrent) {
                            window.currentProject = project;
                            break;
                        }
                    }
                    if (!window.currentProject && window.projects.length > 0) {
                        window.currentProject = window.projects[0];
                    }
                }
                if (window.currentProject) {
                    $.cookie('current_project_id', window.currentProject.id, { expires: 7, path: '/' });
                    var promise = viewer.scene.open(currentProject.scence);
                    Cesium.when(promise, function (layer) {
                        //初始化其他模块
                        Deploy.init();
                        initData();
                        viewer.terrainProvider._visible = false;
                    });
                }
                initProjectSelector();
            }
        });

        viewer.imageryLayers.addImageryProvider(new Cesium.TiandituImageryProvider({
            mapStyle: Cesium.TiandituMapsStyle.CIA_C,
            token: '304bc664f193742e0ad7ad3b77d5dccd'
        }));
    
        viewer.imageryLayers.addImageryProvider(new Cesium.TiandituImageryProvider({
            mapStyle: Cesium.TiandituMapsStyle.VEC_C,
            token: '304bc664f193742e0ad7ad3b77d5dccd'
        }), 1);
    }
    else if(PLATFORM == 'MapGIS')
    {
        var webGlobe = new Cesium.WebSceneControl('cesium_container', {});
        window.viewer = webGlobe.viewer;
        var sceneManager = new CesiumZondy.Manager.SceneManager({
            viewer: webGlobe.viewer
        });
        var terrain = new CesiumZondy.Layer.TerrainLayer({
            viewer: webGlobe.viewer
        });
        var geobodyLayer = terrain.append(SHANGHAI_TERRAIN_MG, {
            loaded: function(layer) {
                console.log(layer);
            }
        });
        $.get(API_ROOT + '/api/project/active-list',function(response){
            if (response.succeeded) {
                window.projects = response.data;
                if ($.cookie('current_project_id')) {
                    for (let i = 0; i < window.projects.length; i++) {
                        const project = window.projects[i];
                        if (project.id == $.cookie('current_project_id')) {
                            window.currentProject = project;
                            break;
                        }
                    }
                }
                
                if(!window.currentProject)
                {
                    for (let i = 0; i < window.projects.length; i++) {
                        const project = window.projects[i];
                        if (project.isCurrent) {
                            window.currentProject = project;
                            break;
                        }
                    }
                    if (!window.currentProject && window.projects.length > 0) {
                        window.currentProject = window.projects[0];
                    }
                }
                if (window.currentProject) {
                    $.cookie('current_project_id', window.currentProject.id, { expires: 7, path: '/' });
                    var provider = webGlobe.append(currentProject.scence, {
                        autoReset: true,
                        loaded: function (e) {
                            var center = e.boundingSphere.center;
                            var radius = e.boundingSphere.radius;
                            var cartographic = Cesium.Cartographic.fromCartesian(center);
                            cartographic.height = 2.5 * radius;
                            var pCenter = Cesium.Cartesian3.fromRadians(cartographic.longitude,cartographic.latitude,cartographic.height); 
                            viewer.camera.flyTo({
                                destination : pCenter,
                                orientation : {
                                    heading : 0,
                                    pitch : Cesium.Math.toRadians(-90),
                                    roll : 0.0
                                }
                            });
                            
                            Deploy.init();
                            initData();
                        }
                    }) 
                }
                initProjectSelector();
            }
        });

        //构造第三方图层对象
        var thirdPartyLayer = new CesiumZondy.Layer.ThirdPartyLayer({
            viewer: webGlobe.viewer
        });
        //加载天地图
        var tdtLayer = thirdPartyLayer.appendTDTuMap({
            //天地图经纬度数据
            url: 'http://t0.tianditu.com/DataServer?T=vec_c&X={x}&Y={y}&L={l}',
            //开发token （请到天地图官网申请自己的开发token，自带token仅做功能验证随时可能失效）
            token: '304bc664f193742e0ad7ad3b77d5dccd',
            //地图类型 'vec'矢量 'img'影像 'ter'地形
            ptype: 'vec'
        });

        var tdtLayerAno = thirdPartyLayer.appendTDTuMap({
            //天地图经纬度数据
            url: 'http://t0.tianditu.com/DataServer?T=vec_c&X={x}&Y={y}&L={l}',
            //开发token （请到天地图官网申请自己的开发token，自带token仅做功能验证随时可能失效）
            token: '304bc664f193742e0ad7ad3b77d5dccd',
            //地图类型 'vec'矢量 'img'影像 'ter'地形
            ptype: 'cia'
        });
    }

    viewer.scene.getHeight2 = async function(lon,lat){
        var cartographic = Cesium.Cartographic.fromDegrees(lon,lat);
        var height = viewer.scene.sampleHeight(cartographic);
        if (height < 0.1) {
            var data = await Cesium.sampleTerrain(viewer.terrainProvider,11,[cartographic]);
            height = data[0].height;
        }
        return height;
    }

    

    function initProjectSelector(){
        $('#projects').empty();
        for (let i = 0; i < projects.length; i++) {
            const project = projects[i];
            var selector = $(`
            <div class="project-card ${project.id == currentProject.id?'active':''}">
            <span>${project.name}</span>
            </div>
            `);
            selector.css('background',`url(${API_ROOT}/api/file/download/${project.image})`);
            selector.on('click',function(){
                $('.project-card').removeClass('active');
                $(this).addClass('active');
                window.currentProject = project;
                $.cookie('current_project_id', window.currentProject.id, { expires: 7, path: '/' });
                var promise = viewer.scene.open(currentProject.scence);
                Cesium.when(promise, function (layer) {
                    var camera = viewer.scene.camera;
                    initCamera.position = new Cesium.Cartesian3(camera.position.x,camera.position.y,camera.position.z);
                    initCamera.direction = new Cesium.Cartesian3(camera.direction.x,camera.direction.y,camera.direction.z);
                    initCamera.up = new Cesium.Cartesian3(camera.up.x,camera.up.y,camera.up.z);
                    viewer.terrainProvider._visible = false;
                });
                initData();
            });
            $('#projects').append(selector);
        }
    }

    /**
     * 加载业务数据
     */
    function initData(){
        var entities = viewer.entities.values;
        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            if (entity.id.startsWith('person_') || entity.id.startsWith('device_')||entity.id.startsWith('car_')
                ||entity.id.startsWith('building_')||entity.id.startsWith('region_')) {
                viewer.entities.remove(entity);
                i--
            }
        }

        Building.init();
        Car.init();
        Device.init();
        Person.init();
        Region.init();
    }

    $('#projects_wrapper').on('mouseover',function(){
        $(this).addClass('expand');
        $('.expand #projects').css('width',(projects.length * 96 + 10) + 'px');
        for (let i = 0; i < projects.length; i++) {
            $('.expand .project-card:eq(' + i + ')').css('left', (96 * i + 10) + 'px');
        }
    });

    $('#projects_wrapper').on('mouseout',function(){
        $(this).removeClass('expand');
        $('.project-card').css('left','10px');
    })

    var _currentEntity = null;
    var _moving = false;

    //显示经纬度
    var handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

    handler.setInputAction(async function(event) {
        var position  = viewer.camera.pickEllipsoid(event.position,viewer.scene.globe.ellipsoid);
        var cartographic = Cesium.Cartographic.fromCartesian(position);
        var longitude = Cesium.Math.toDegrees(cartographic.longitude);
        var latitude = Cesium.Math.toDegrees(cartographic.latitude);
        var height = await viewer.scene.getHeight2(longitude,latitude);
        console.log('Height',height);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    handler.setInputAction(function (e) {
        var entity = viewer.scene.pick(e.position);
        if (entity && entity.id && entity.id.id != 'car_1' && entity.id.id != 'uav_1' && !entity.id.id.startsWith('building') && !entity.id.name.startsWith('sketch')) {
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
            //TODO:只处理了设备，其他的目前没用着就暂时不变
            if (type == 'device') {
                Device.setPositionData(id,longitude,latitude, cartographic.height);
            }
        }
        _currentEntity = null;
        viewer.scene.screenSpaceCameraController.enableRotate = true;
    }, Cesium.ScreenSpaceEventType.LEFT_UP);

    handler.setInputAction(async function (event) {
        var position = viewer.scene.pickPosition(event.endPosition);
        if (!position) {
            position = Cesium.Cartesian3.fromDegrees(0, 0, 0);
        }
        var cartographic = Cesium.Cartographic.fromCartesian(position);
        var longitude = Cesium.Math.toDegrees(cartographic.longitude);
        var latitude = Cesium.Math.toDegrees(cartographic.latitude);
        if (_moving && _currentEntity) {
            var height = await viewer.scene.getHeight2(longitude, latitude);
            var cartesian = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);
            _currentEntity.id.position = cartesian;
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);


    // var carpositions = [];
    // carpositions.push(new Cesium.Cartesian3.fromDegrees(121.35152, 31.03718, 15.84));
    // carpositions.push(new Cesium.Cartesian3.fromDegrees(121.35116, 31.03892, 15.75));
    // carpositions.push(new Cesium.Cartesian3.fromDegrees(121.35331, 31.03949, 16.32));
    // carpositions.push(new Cesium.Cartesian3.fromDegrees(121.35734, 31.04057, 17.30));

    // var uavPositions = [];
    // uavPositions.push(new Cesium.Cartesian3.fromDegrees(121.35243, 31.03988, 100));
    // uavPositions.push(new Cesium.Cartesian3.fromDegrees(121.35639, 31.04109, 100));
    // uavPositions.push(new Cesium.Cartesian3.fromDegrees(121.35582, 31.04355, 100));
    // uavPositions.push(new Cesium.Cartesian3.fromDegrees(121.35335, 31.04237, 100));

    // var start = new Cesium.JulianDate.fromDate(new Date());
    // var stop;
    // var carPositionProperty = new Cesium.SampledPositionProperty();
    // var uavPositionProperty = new Cesium.SampledPositionProperty();
    // for (let i = 0; i < carpositions.length; i++) {
    //     const carPosition = carpositions[i];
    //     const uavPosition = uavPositions[i];
    //     var time = Cesium.JulianDate.addSeconds(start, 15 * i, new Cesium.JulianDate());
    //     carPositionProperty.addSample(time, carPosition);
    //     uavPositionProperty.addSample(time, uavPosition);
    //     if (i == carpositions.length - 1) {
    //         stop = time;
    //     }
    // }

    // viewer.clock.startTime = start.clone();
    // viewer.clock.currentTime = start.clone();
    // viewer.clock.stopTime = stop.clone();
    // viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;

    // var car = viewer.entities.add({
    //     name: 'JC_00001',
    //     id: 'car_1',
    //     position: carPositionProperty,
    //     orientation: new Cesium.VelocityOrientationProperty(carPositionProperty),
    //     model: {
    //         uri: '/data/model/police_car.glb',
    //         scale: 1
    //     },
    //     path: {
    //         resolution: 1,
    //         material: new Cesium.PolylineGlowMaterialProperty({ glowPower: 0.1, color: Cesium.Color.YELLOW, }),
    //         width: 10
    //     },
    //     viewFrom: new Cesium.Cartesian3(30, 0, 30),
    //     // label:{
    //     //     text: 'JC_00001',
    //     //     font: '20px Helvetica',
    //     //     fillColor: Cesium.Color.WHITE,
    //     //     outlineColor: Cesium.Color.BLACK,
    //     //     outlineWidth: 2,
    //     //     eyeOffset:new Cesium.Cartesian3(0.0, 4, 0.0),
    //     //     style: Cesium.LabelStyle.FILL_AND_OUTLINE,
    //     //     scaleByDistance: new Cesium.NearFarScalar(100, 1.0, 200, 0.4)
    //     // }
    // });

    // var uav = viewer.entities.add({
    //     name: 'U_00001',
    //     id: 'uav_1',
    //     position: uavPositionProperty,
    //     orientation: new Cesium.VelocityOrientationProperty(uavPositionProperty),
    //     model: {
    //         uri: '/data/model/uav.glb',
    //         scale: 1
    //     },
    //     path: {
    //         resolution: 1,
    //         material: new Cesium.PolylineGlowMaterialProperty({ glowPower: 0.1, color: Cesium.Color.YELLOW, }),
    //         width: 10
    //     },
    //     viewFrom: new Cesium.Cartesian3(30, 0, 30),
    //     // label:{
    //     //     text: 'U_00001',
    //     //     font: '20px Helvetica',
    //     //     fillColor: Cesium.Color.WHITE,
    //     //     outlineColor: Cesium.Color.BLACK,
    //     //     outlineWidth: 2,
    //     //     eyeOffset:new Cesium.Cartesian3(0.0, 1, 0.0),
    //     //     style: Cesium.LabelStyle.FILL_AND_OUTLINE,
    //     //     scaleByDistance: new Cesium.NearFarScalar(100, 1.0, 200, 0.4)
    //     // }
    // });

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

    // $('.core-btn').on('click', function () {
    //     viewer.scene.camera.setView({
    //         destination: initCamera.position,
    //         orientation: {
    //             direction: initCamera.direction,
    //             up: initCamera.up
    //         }
    //     });
    // });
}

if (typeof Cesium !== 'undefined') {
    window.startupCalled = true;
    init(Cesium);
}