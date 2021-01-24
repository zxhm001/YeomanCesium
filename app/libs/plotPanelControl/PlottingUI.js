//var isWinRT = (typeof Windows === "undefined") ? false : true;
{
    var r = new RegExp("(^|(.*?\\/))(PlottingUI.Include\.js)(\\?|$)"),
    s = document.getElementsByTagName('script'),
    src, m, baseurl = "";
    for(var i=0, len=s.length; i<len; i++) {
        src = s[i].getAttribute('src');
        if(src) {
            var m = src.match(r);
            if(m) {
                baseurl = m[1];
                break;
            }
        }
    }
    inputLink(baseurl + "colorpicker/css/colorpicker.css");
    inputLink(baseurl + "colorpicker/css/layout.css");
    inputLink(baseurl + "jquery-easyui-1.4.4/css/easyui.css");
    inputLink(baseurl + "zTree/css/zTreeStyle.css");

    inputScript(baseurl + "jquery-easyui-1.4.4/jquery.min.js");
    inputScript(baseurl + "jquery-easyui-1.4.4/jquery-ui.js");
    inputScript(baseurl + "jquery-easyui-1.4.4/jquery.easyui.min.js");

    inputScript(baseurl + "colorpicker/js/colorpicker.js");
    inputScript(baseurl + "colorpicker/js/colorpickerEditor.js");
    inputScript(baseurl + "colorpicker/js/eye.js");
    inputScript(baseurl + "colorpicker/js/utils.js");
    inputScript(baseurl + "colorpicker/js/layout.js");

    inputScript(baseurl + "zTree/jquery.ztree.core.js");

    inputScript(baseurl + "PlotPanel.js");
    inputScript(baseurl + "StylePanel.js");
    // inputScript("TreePanel.js");

}

function inputLink(inc){
    //if (!isWinRT) {
        var link = '<' + 'link rel="stylesheet" type="text/css" media="screen,projection" href="' + inc + '"' + '><' + '/>';
        document.writeln(link);
    //} else {
    //    var link = document.createElement("link");
    //    link.href = "../PlottingPanel/zTree/" + inc;
    //    document.getElementsByTagName("HEAD")[0].appendChild(link);
    //}
}

function inputScript(inc){
    //if (!isWinRT) {
        var script = '<' + 'script type="text/javascript" src="' + inc + '"' + '><' + '/script>';
        document.writeln(script);
    //} else {
    //    var script = document.createElement("script");
    //    script.src = "../PlottingPanel/zTree/" + inc;
    //    document.getElementsByTagName("HEAD")[0].appendChild(script);
    //}
}
