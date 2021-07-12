$(function(){
    var zTreeObj;

    $('#modal_building').on('show.bs.modal', function (event) {
        Building.showBuildingTree();
    });

    $('#modal_building').on('hide.bs.modal', function (event) {
        $('#btn_building_delete').attr('disabled',true); 
        Building.clearTempEntity();
    });

    /**
     * 编辑建筑信息
     */
     $('#btn_building_edit').on('click',function(){
        var nodes = zTreeObj.getSelectedNodes();
        if (nodes.length > 0 && nodes[0].params)
        {
            Edit.showModal('建筑',nodes[0].params,function(data){
                nodes[0].name = data.name;
                zTreeObj.updateNode(nodes[0]);
                //TODO:还没有更新data数据
            });
        }
        else
        {
            Toast.show('提示','请选择建筑');
        }
    });

    /**
     * 删除建筑
     */
    $('#btn_building_delete').on('click', function () {
        var nodes = zTreeObj.getSelectedNodes();
        if (nodes.length > 0 && nodes[0].model && nodes[0].params) {
            var entity = viewer.entities.getById(nodes[0].model);
            var url = API_ROOT + '/api/building/' + nodes[0].params.id;
            $.ajax({
                type: 'DELETE',
                url: url,
                success: function (response) {
                    if (response.succeeded) {
                        Building.clearTempEntity();
                        if (entity) {
                            viewer.entities.remove(entity);
                        }
                        zTreeObj.removeNode(nodes[0]);
                        Building.deleteData(nodes[0].params.id);
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
            Toast.show('提示','请选择建筑');
        }
    });

    $('#building_show_label').on('change', function () {
        Building.setLabelVisible($(this).prop('checked'));
    });

    var data = [];

    function building(){
        var tempEntity;

        function init(){
            data = [];
            data.push({
                name:currentProject.name,
                children:[]
            });
            loadBuilding();
        }

        function showBuildingTree(){
            var setting = {
                callback:{
                    onDblClick:function(event, treeId, treeNode){
                        clearTempEntity();
                        if (treeNode.params) {
                            var coords = treeNode.params.coords;
                            var degreesArray = [];
                            coords.forEach(coord => {
                                degreesArray.push(coord.longitude);
                                degreesArray.push(coord.latitude);
                            });
                            tempEntity= viewer.entities.add({
                                id: 'building_polygon',
                                polygon: {
                                    hierarchy: Cesium.Cartesian3.fromDegreesArray(degreesArray),
                                    material: new Cesium.Color(223 / 255, 0 / 255, 0 / 255, 0.4)
                                },
                                clampToS3M: true 
                            });
                            viewer.flyTo(tempEntity);
                        }
                    },
                    onClick:function(event, treeId, treeNode)
                    {
                        if (treeNode.params) {
                            $('#btn_building_edit').attr('disabled',false); 
                            $('#btn_building_delete').attr('disabled',false); 
                        }
                        else
                        {
                            $('#btn_building_edit').attr('disabled',true); 
                            $('#btn_building_delete').attr('disabled',true); 
                        }
                    }
                }
            }
            zTreeObj = $.fn.zTree.init($('#building_tree'), setting, data);
        }

        function add(params)
        {
            params.type = '建筑';
            var newNode = {
                name:params.name,
                model:'building_' + params.id,
                params:params
            };
            data[0].children.push(newNode);
            if (zTreeObj) {
                var parentNode = zTreeObj.getNodeByParam('name',currentProject.name);
                zTreeObj.addNodes(parentNode,-1,newNode);
            }
            var lnglats = [];
            for (let i = 0; i < params.coords.length; i++) {
                lnglats.push([params.coords[i].longitude,params.coords[i].latitude]);
            }
            var polygon = turf.polygon([lnglats], { name: 'building' });
            var centroid = turf.centroid(polygon);
            var centerCoord = centroid.geometry.coordinates;
            addEnitiy(params.id,params.name,centerCoord[0],centerCoord[1],params.maxHeight);
        }

        function addEnitiy(id,text,lng,lat,height)
        {
            var label = new Cesium.Entity({
                position : Cesium.Cartesian3.fromDegrees(lng, lat,height),
                name : '建筑物_' + id,
                id:'building_' + id,
                label:{
                    text: text,
                    font: SysConfig.getConfig().building_label_size + 'px Helvetica',
                    fillColor: Cesium.Color.fromCssColorString(SysConfig.getConfig().building_label_color),
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    scaleByDistance: new Cesium.NearFarScalar(100, 1.0, 3000, 0.4)
                }
            });
            viewer.entities.add(label);
        }

        function loadBuilding(){
            $.get(`${API_ROOT}/api/building/${currentProject.id}`,function(response){
                if (response.succeeded) {
                    response.data.forEach(building => {
                        add(building);
                    });
                }
            });
        }

        function setLabelVisible(visible)
        {
            var modelIds = getModelNodes();
            modelIds.forEach(modelId => {
                var entity = viewer.entities.getById(modelId);
                if (entity) {
                    entity.show = visible;
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

        function clearTempEntity(){
            if (tempEntity) {
                viewer.entities.remove(tempEntity);
                tempEntity = null;
            }
        }

        function deleteData(id,nodes){
            nodes = nodes||data;
            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i];
                if (node.params) {
                    if (node.params.id == id) {
                        nodes.splice(i,1);
                        break;
                    }
                }
                else if(node.children)
                {
                    deleteData(id,node.children)
                }
            }
        }

        return{
            loadBuilding:loadBuilding,
            showBuildingTree:showBuildingTree,
            setLabelVisible:setLabelVisible,
            add:add,
            clearTempEntity:clearTempEntity,
            deleteData:deleteData,
            init:init
        };
    }
    window.Building = building();
}());