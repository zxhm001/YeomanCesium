$(function () {
    var screenSpaceEventHandler;

    function pipe() {

        function clickQuery() {
            if (!screenSpaceEventHandler) {
                screenSpaceEventHandler = viewer.screenSpaceEventHandler;
                //取消双击事件
                screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
                var oldPickFunc = screenSpaceEventHandler.getInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
                //覆盖viewer里面的事件定义
                screenSpaceEventHandler.setInputAction(function(e){
                    //canva必须要focus才能响应按键事件
                    viewer.scene.canvas.focus();
                    //兼容系统自带的选择方式
                    oldPickFunc(e);
                    viewer.selectedPositon = viewer.scene.pickPosition(e.position);
                }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
            }
            viewer.pickEvent.addEventListener(pickCallBack);
        }

        function pickCallBack (feature) {
            if (Cesium.defined(feature)) {
                console.log(feature);
                viewer.popup.showPosition(viewer.selectedPositon, feature);
            }
        }

        function clearQuery() {
            viewer.pickEvent.removeEventListener(pickCallBack);
            viewer.popup.show = false;
        }

        return {
            clickQuery: clickQuery,
            clearQuery: clearQuery
        }
    }

    window.Pipe = pipe();
}());