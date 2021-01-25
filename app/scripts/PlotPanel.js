var PlotPanel = function (div, serverUrl, drawControl, plotEditControl, plotting) {
    var _self = this;
    this._div = div;
    this._serverUrl = serverUrl;
    this._drawControl = drawControl;
    this._plotEditControl = plotEditControl;
    this._plotting = plotting;
    this.init();
}

PlotPanel.prototype.init = function () {
    var _self = this;
    var plotPanel = document.getElementById(this._div);
    var treeNodeStyle = document.createElement('div');
    treeNodeStyle.style.height = '42%';
    treeNodeStyle.style.width = '100%';
    treeNodeStyle.style.border = '1px solid #617775';
    treeNodeStyle.style.overflow = 'auto';

    var treeNode = document.createElement('div');
    treeNode.id = 'plot_tree';
    treeNode.className = 'ztree';
    treeNode.style.height = '100%';
    treeNode.style.border = 'none';


    var iconNodeStyle = document.createElement('div');
    iconNodeStyle.style.height = '42%';
    iconNodeStyle.style.width = '100%';
    iconNodeStyle.style.marginTop = '5px';

    var iconNode = document.createElement('div');
    iconNode.id = 'icon';
    iconNode.style.height = '100%';
    iconNode.style.width = '100%';
    iconNode.style.border = '1px solid #617775';
    iconNode.style.overflow = 'auto';

    treeNodeStyle.appendChild(treeNode);
    iconNodeStyle.appendChild(iconNode);

    plotPanel.appendChild(treeNodeStyle);
    plotPanel.appendChild(iconNodeStyle);

    function beforeClickTreeNode(treeId, treeNode) {
        var tree = $.fn.zTree.getZTreeObj(treeId);
        if (treeNode.isParent) {
            tree.expandNode(treeNode);
            return false;
        } else {
            var iconNode = document.getElementById('icon');
            iconNode.innerHTML = '';
            _self.createDrawNodes(treeNode, iconNode);
        }
    }

    var setting = {
        view: {
            dblClickExpand: false,
            showLine: true,
            selectedMulti: false
        },
        data: {
            simpleData: {
                enable: true,
                idKey: 'id',
                pIdKey: 'pId',
                rootPId: 0
            }
        },
        callback: {
            beforeClick: beforeClickTreeNode
        }
    };
    this.symbolLibManager = this._plotting.getSymbolLibManager();
    if (this.symbolLibManager.isInitializeOK()) {
        var symbolTreeData = this.analysisSymbolTree(this.symbolLibManager);
        $.fn.zTree.init($('#plot_tree'), setting, symbolTreeData);
    } else {
        this.symbolLibManager.initializecompleted.addEventListener(function (result) {
            if (result.libIDs.length !== 0) {
                var symbolTreeData = _self.analysisSymbolTree(_self.symbolLibManager);
                $.fn.zTree.init($('#plot_tree'), setting, symbolTreeData);
            }
        });
        this.symbolLibManager.initializeAsync();
    }
}

PlotPanel.prototype.analysisSymbolTree = function () {
    var treeData = [];
    var idIndex = this.addBasicCellTreeNodes(treeData);

    for (var i = 0; i < this.symbolLibManager.getSymbolLibNumber(); i++) {
        var symbolLib = this.symbolLibManager.getSymbolLibByIndex(i);
        var rootSymbolInfo = symbolLib.getRootSymbolInfo();
        var rootSymbolIconUrl = symbolLib.getRootSymbolIconUrl();

        if (rootSymbolInfo.symbolNodeType === 'SYMBOL_GROUP') {
            var rootNode = new Object();
            rootNode.id = idIndex + i;
            rootNode.pId = 0;
            rootNode.name = rootSymbolInfo.symbolName;
            rootNode.fullName = rootSymbolInfo.symbolName + '/';
            treeData.push(rootNode);

            idIndex = this.innerAnalysisSymbolTree(rootSymbolInfo.childNodes, treeData, rootNode, rootSymbolIconUrl);
        }
    }
    return treeData;
}


