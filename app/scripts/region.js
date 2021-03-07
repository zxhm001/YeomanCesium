$(function(){
    var zTreeObj,fenceEntity;

    var data = [{
        name:'闵行区',
        children:[
            {
                name:'江川路街道',
                children:[
                    // {
                    //     name:'旗忠网球中心',
                    //     lnglats:[121.3481480064,31.0425983687,18.0000000000,
                    //         121.3569521625,31.0441519351,18.0000000000,
                    //         121.3573941158,31.0425598188,18.0000000000,
                    //         121.3573983609,31.0410497470,18.0000000000,
                    //         121.3490896067,31.0388556443,18.0000000000,
                    //         121.3481480064,31.0425983687,18.0000000000]
                    // }
                ]
            }
        ]
    }];

    $('#modal_region').on('show.bs.modal', function (event) {
        Region.showRegionTree();
    });

    $('#modal_region').on('hide.bs.modal', function (event) {
        if (fenceEntity) {
            viewer.entities.remove(fenceEntity)
        }
    });

    setTimeout(() => {
        Region.loadRegions();
    }, 2000);
      
    function region(){

        function showRegionTree(){
            var setting = {
                callback:{
                    onDblClick:function(event, treeId, treeNode){
                        if (treeNode.lnglats) {
                            if (fenceEntity) {
                                viewer.entities.remove(fenceEntity)
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

                            viewer.flyTo(fenceEntity); 
                        }
                    }
                }
            };

            zTreeObj = $.fn.zTree.init($('#region_tree'), setting, data);
        }

        function add(name,color,lnglats)
        {
            var newNode = {
                name:name,
                lnglats:lnglats,
                color:color
            };
            data[0].children[0].children.push(newNode);
        }

        function loadRegions(){
            $.get(API_ROOT + '/api/region',function(response){
                if (response.succeeded) {
                    response.data.forEach(region => {
                        var color = new Cesium.Color(1, 1, 1);
                        var lnglats = [];
                        region.locations.forEach(location => {
                            lnglats.push(location.longitude);
                            lnglats.push(location.latitude);
                            lnglats.push(location.height);
                        });
                        lnglats.push(region.locations[0].longitude);
                        lnglats.push(region.locations[0].latitude);
                        lnglats.push(region.locations[0].height);
                        switch (region.type) {
                            case '危险区域':
                                color = new Cesium.Color(1, 0, 0);
                                break;
                            case '安全区域':
                                color = new Cesium.Color(0, 1, 0);
                                break;
                            default:
                                break;
                        }
                        add(region.name,color,lnglats);
                    });
                }
            });
        }

        return{
            showRegionTree:showRegionTree,
            add:add,
            loadRegions:loadRegions
        }
    }

    window.Region = region();
}());