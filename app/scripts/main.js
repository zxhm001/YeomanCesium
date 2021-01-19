function init(){
    window.viewer = new Cesium.Viewer('cesium_container');
    var url = 'http://localhost:8090/iserver/services/3D-SHAB/rest/realspace';
    var promise = viewer.scene.open(url);
    Cesium.when(promise,function(layer){
        console.log(layers);
    });
}

if (typeof Cesium !== 'undefined') {
    window.startupCalled = true;
    init(Cesium);
}