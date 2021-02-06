$(function(){

    var zTreeObj;

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
            
            zTreeObj = $.fn.zTree.init($('#person_tree'), setting, data);
        }

        function add(name,modelId)
        {
            var newNode = {
                name:name,
                model:modelId
            };
            if (zTreeObj) {
                var parentNode = zTreeObj.getNodeByParam('name','网格1');
                zTreeObj.addNodes(parentNode,-1,newNode);
            }
            else
            {
                data[0].children[0].children[0].children.push(newNode);
            }
        }

        return{
            showPersonTree:showPersonTree,
            add:add
        }
    }

    window.Person = person();
}());