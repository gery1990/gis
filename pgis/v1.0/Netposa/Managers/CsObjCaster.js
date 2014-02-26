NPMapLib.CsObjCaster = (function() {
    var factory = {};

    factory._castArgs = function(p) {
        var args = new Array();
        if (p) {
            for (var i = 2; i < p.length; i++) {
                var temp = p[i];
                if ((typeof temp) == 'string' && temp.indexOf(':') > 0) {
                    args.push(eval('(' + temp + ')'));
                }
                else {
                    args.push(temp);
                }
            }
        }
        return args;
    };

    //------------------------------ ----------------------------------------------------------Control
    //用于cs创建控件
    factory._castControl = function(cs_control) {
        var result = null;
        if (!cs_control) {
            return result;
        }
        var type = cs_control.ControlType;
        if (type == NPMapLib.CONTROL_TYPE_UNKNOWN) {
            return result;
        }
        else if (type == NPMapLib.CONTROL_TYPE_COPYRIGHT) {
            result = new NPMapLib.Controls.CopyRightControl();
        }
        else if (type == NPMapLib.CONTROL_TYPE_NAVIGATION) {
            result = new NPMapLib.Controls.NavigationControl();
        }
        else if (type == NPMapLib.CONTROL_TYPE_OVERVIEW) {
            result = new NPMapLib.Controls.OverviewControl();
        }
        else if (type === NPMapLib.CONTROL_TYPE_SCALE) {
            result = new NPMapLib.Controls.ScaleControl();
        }
        if (result) {
            result.id = cs_control.id;
            result.mapId = cs_control.mapId
        }
        return result;
    };
    //------------------------------ ----------------------------------------------------------Base type
    factory._castSize = function(cs_size) {
        return new NPMapLib.Geometry.Size(cs_size.Width, cs_size.Height);
    };
    factory._castOffset = function(cs_offset) {
        return new NPMapLib.Geometry.Size(cs_offset.X, cs_offset.Y);
    };

    factory._castPoint = function(cs_point) {
        return new NPMapLib.Geometry.Point(cs_point.Lon, cs_point.Lat);
    };
    factory._castPoints = function(points) {
        var arr = new Array();
        if (!points) {
            return arr;
        }
        if (typeof points === 'object' && points.length) {
            for (var i = 0; i < points.length; i++) {
                var temp = new NPMapLib.Geometry.Point(points[i].Lon, points[i].Lat);
                arr.push(temp);
            }
        }
        return arr;
    };

    factory._castPixel = function(cs_pixel) {
        return new NPMapLib.Geometry.Pixel(cs_pixel.X, cs_pixel.Y);
    };
    //------------------------------ ----------------------------------------------------------Icon
    factory._castIcon = function(cs_icon) {
        var icon = NPMapLib.Managers.OtherManager._getIcon[cs_icon.id];
        if (icon) {
            return icon;
        }
        var size = this._castSize(cs_icon.imageSize);
        var o = new NPMapLib.Symbols.Icon(cs_icon.imageUrl, size, {
            anchor: this._castOffset(cs_icon.anchor)
        });
        o.setAnchor(this._castOffset(cs_icon.anchor));
        o.id = cs_icon.id;
        NPMapLib.Managers.OtherManager._addIcon(o);
        return o;
    };

    factory._castInfoWin = function(cs_infoWin) {
        var o = new NPMapLib.Symbols.InfoWindow(cs_infoWin.title, cs_infoWin.content, {
            width: cs_infoWin.width,
            height: cs_infoWin.height,
            offset: this._castOffset(cs_infoWin.offset),
            arrow: cs_infoWin.arrow,
            enableCloseOnClick: cs_infoWin.enableCloseOnClick
        });
        o.id = cs_infoWin.id;
        return o;
    };

    factory._castAnimation = function(cs_animation) {
        var overlay = this._castOverlay(cs_animation.overlay);
        var o = new NPMapLib.Symbols.Animation(cs_animation.mapId, overlay, {
            speed: cs_animation.opt.Speed,
            isReturn: cs_animation.opt.IsReturn,
            isRepeat: cs_animation.opt.IsRepeat
        });
        o.id = cs_animation.id;
        return o;
    };

    //------------------------------ ----------------------------------------------------------Overlay
    factory._castOverlay = function(args) {
        if (!args) {
            return null;
        }
        var overlay = NPMapLib.Managers.OverlayManager.getOverlay(args.id);
        if (overlay) {
            return overlay;
        }
        var p;
        //NPMapLib.OVERLAY_TYPE_UNKNOWN = 0;              //未知
        //NPMapLib.OVERLAY_TYPE_POLYLINE = 1;             //多段线
        //NPMapLib.OVERLAY_TYPE_POLYGON = 2;              //多边形
        //NPMapLib.OVERLAY_TYPE_CIRCLE = 3;               //圆形
        //NPMapLib.OVERLAY_TYPE_LABEL = 4;                //文本
        //NPMapLib.OVERLAY_TYPE_MARKER = 5;               //图像标注
        switch (args.OverlayType) {
            case NPMapLib.OVERLAY_TYPE_POLYLINE:
                p = this._castPoints(args.points);
                overlay = new NPMapLib.Geometry.Polyline(p, {
                    color: args.color,
                    weight: args.weight,
                    opacity: args.opacity,
                    lineStyle: args.lineStyle,
                    arrowStyle: args.arrowStyle,
                    enableEditing: args.enableEditing
                });
                break;
            case NPMapLib.OVERLAY_TYPE_POLYGON:
                p = this._castPoints(args.points);
                overlay = new NPMapLib.Geometry.Polygon(p, {
                    color: args.color,
                    weight: args.weight,
                    opacity: args.opacity,
                    lineStyle: args.lineStyle,
                    arrowStyle: args.arrowStyle,
                    enableEditing: args.enableEditing,
                    fillColor: args.fillColor,
                    fillOpacity: 0.5
                });
                break;
            case NPMapLib.OVERLAY_TYPE_CIRCLE:
                p = new NPMapLib.Geometry.Point(args.center.Lon, args.center.Lat);
                overlay = new NPMapLib.Geometry.Circle(p, args.radius,
                    this._castCircleOption(args));
                break;
            case NPMapLib.OVERLAY_TYPE_LABEL:
                overlay = this._castLabel(args);
                break;
            case NPMapLib.OVERLAY_TYPE_MARKER:
                overlay = new NPMapLib.Symbols.Marker(this._castPoint(args.Point),
                    {
                        offset: new NPMapLib.Geometry.Size(args.Offset.X, args.Offset.Y),
                        icon: this._castIcon(args.Icon)
                    });
                if (args.Label) {
                    overlay.setLabel(this._castLabel(args.Label));
                }
                break;
            default:
                break;
        }
        overlay.id = args.id;
        overlay.mapId = args.mapId;
        NPMapLib.Managers.OverlayManager.addOverlay(overlay);
        return overlay;
    };

    factory._castCircleOption = function(cs_option) {
        var opt = {
            color: cs_option.color,
            fillColor: cs_option.fillColor,
            weight: cs_option.weight,
            opacity: cs_option.opacity,
            fillOpacity: cs_option.fillOpacity,
            lineStyle: cs_option.lineStyle,
            enableEditing: cs_option.enableEditing
        };
        return opt;
    };
    factory._castPolylineOption = function(cs_option) {
    };
    factory._castPolygonOption = function(cs_option) {
    };
    factory._castLabelStyle = function(cs_labelStyle) {
    };
    //marker中保存有label对象，所以提前加入_labels
    factory._castLabel = function(cs_label) {
        if (NPMapLib.Managers.OtherManager._getLabel[cs_label.id]) {
            return NPMapLib.Managers.OtherManager._getLabel[cs_label.id];
        }
        var result = new NPMapLib.Symbols.Label(cs_label.content, {
            offset: this._castOffset(cs_label.offset),
            position: this._castPoint(cs_label.position)
        });
        if (cs_label.labelStyle) {
            var s = this._castLabelStyle(cs_label.labelStyle);
            result.setStyle(s);
        }
        result.id = cs_label.id;
        NPMapLib.Managers.OtherManager._addLabel(cs_label.id);
        return result;
    };

    //------------------------------ ----------------------------------------------------------layer
    factory._castLayer = function(params) {
        switch (params.layerType) {
            case NPMapLib.MAP_LAYER_TYPE_ARCGIS_TILE:
                {
                    //图层参数
                    var opts = {
                        centerPoint: [params.centerPoint.Lon, params.centerPoint.Lat],
                        fullExtent: [params.fullExtent.SW.Lon, params.fullExtent.SW.Lat, params.fullExtent.NE.Lon, params.fullExtent.NE.Lat],
                        minLevel: params.minLevel,
                        maxLevel: params.maxLevel,
                        zoomOffset: params.zoomOffset,
                        zoomLevelSequence: params.zoomLevelSequence,
                        initResolution: params.initResolution,
                        origin: [params.origin.Lon, params.origin.Lat]
                    };
                    //图层路径
                    var layer1 = new NPMapLib.Layers.ArcgisTileLayer(params.url, params.name, opts);
                    layer1.id = params.id;
                    return layer1;
                }
            case NPMapLib.MAP_LAYER_TYPE_OVERLAY:
                {
                    var layer = new NPMapLib.Layers.OverlayLayer(params.name);
                    layer.id = params.id;
                    layer.mapId = params.mapId;
                    return layer;
                }
        }
    };

    //------------------------------ ----------------------------------------------------------Tool
    factory._castMesaureTool = function(cs_measure) {
        var o = new NPMapLib.Tools.MeasureTool(cs_measure.mapId);
        o.id = cs_measure.id;
        return o;
    };
    factory._castDrawTool = function(cs_measure) {
        var o = new NPMapLib.Tools.DrawingTool(cs_measure.mapId);
        o.id = cs_measure.id;
        return o;
    };

    return factory;
})();


