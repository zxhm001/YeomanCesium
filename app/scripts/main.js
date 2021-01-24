function init(){
    window.viewer = new Cesium.Viewer('cesium_container');
    var url = 'http://localhost:8090/iserver/services/3D-SHAB/rest/realspace';
    var promise = viewer.scene.open(url);
    Cesium.when(promise,function(layer){
        console.log(layers);
    });

    //显示经纬度
    var handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    handler.setInputAction(function(event) {
        var position = viewer.scene.pickPosition(event.endPosition);
        if (!position) {
            position = Cesium.Cartesian3.fromDegrees(0, 0, 0);
        }
        var cartographic = Cesium.Cartographic.fromCartesian(position);
        var longitude = Cesium.Math.toDegrees(cartographic.longitude);
        var latitude = Cesium.Math.toDegrees(cartographic.latitude);
        var text = longitude.toFixed(5) + '°,' + latitude.toFixed(5) + '°,' + cartographic.height.toFixed(3) + 'm';
        $('#status_bar').text(text);
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);


    //加载模型
    var person = viewer.entities.add({
        name: '人员1',
        id:'person_1',
        position: new Cesium.Cartesian3.fromDegrees(121.35481, 31.04185, 22.45),
        model: {
            uri: '/data/person.glb'
        }
    });

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
        var time = Cesium.JulianDate.addSeconds(start , 15 * i , new Cesium.JulianDate());
        carPositionProperty.addSample(time, carPosition);
        uavPositionProperty.addSample(time, uavPosition);
        if (i == carpositions.length - 1) {
            stop = time;
        }
    }

    viewer.clock.startTime = start.clone();
    viewer.clock.currentTime = start.clone();
    viewer.clock.stopTime = stop.clone();
    viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;

    var car = viewer.entities.add({
        name: '车辆1',
        id:'car_1',
        position: carPositionProperty,
        orientation: new Cesium.VelocityOrientationProperty(carPositionProperty),
        model: {
            uri: '/data/car.glb',
            scale:15
        },
        path:{
            resolution: 1,
            material: new Cesium.PolylineGlowMaterialProperty({glowPower: 0.1,color: Cesium.Color.YELLOW,}),
            width: 10
        },
        viewFrom: new Cesium.Cartesian3(30, 0, 30),
    });

    var uav = viewer.entities.add({
        name: '无人机1',
        id:'uav_1',
        position: uavPositionProperty,
        orientation: new Cesium.VelocityOrientationProperty(uavPositionProperty),
        model: {
            uri: '/data/uav.glb',
            scale:1
        },
        path:{
            resolution: 1,
            material: new Cesium.PolylineGlowMaterialProperty({glowPower: 0.1,color: Cesium.Color.YELLOW,}),
            width: 10
        },
        viewFrom: new Cesium.Cartesian3(30, 0, 30),
    });


    var camera = viewer.entities.add({
        name: '摄像头1',
        id:'camera_1',
        position: new Cesium.Cartesian3.fromDegrees(121.3511845, 31.04098, 24.54),
        model: {
            uri: '/data/camera.glb',
            scale:0.1
        }
    }); 

}

if (typeof Cesium !== 'undefined') {
    window.startupCalled = true;
    init(Cesium);
}