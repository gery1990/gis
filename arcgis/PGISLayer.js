define("esri/layers/PGISLayer", ["dojo/_base/declare", "esri/layers/tiled"],
 function (declare) {
     return declare("esri.layers.PGISLayer", esri.layers.TiledMapServiceLayer, {
         constructor: function () {
           this.spatialReference = new esri.SpatialReference({ wkid: 3785 });
             this.initialExtent = (this.fullExtent = new esri.geometry.Extent(107.4414,32.75,110.0039,34.73046, this.spatialReference));

             this.tileInfo = new esri.layers.TileInfo({
                 "rows": 256,
                 "cols": 256,
                 "compressionQuality": 0,
                 "origin": {
                     "x": -1,
                     "y": 68
                 },
                 "spatialReference": {
                     "wkid": 3785
                 },
                 "lods": [
                  { "level": 0, "resolution": 2, "scale": 786432000 },
                { "level": 1, "resolution": 1, "scale": 393216000 },
                { "level": 2, "resolution": 0.5, "scale": 196608000 },
                { "level": 3, "resolution": 0.25, "scale": 98304000 },
                { "level": 4, "resolution": 0.125, "scale": 49152000 },
                { "level": 5, "resolution": 0.0625, "scale": 24576000 },
                { "level": 6, "resolution": 0.03125, "scale": 12288000 },
                { "level": 7, "resolution": 0.015625, "scale": 6144000 },
                { "level": 8, "resolution": 0.0078125, "scale": 3072000 },
                { "level": 9, "resolution": 0.00390625, "scale": 1536000 },
                { "level": 10, "resolution": 0.001953125, "scale": 768000 },
                { "level": 11, "resolution": 0.0009765625, "scale": 384000 },
                { "level": 12, "resolution": 0.00048828125, "scale": 192000 },
                { "level": 13, "resolution": 0.000244140625, "scale": 96000 },
                { "level": 14, "resolution": 0.0001220703125, "scale": 48000 },
                { "level": 15, "resolution": 0.00006103515625, "scale": 24000 },
                { "level": 16, "resolution": 0.000030517578125, "scale": 12000 },
                { "level": 17, "resolution": 0.0000152587890625, "scale": 6000 },
                { "level": 18, "resolution": 0.00000762939453125, "scale": 3000 },
                { "level": 19, "resolution": 0.000003814697265625, "scale": 1500 },
                { "level": 20, "resolution": 0.0000019073486328125, "scale": 750 },
                { "level": 21, "resolution": 9.5367431640625e-7, "scale": 375 },
                { "level": 22, "resolution": 4.76837158203125e-7, "scale": 187.5 }
            ]
             });
             this.loaded = true;
             this.onLoad(this);
         },
         getTileUrl: function (level, row, col) {
             //return "http://t" + col % 8 + ".tianditu.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&TILEMATRIX=" + level + "&TILEROW=" + row + "&TILECOL=" + col + "&FORMAT=tiles";
             return "http://10.173.2.20/PGIS_S_TileMapServer/Maps/V/EzMap?Service=getImage&Type=RGB&ZoomOffset=0&V=0.3&Col="+ col +"&Row="+ row +"&Zoom="+level;
         }
     });
 });