PlotPanel.prototype.createDrawNodes = function (treeNode, iconNode) {
    var _self = this;
    var drawNodeClick = function () {
        if (_self._drawControl !== null) {
            _self._drawControl.deactivate();
            _self._drawControl.libID = this.libID;
            _self._drawControl.code = this.symbolCode;
            //设置标号默认的模型路径
            _self._drawControl.drawFinishEvent.addEventListener(function (geo) {
                if (geo.symbolType === SuperMap.Plot.SymbolType.DOTSYMBOL) {
                    geo.modelPath = '/data/plot/Cesium_Air.gltf';
                    geo.picturePath = '/data/plot/blupin.png';
                }
            });
            _self._drawControl.serverUrl = this._serverUrl;

            _self._drawControl.activate();
            if (undefined !== _self._plotEditControl) {
                _self._plotEditControl.deactivate();
            }
        }
    }
    var drawData = treeNode.drawData;

    var table = document.createElement('table');
    table.style.height = '100%';
    table.style.width = '100%';
    var i = 0;
    var rowLength = (drawData.length % 3 === 0) ? drawData.length / 3 : drawData.length / 3 + 1;
    for (var j = 0; j < rowLength; j++) {
        var tr = document.createElement('tr');
        for (var k = 0; k < 3; k++) {
            if (drawData[i]) {
                //存储菜单信息
                var td = document.createElement('td');
                var drawNode = document.createElement('div');
                drawNode.onclick = drawNodeClick;
                drawNode.style.textAlign = 'center';
                drawNode.id = drawData[i].libID + '' + drawData[i].symbolCode;
                drawNode.libID = drawData[i].libID;
                drawNode.symbolCode = drawData[i].symbolCode;
                drawNode.serverUrl = this._serverUrl;
                //图片
                var img = document.createElement('img');
                img.src = drawData[i].icon;
                //文本
                var text = document.createElement('div');
                text.innerHTML = drawData[i].symbolName;

                drawNode.appendChild(img);
                drawNode.appendChild(text);
                td.appendChild(drawNode);

                tr.appendChild(td);
            }
            i++;
        }
        table.appendChild(tr);
    }

    iconNode.appendChild(table);
}

PlotPanel.prototype.addBasicCellTreeNodes = function (treeData) {
    var cellRootNode = new Object();
    cellRootNode.id = 1;
    cellRootNode.pId = 0;
    cellRootNode.name = '基本标号';
    cellRootNode.fullName = 'BasicCell' + '/';
    cellRootNode.drawData = [];
    treeData.push(cellRootNode);

    var symbolCode = [24, 28, 29, 31, 34, 410, 32, 590, 360, 390, 400, 350, 26, 370, 380, 44, 48, /*320,*/
        1019, 1022, /*1024, 321,1023,*/  1025, 1013, 1014, 3801, 4401 /*1016, 1017, 1026,*/ /*1001 1003, 1004*/];
    var symbolName = ['折线', '平行四边形', '圆', '椭圆', '注记', '正多边形', '多边形', '贝塞尔曲线', '闭合贝塞尔曲线',
        '集结地', '大括号', '梯形', '矩形', '弓形', '扇形', '弧线', '平行线', /*"注记指示框",*/ '同心圆', '组合圆',
        /*"标注框", "多角标注框","自由线",*/ '节点链', '跑道形', '八字形', '扇形', '弧线'/*"箭头线", "沿线注记", "线型标注", "对象间连线"*/
        /*"多边形区域", "扇形区域"*/];
    var cellId = cellRootNode.id + 1;
    for (var i = 0; i < symbolCode.length; i++) {
        var drawCellNode = {
            id: cellId++,
            pId: 0,
            icon: '/images/plotPanelControl/' + cellRootNode.fullName + symbolCode[i] + '.png',
            symbolCode: symbolCode[i],
            libID: 0,
            symbolName: symbolName[i]
        };
        cellRootNode.drawData.push(drawCellNode);
    }

    return cellId;
}


PlotPanel.prototype.innerAnalysisSymbolTree = function (childSymbolInfos, treeData, parentNode, rootSymbolIconUrl) {
    var drawData = [];
    var treeNodeId = parentNode.id + 1;
    for (var i = 0; i < childSymbolInfos.length; i++) {
        if (childSymbolInfos[i].symbolNodeType === 'SYMBOL_GROUP') {
            var treeNode = new Object();
            treeNode.id = treeNodeId++;
            treeNode.pId = parentNode.id;
            treeNode.name = childSymbolInfos[i].symbolName;
            treeNode.fullName = parentNode.fullName + childSymbolInfos[i].symbolName + '/';
            treeData.push(treeNode);

            treeNodeId = this.innerAnalysisSymbolTree(childSymbolInfos[i].childNodes, treeData, treeNode, rootSymbolIconUrl);
        } else if (childSymbolInfos[i].symbolNodeType === 'SYMBOL_NODE') {
            var drawNode = new Object();
            drawNode.id = treeNodeId++;
            drawNode.pId = parentNode.id;
            drawNode.icon = rootSymbolIconUrl + parentNode.fullName + childSymbolInfos[i].symbolCode + '.png';
            drawNode.symbolCode = childSymbolInfos[i].symbolCode;
            drawNode.libID = childSymbolInfos[i].libID;
            drawNode.symbolName = childSymbolInfos[i].symbolName + '_' + childSymbolInfos[i].symbolCode;
            drawData.push(drawNode);
        }
    }
    if (drawData.length !== 0) {
        parentNode.drawData = drawData;
    }
    return treeNodeId;
}