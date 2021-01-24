$(function(){

    $('#modal_person').on('show.bs.modal', function (event) {
        Person.showPersonTree();
    });
      
    function person(){

        function showPersonTree(){
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
            var data = [{
                name:'闵行区',
                children:[
                    {
                        name:'江川路街道',
                        children:[
                            {
                                name:'网格1',
                                children:[
                                    {
                                        name:'人员1',
                                        model:'person_1'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }];
            var zTreeObj = $.fn.zTree.init($('#person_tree'), setting, data);
        }

        return{
            showPersonTree:showPersonTree
        }
    }

    window.Person = person();
}());