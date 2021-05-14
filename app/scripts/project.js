$(function(){
    function project(){
        function setCurrent(id)
        {
            $.post(API_ROOT + '/api/project/set-current/' + id,function(response){
                if (response.succeeded) {
                    console.log('设置成功，请刷新浏览器');
                }
            });
            
        }


        return{
            setCurrent:setCurrent
        }
    }

    window.Project = project();
}());