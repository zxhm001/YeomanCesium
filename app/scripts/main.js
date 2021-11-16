function init() {
    //移动模型用到的全局变量
    var _currentEntity = null;
    var _moving = false;
    var _inited = false;

    $('#menu_admin').show();
    $('#menu_front').hide();

    //椭球模式
    //Cesium默认的是椭球模式
    //超图默认的是圆球模式
    // var obj = [6378137.0, 6378137.0, 6356752.3142451793];
    // Cesium.Ellipsoid.WGS84 = Object.freeze(new Cesium.Ellipsoid(obj[0], obj[1], obj[2]));

    $.get(API_ROOT + '/api/sys-config/terrain_url',function(response){
        var terrain_url = response.data.value;
        if (PLATFORM == 'SuperMap') {
            window.viewer = new Cesium.Viewer('cesium_container', {
                'selectionIndicator': false,
                terrainProvider : new Cesium.CesiumTerrainProvider({
                    url : terrain_url,
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
            window.webGlobe = new Cesium.WebSceneControl('cesium_container', {
                // keyEventEnable:false,
                onCopy:true
            });
            window.viewer = webGlobe.viewer;
            if (terrain_url) {
                var terrain = new CesiumZondy.Layer.TerrainLayer({
                    viewer: webGlobe.viewer
                });
                var geobodyLayer = terrain.append(terrain_url, {
                    loaded: function(layer) {
                        console.log(layer);
                    }
                });
            }      
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
                                if (!_inited) {
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
                                    _inited = true;
                                }
                                
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
                url: 'http://t0.tianditu.com/DataServer?T=vec_c&X={x}&Y={y}&L={l}',
                token: '304bc664f193742e0ad7ad3b77d5dccd',
                ptype: 'vec'
            });
    
            var tdtLayerAno = thirdPartyLayer.appendTDTuMap({
                url: 'http://t0.tianditu.com/DataServer?T=vec_c&X={x}&Y={y}&L={l}',
                token: '304bc664f193742e0ad7ad3b77d5dccd',
                ptype: 'cia'
            });
        }
    
        viewer.scene.getHeight2 = async function(lon,lat){
            if (viewer.scene.getHeight) {
                return viewer.scene.getHeight(lon,lat)
            }
            else
            {
                var cartographic = Cesium.Cartographic.fromDegrees(lon,lat);
                var height = viewer.scene.sampleHeight(cartographic);
                if (height < 0.1 && viewer.terrainProvider) {
                    var data = await Cesium.sampleTerrain(viewer.terrainProvider,11,[cartographic]);
                    height = data[0].height;
                }
                return height;
            }
            
        }

        var handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

        handler.setInputAction(function (e) {
            var entity = viewer.scene.pick(e.position);
            if (entity && entity.id && entity.id.id != 'car_1' && entity.id.id != 'uav_1' && !entity.id.id.startsWith('building') && !entity.id.name.startsWith('sketch')) {
                // debugger
                _moving = true;
                _currentEntity = entity;
                //viewer.scene.screenSpaceCameraController.enableRotate = false;
                viewer.scene.screenSpaceCameraController.enableInputs = false;
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
            //viewer.scene.screenSpaceCameraController.enableRotate = true;
            viewer.scene.screenSpaceCameraController.enableInputs = true;
        }, Cesium.ScreenSpaceEventType.LEFT_UP);

        handler.setInputAction(async function (event) {
            if (_moving && _currentEntity) {
                var position = viewer.scene.pickPosition(event.endPosition);
                if (!position) {
                    return;
                }
                var cartographic = Cesium.Cartographic.fromCartesian(position);
                var longitude = Cesium.Math.toDegrees(cartographic.longitude);
                var latitude = Cesium.Math.toDegrees(cartographic.latitude);
                var height = await viewer.scene.getHeight2(longitude, latitude);
                if (height > cartographic.height) {
                    height = cartographic.height;
                }
                console.log({'longitude':longitude,'latitude':latitude,'height':height});
                var cartesian = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);
                _currentEntity.id.position = cartesian;
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    });
    

    

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
                if (PLATFORM == 'SuperMap') {
                    var promise = viewer.scene.open(currentProject.scence);
                    Cesium.when(promise, function (layer) {
                        viewer.terrainProvider._visible = false;
                    });
                }
                else if (PLATFORM == 'MapGIS') {
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
                        }
                    }) 
                }
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


    window.setExtent = function (maxx, minx, maxy, miny) {
        viewer.camera.flyTo({
            destination: Cesium.Rectangle.fromDegrees(minx, miny, maxx, maxy)
        });
    }
}

$(function(){
    if (typeof Cesium !== 'undefined') {
        window.startupCalled = true;
        init(Cesium);
    }
})
