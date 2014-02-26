
NPMapLib.Adapter.OpenLayers.EventAdapter = new Object();

NPMapLib.Adapter.OpenLayers.EventAdapter.prototype.Register = function(obj, event, handler) {
    if (!obj || !obj._apiObj) {
        return;
    }
    switch (event) {
        case NPMapLib.MARKER_EVENT_CLICK:
            obj._apiObj.events.register('click', function() {
                var pos = obj.getPosition();
                handler(obj,new NPMapLib.Geometry.Point(pos.lon, pos.lat));
            });
            break;
        case NPMapLib.MARKER_EVENT_DBLCLICK:
            obj._apiObj.events.register('dblclick', function() {
                var pos = obj.getPosition();
                handler(new NPMapLib.Geometry.Point(pos.lon, pos.lat));
            });
            break;
        case NPMapLib.MARKER_EVENT_RIGHT_CLICK:
            obj._apiObj.events.register('mouseup', function() {
                if (window.event.button === 2) {
                    var pos = obj.getPosition();
                    handler(new NPMapLib.Geometry.Point(pos.lon, pos.lat));
                }
            });
            break;
        case NPMapLib.MARKER_EVENT_MOUSE_DOWN:
            obj._apiObj.events.register('mousedown', function() {
                var pos = obj.getPosition();
                handler(new NPMapLib.Geometry.Point(pos.lon, pos.lat));
            });
            break;
        case NPMapLib.MARKER_EVENT_MOUSE_UP:
            obj._apiObj.events.register('mouseup', function() {
                var pos = obj.getPosition();
                handler(new NPMapLib.Geometry.Point(pos.lon, pos.lat));
            });
            break;
        case NPMapLib.MARKER_EVENT_MOUSE_OVER:
            obj._apiObj.events.register('mouseover', function() {
                var pos = obj.getPosition();
                handler(new NPMapLib.Geometry.Point(pos.lon, pos.lat));
            });
            break;
        case NPMapLib.MARKER_EVENT_MOUSE_OUT:
            obj._apiObj.events.register('mouseout', function() {
                var pos = obj.getPosition();
                handler(new NPMapLib.Geometry.Point(pos.lon, pos.lat));
            });
            break;
        case NPMapLib.MARKER_EVENT_DRAG_START:

            break;
        case NPMapLib.MARKER_EVENT_DRAG_END:

            break;
    } 
}