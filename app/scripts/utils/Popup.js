(function (win) {
    function Popup(viewer, closeElement) {
        this._viewer = viewer;

        var container = viewer.container;
        var popupContainer = document.createElement('div');
        popupContainer.className = 'custom-popup-container';
        popupContainer.id = 'entitypopup';
        container.appendChild(popupContainer);
        this._container = popupContainer;

        var infoElement = document.createElement('div');
        infoElement.className = 'custom-popup';
        popupContainer.appendChild(infoElement);
        this._element = infoElement;

        if (closeElement) {
            var closeElement = document.createElement('a');
            closeElement.className = 'custom-popup-closer';
            closeElement.href = '#';
            infoElement.appendChild(closeElement);

            var that = this;
            closeElement.addEventListener('click', function (evt) {
                closeElement.blur();
                that.destroy();
                //关闭Popup后，取消当前Entity选中
                //that._viewer.selectedEntity = undefined;
                evt.preventDefault();
            }, false);
        }
        var contentElement = document.createElement('div');
        contentElement.className = 'custom-popup-content';
        infoElement.appendChild(contentElement);

        this._content = contentElement;
        this._scene = viewer.scene;
        viewer.scene.postRender.addEventListener(Popup.prototype.renderListener, this);

        this._show = true;
        this._minRange = 0;
        this._maxRange = 1e8;
        this.isDirty = false;
        this.lastViewMatrix = null;
        this.lastBounds = null;
    }
    Popup.defaultDescribe = function (properties, labelInfo) {
        var html = '';
        // properties 为字符串或者HTMLElement，直接返回
        if ((typeof properties == 'string') || (properties instanceof HTMLElement)) {
            html = properties;
            return html;
        }
        //存在字段映射对象，就做映射
        else if (labelInfo) {
            for (var key in labelInfo) {
                if (properties.hasOwnProperty(key)) {
                    var name = labelInfo[key];
                    var value = properties[key];
                    if (Cesium.defined(value)) {
                        if (typeof value === 'object') {
                            html += '<tr><td>' + name + ' :  ' + '</td><td>' + defaultDescribe(value) + '</td></tr>';
                        } else {
                            html += '<tr><td>' + name + ' :  ' + '</td><td>' + value + '</td></tr>';
                        }
                    }
                }
            }
        }
        //按照键值对返回
        else {
            for (var index in properties) {
                var item = properties[index];
                html += '<tr><td>' + index + ' :  ' + '</td><td>' + item + '</td></tr>';
            }
        }

        if (html.length > 0) {
            html = '<table class="cesium-infoBox-defaultTable"><tbody>' + html + '</tbody></table>';
        }
        return html;
    }

    Popup.createDescriptionCallback = function (describe, properties, labelInfo) {
        var description;
        return function (time, result) {
            if (!Cesium.defined(description)) {
                description = describe(properties, labelInfo);
            }
            return description;
        };
    }

    Popup.defaultDescribeProperty = function (properties, labelInfo) {
        if (properties) {
            return new Cesium.CallbackProperty(Popup.createDescriptionCallback(Popup.defaultDescribe, properties, labelInfo), true);
        }
    }

    /**
	 * 常用方法, 属性弹框
	 *  @param  viewer : Cesium的视图对象
     *  @param  lon : 经度
     *  @param  lat : 纬度
     *  @param  height : 高度
     *  @param  properties : 属性信息，可以是HTMLElement、string、和键值对的属性Object
     *  @param  labelInfo :  可选，属性字段显示的映射表，键值对Object
     *  @param  offset : 可选，弹框偏移值，像素单位{x: 0,y: 0}
     *  @param  closable : 可选，弹框是否带有关闭按钮
	 */
    Popup.pop = function (viewer, lon, lat, height, properties, labelInfo, offset, closable) {
        height = height || 0.0;
        closable = closable || false;
        var position = Cesium.Cartesian3.fromDegrees(lon, lat, height)
        var popup = new Popup(viewer, closable);
        popup.showPosition(position, properties, labelInfo, offset);
        return popup;
    }

    Popup.prototype.setRange = function (minrange, maxRange) {
        this._minRange = minrange;
        this._maxRange = maxRange;
    }

    /**
     * Internal - Control element visibility
     */
    Popup.prototype._setVisible = function (value) {
        if (this._isVisible === value) {
            return;
        }
        this._isVisible = value;

        if (this._isVisible) {
            this._container.style.display = 'block';
        } else {
            this._container.style.display = 'none';
        }
    }

    Popup.prototype._markDirty = function () {
        this.isDirty = true;
    };

    Popup.prototype.setInformation = function (properties, labelInfo) {
        var description = Popup.defaultDescribeProperty(properties, labelInfo);
        var html = Cesium.Property.getValueOrDefault(description, Cesium.JulianDate.now(), '');
        if (html instanceof HTMLElement) {
            this._content.innerHTML = '';
            this._content.appendChild(html);
        } else {
            this._content.innerHTML = html;
        }
        this._container.style.display = 'block';
        this._content.scrollTop = 0;
    };

    // 显示Popup，传入位置和内容
    Popup.prototype.showPosition = function (position, properties, labelInfo, offset) {
        this._offset = offset || {
            x: 0,
            y: 0
        };
        var description = Popup.defaultDescribeProperty(properties, labelInfo);
        this.showEntity({
            description: description,
            position: position
        });
    };

    //entity:{description:"",position:Cartesian}}
    Popup.prototype.showEntity = function (entity, offset) {
        this.show = true;
        this._entity = entity;
        this._offset = offset || {
            x: 0,
            y: 0
        };
        var html = undefined;
        if (typeof entity.description == 'string') {
            html = entity.description;
        } else {
            html = Cesium.Property.getValueOrDefault(entity.description, Cesium.JulianDate.now(), '');
        }
        html = html || entity.description;

        if (html instanceof HTMLElement) {
            this._content.innerHTML = '';
            this._content.appendChild(html);
        } else {
            this._content.innerHTML = html;
        }
        this._container.style.display = 'block';
        this._content.scrollTop = 0;
    };

    Popup.prototype.renderListener = function () {
        var scene = this._scene;
        var obj = this._entity;
        var offset = Cesium.clone(this._offset);
        var clock = this._viewer.cesiumWidget.clock;

        if (!this._show || !Cesium.defined(this._entity)) {
            this._setVisible(false);
            return;
        }

        //场景范围不变，Popup位置不变
        var newViewMatrix = scene.camera.viewMatrix;
        var newBounds = {
            width: scene.canvas.width,
            height: scene.canvas.height
        };
        if (!this.isDirty && newViewMatrix.equals(this.lastViewMatrix) &&
            this.lastBounds &&
            newBounds.width === this.lastBounds.width &&
            newBounds.height === this.lastBounds.height) {
            return;
        }
        this.lastViewMatrix = newViewMatrix.clone();
        this.lastBounds = newBounds;

        var cameraPosition = scene.camera.positionWC;
        var ellipsoid = scene.globe.ellipsoid;
        var occluder = new Cesium.EllipsoidalOccluder(ellipsoid, cameraPosition);

        var posCoord = undefined;
        var winCoord = undefined;
        if (obj instanceof Cesium.Entity) {
            if (Cesium.defined(obj.position)) {
                posCoord = obj.position.getValue(clock.currentTime);
                //选中Entity，弹框向上调整位置
                offset.y -= 12;
            }
        } else if (obj.position) {
            posCoord = obj.position;
        }

        if (!Cesium.defined(posCoord)) {
            this._setVisible(false);
            return;
        }

        // Check horizon occlusion
        if (!occluder.isPointVisible(posCoord)) {
            this._setVisible(false);
            return;
        }

        // Check visibility by distance
        var dist = Cesium.Cartesian3.distance(posCoord, cameraPosition);
        if (dist < this._minRange || dist > this._maxRange) {
            this._setVisible(false);
            return;
        }

        // Check position
        winCoord = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, posCoord);
        if (!Cesium.defined(winCoord)) {
            this._setVisible(false);
            return;
        }

        this._setVisible(true);
        this.isDirty = false;
        this._container.style.left = winCoord.x + offset.x + 'px';
        this._container.style.top = winCoord.y + offset.y - 12 + 'px';
    };

    Object.defineProperties(Popup.prototype, {
        container: {
            get: function () {
                return this._container;
            }
        },
        owner: {
            get: function () {
                return this._entity;
            }
        },
        show: {
            get: function () {
                return this._show;
            },
            set: function (value) {
                this._show = value;
                this._markDirty();
            }
        }
    });

    Popup.prototype.isDestroyed = function () {
        return false;
    };

    Popup.prototype.destroy = function () {
        var container = this._viewer.container;
        container.removeChild(this._container);
        this._viewer.scene.postRender.removeEventListener(Popup.prototype.renderListener, this);
        this._entity = undefined;
        return Cesium.destroyObject(this);
    };

    // 全局注册
    window.Popup = Popup;
})(this)