$(function(){
    var zTreeObj,fenceEntity;

    $('#modal_region').on('show.bs.modal', function (event) {
        Region.showRegionTree();
    });

    $('#modal_region').on('hide.bs.modal', function (event) {
        if (fenceEntity) {
            viewer.entities.remove(fenceEntity)
        }
    });
      
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
                            fenceEntity= viewer.entities.add({
                                wall: {
                                    positions: Cesium.Cartesian3.fromDegreesArrayHeights(treeNode.lnglats),
                                    minimumHeights: minimumHeights,  
                                    maximumHeights: new Cesium.CallbackProperty(e => {
                                        for (let i = 0; i < minimumHeights.length; i++) {
                                            dayMaximumHeights[i] += 30 * 0.02;
                                            if (dayMaximumHeights[i] > maximumHeights[i]) {
                                                dayMaximumHeights[i] = minimumHeights[i];
                                            }
                                        }
                                        return dayMaximumHeights;
                                    }, false),
                                    material: new Cesium.ImageMaterialProperty({
                                        image: '/images/fence.png',
                                        transparent: true,
                                        color: Cesium.Color.RED
                                    })
                                }
                            });

                            viewer.flyTo(fenceEntity); 
                        }
                    }
                }
            };
            var data = [{
                name:'闵行区',
                children:[
                    {
                        name:'江川路街道',
                        children:[
                            {
                                name:'旗忠网球中心',
                                lnglats:[121.3481480064,31.0425983687,18.0000000000,
                                    121.3569521625,31.0441519351,18.0000000000,
                                    121.3573941158,31.0425598188,18.0000000000,
                                    121.3573983609,31.0410497470,18.0000000000,
                                    121.3490896067,31.0388556443,18.0000000000,
                                    121.3481480064,31.0425983687,18.0000000000]
                            }
                        ]
                    }
                ]
            }];

            zTreeObj = $.fn.zTree.init($('#region_tree'), setting, data);
        }

        return{
            showRegionTree:showRegionTree
        }
    }

    window.Region = region();
}());