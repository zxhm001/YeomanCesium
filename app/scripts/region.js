$(function(){
    var zTreeObj,fenceEntity;

    var data = [];

    $('#modal_region').on('show.bs.modal', function (event) {
        Region.showRegionTree();
    });

    $('#modal_region').on('hide.bs.modal', function (event) {
        $('#btn_region_delete').attr('disabled',true); 
        Region.showAllFence($(this).prop('checked'));
        // if (fenceEntity) {
        //     viewer.entities.remove(fenceEntity)
        // }
    });

    /**
     * 编辑区域信息
     */
     $('#btn_region_edit').on('click',function(){
        var nodes = zTreeObj.getSelectedNodes();
        if (nodes.length > 0 && nodes[0].params)
        {
            Edit.showModal(nodes[0].params.type,nodes[0].params,function(data){
                nodes[0].name = data.name;
                zTreeObj.updateNode(nodes[0]);
                //TODO:还没有更新data数据
            });
        }
        else
        {
            Toast.show('提示','请选择区域');
        }
    });

    /**
     * 删除区域
     */
    $('#btn_region_delete').on('click',function(){
        var nodes = zTreeObj.getSelectedNodes();
        if (nodes.length > 0 && nodes[0].params) {
            var url = API_ROOT + '/api/region/' + nodes[0].params.id;
            $.ajax({
                type: 'DELETE',
                url: url,
                success: function (response) {
                    if (response.succeeded) {
                        Region.showAllFence(false);
                        var entity = viewer.entities.getById('region_' + nodes[0].params.id);
                        if (entity) {
                            viewer.entities.remove(entity)
                        }
                        zTreeObj.removeNode(nodes[0]);
                        Region.deleteData(nodes[0].params.id);
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
            Toast.show('提示','请选择区域');
        }
    });

    $('#region_show_model').on('change',function(){
        Region.showAllFence($(this).prop('checked'));
    })
      
    function region(){

        function init(){
            data = [];
            $.get(`${API_ROOT}/api/fitting/by-type/区域`,function(response){
                response.data.forEach(fitting => {
                    fitting.children = [];
                    data.push(fitting);
                });
                loadRegions();
            });
        }

        function showRegionTree(){
            var setting = {
                callback:{
                    onDblClick:function(event, treeId, treeNode){
                        showAllFence(false);
                        var entity = drawFenceEntity(treeNode);
                        entity.show = true;
                        viewer.flyTo(entity); 
                    },
                    onClick:function(event, treeId, treeNode)
                    {
                        if (treeNode.params) {
                            $('#btn_region_edit').attr('disabled',false); 
                            $('#btn_region_delete').attr('disabled',false); 
                        }
                        else
                        {
                            $('#btn_region_edit').attr('disabled',true); 
                            $('#btn_region_delete').attr('disabled',true); 
                        }
                    }
                }
            };

            zTreeObj = $.fn.zTree.init($('#region_tree'), setting, data);
        }

        function add(name,type,color,lnglats,params)
        {
            var newNode = {
                name:name,
                lnglats:lnglats,
                color:color,
                params:params
            };
            data.forEach(node => {
                if (node.name == type) {
                    node.children.push(newNode);
                }
            });
        }

        function drawFenceEntity(treeNode)
        {
            if (treeNode.lnglats) {
                var fenceEntity = viewer.entities.getById('region_' + treeNode.params.id);
                if (fenceEntity) {
                    return fenceEntity;
                }
                var minimumHeights =  [],maximumHeights = [],dayMaximumHeights = [];
                for (let i = 0; i < treeNode.lnglats.length; i++) {
                    if(i%3 == 2)
                    {
                        minimumHeights.push(treeNode.lnglats[i]);
                        dayMaximumHeights.push(treeNode.lnglats[i]);
                        maximumHeights.push(treeNode.lnglats[i] + 30);
                    }
                }
                var color = Cesium.Color.RED;
                if (treeNode.color) {
                    color = treeNode.color;
                }
                fenceEntity= viewer.entities.add({
                    id:'region_' + treeNode.params.id,
                    show:false,
                    wall: {
                        positions: new Cesium.CallbackProperty(e => {
                            return Cesium.Cartesian3.fromDegreesArrayHeights(treeNode.lnglats);
                        }, false),
                        minimumHeights:new Cesium.CallbackProperty(e => {
                            return minimumHeights;
                        }, false),   
                        maximumHeights: new Cesium.CallbackProperty(e => {
                            for (let i = 0; i < minimumHeights.length; i++) {
                                dayMaximumHeights[i] += 30 * 0.01;
                                if (dayMaximumHeights[i] > maximumHeights[i]) {
                                    dayMaximumHeights[i] = minimumHeights[i];
                                }
                            }
                            return dayMaximumHeights;
                        }, false),
                        material: new Cesium.ImageMaterialProperty({
                            image: '/images/fence.png',
                            transparent: true,
                            color: color
                        })
                    }
                });
                return fenceEntity;
            }
        }

        function loadRegions(){
            $.get(`${API_ROOT}/api/region/${currentProject.id}`,function(response){
                if (response.succeeded) {
                    response.data.forEach(region => {
                        var lnglats = [];
                        region.locations.forEach(location => {
                            lnglats.push(location.longitude);
                            lnglats.push(location.latitude);
                            lnglats.push(location.height);
                        });
                        lnglats.push(region.locations[0].longitude);
                        lnglats.push(region.locations[0].latitude);
                        lnglats.push(region.locations[0].height);
                        var fitting = getFitting(region.type);
                        var color = new Cesium.Color.fromCssColorString(fitting);;
                        add(region.name,region.type,color,lnglats,region);
                    });
                }
            });
        }

        function showAllFence(isShow){
            var nodes = getModelNodes();
            if (!isShow) {
                nodes.forEach(node => {
                    var entity = viewer.entities.getById('region_' + node.params.id);
                    if (entity) {
                        entity.show = false;
                    }
                });
            }
            else
            {
                nodes.forEach(node => {
                    var entity = drawFenceEntity(node);
                    entity.show = true;
                });
            }
        }

        function getModelNodes(){
            var modelNodes = [];
            data.forEach(node => {
                node.children.forEach(subNode => {
                    if (subNode.color) {
                        modelNodes.push(subNode)
                    }
                });
            });
            return modelNodes;
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

        function getFitting(name)
        {
            for (let index = 0; index < data.length; index++) {
                const fitting = data[index];
                if (fitting.name == name) {
                    return fitting;
                }
            }
        }

        return{
            showRegionTree:showRegionTree,
            add:add,
            loadRegions:loadRegions,
            drawFenceEntity:drawFenceEntity,
            showAllFence:showAllFence,
            deleteData:deleteData,
            init:init
        }
    }

    window.Region = region();
}());