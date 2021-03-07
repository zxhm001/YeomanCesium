$(function(){
    var zTreeObj,_rangeEntity;
    var data = [{
        name:'闵行区',
        children:[
            {
                name:'江川路街道',
                children:[
                    // {
                    //     name:'反制枪1',
                    //     model:'gun_1',
                    //     params:
                    //     {
                    //         range:100
                    //     }
                    // }
                ]
            }
        ]
    }];

    $('#modal_defence').on('show.bs.modal', function (event) {
        Defence.showDefenceTree();
    });

    $('#modal_defence').on('hide.bs.modal', function (event) {
        if (_rangeEntity) {
            viewer.entities.remove(_rangeEntity);
        }
    });

    $('#btn_defence_range').on('click',function(){
        if (_rangeEntity) {
            viewer.entities.remove(_rangeEntity);
        }
        var nodes = zTreeObj.getSelectedNodes();
        if (nodes.length > 0 && nodes[0].model) {
            var model = viewer.entities.getById(nodes[0].model);
            Defence.showRange(model._position._value,nodes[0].params.range);
        }
    });

    setTimeout(() => {
        Defence.loadDefences();
    }, 2000);

    function defence()
    {
        function showDefenceTree(){
            var setting = {
                callback:{
                    onDblClick:function(event, treeId, treeNode){
                        if (treeNode.model) {
                            var model = viewer.entities.getById(treeNode.model);
                            viewer.flyTo(model); 
                        }
                    }
                }
            };
            zTreeObj = $.fn.zTree.init($('#defence_tree'), setting, data);
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

        function add(name,modelId,params)
        {
            var newNode = {
                name:name,
                model:modelId,
                params:params
            };
            data[0].children[0].children.push(newNode);
            if (zTreeObj) {
                var parentNode = zTreeObj.getNodeByParam('name','江川路街道');
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
                    scale = 2;
                    break;
                case '大型反制设备':
                    uri = '/data/model/smoking.glb';
                    scale = 10
                    break;
                default:
                    break;
            }
            viewer.entities.add({
                name: license,
                id:'defence_' + key,
                position: new Cesium.Cartesian3.fromDegrees(lng, lat, height),
                model: {
                    uri: uri,
                    scale:scale
                },
                label:{
                    text: license,
                    font: SysConfig.getConfig().model_label_size +'px Helvetica',
                    fillColor: Cesium.Color.fromCssColorString(SysConfig.getConfig().model_label_color),
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2,
                    eyeOffset:new Cesium.Cartesian3(0.0, 1.0, 0.0),
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    scaleByDistance: new Cesium.NearFarScalar(100, 1.0, 200, 0.4)
                }
            });  
        }

        function loadDefences()
        {
            $.get(API_ROOT + '/api/defence',function(response){
                if (response.succeeded) {
                    response.data.forEach(defence => {
                        var numberStr = '';
                        if (defence.number > 1) {
                            numberStr = '(' + defence.number + ')';
                        }
                        var license = defence.license + numberStr;
                        addEntity(defence.id,license,defence.type,defence.longitude,defence.latitude,defence.height);
                        add(license,'defence_' + defence.id,{license:defence.license,range:defence.range});
                    });
                }
            });
        }

        return{
            showDefenceTree:showDefenceTree,
            showRange:showRange,
            add:add,
            loadDefences:loadDefences
        };
    }
    window.Defence = defence();

}());