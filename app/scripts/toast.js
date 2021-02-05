$(function(){
    function toast(){
        function show(header,body){
            header = header || '提示';
            body = body || 'body';
            $('#toast_header').text(header);
            $('#toast_body').text(body);
            $('#toast').toast('show');
        }
        return{
            show:show
        };
    }

    window.Toast = toast();
}());