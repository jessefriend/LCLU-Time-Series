import 'ol/ol.css';
import 'ol-layerswitcher/dist/ol-layerswitcher.css';

import Map from 'ol/Map';
import View from 'ol/View';
import Feature from 'ol/Feature';
import {TileArcGISRest, TileWMS, ImageArcGISRest, XYZ, OSM, Vector as VectorSource, Image} from 'ol/source';
import Stamen from 'ol/source/Stamen';
import {Image as ImageLayer, Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {Fill, Stroke, Style, Text} from 'ol/style';
import GeoJSON from 'ol/format/GeoJSON';
import LayerGroup from 'ol/layer/Group';
import {bbox as bboxStrategy} from 'ol/loadingstrategy';
import Overlay from 'ol/Overlay';
import {toLonLat} from 'ol/proj';
import {toStringHDMS} from 'ol/coordinate';
import {DragBox, Select} from 'ol/interaction';
import {platformModifierKeyOnly} from 'ol/events/condition';
import {fromExtent} from 'ol/geom/Polygon';


/**
 * Elements that make up the popup.
 */
const container = document.getElementById('popup');
const content = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');

/**
 * Create an overlay to anchor the popup to the map.
 */
const overlay = new Overlay({
  element: container,
  autoPan: true,
  autoPanAnimation: {
    duration: 60,
  },
});

/**
 * Add a click handler to hide the popup.
 * @return {boolean} Don't follow the href.
 */
closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};

var baseLayer =
  new TileLayer({
    title: 'baseLayer',
    source: new XYZ({
        url:
          'https://server.arcgisonline.com/ArcGIS/rest/services/' +
          'World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}',
      }),
  });

var wms2000 =
  new TileWMS({
    params: {'LAYERS': 'Corine_Land_Cover_2000_raster11306', 'TILED':true},
    crossOrigin: 'anonymous',
    serverType: 'mapserver',
    url: 'https://image.discomap.eea.europa.eu/arcgis/services/Corine/CLC2000_WM/MapServer/WmsServer',
  });

var wms2006 =
  new TileWMS({
    params: {'LAYERS': 'Corine_Land_Cover_2006_raster43084', 'TILED':true},
    crossOrigin: 'anonymous',
    serverType: 'mapserver',
    url: 'https://image.discomap.eea.europa.eu/arcgis/services/Corine/CLC2006_WM/MapServer/WmsServer',
  });

var wms2012 =
  new TileWMS({
    params: {'LAYERS': 'Corine_Land_Cover_2012_raster59601', 'TILED':true},
    crossOrigin: 'anonymous',
    serverType: 'mapserver',
    url: 'https://image.discomap.eea.europa.eu/arcgis/services/Corine/CLC2012_WM/MapServer/WmsServer',
  });

var wms2018 =
  new TileWMS({
    params: {'LAYERS': '12', 'TILED':true},
    crossOrigin: 'anonymous',
    serverType: 'mapserver',
    url: 'https://image.discomap.eea.europa.eu/arcgis/services/Corine/CLC2018_WM/MapServer/WmsServer',
  });


var layers = [
  new TileLayer({
    title: 'wms2000',
    source: wms2000,
    maxZoom: 10,
  }),
  new TileLayer({
    title: 'wms2006',
    source: wms2006,
    maxZoom: 10,
  }),
  new TileLayer({
    title: 'wms2012',
    source: wms2012,
    maxZoom: 10,
  }),
  new TileLayer({
    title: 'wms2018',
    source: wms2018,
    maxZoom: 10,
  }),
 ];

 var tileLayers = [
   new TileLayer({
     title: 'tile2000',
     minZoom: 10,
     source: new TileArcGISRest({
       params: {'TILED':true},
       url: 'https://image.discomap.eea.europa.eu/arcgis/rest/services/Corine/CLC2000_WM/MapServer',
     }),
   }),
   new TileLayer({
     title: 'tile2006',
     minZoom: 10,
     source: new TileArcGISRest({
       params: {'TILED':true},
       url: 'https://image.discomap.eea.europa.eu/arcgis/rest/services/Corine/CLC2006_WM/MapServer',
     }),
   }),
   new TileLayer({
     title: 'tile2012',
     minZoom: 10,
     source: new TileArcGISRest({
       params: {'TILED':true},
       url: 'https://image.discomap.eea.europa.eu/arcgis/rest/services/Corine/CLC2012_WM/MapServer',
     }),
   }),
   new TileLayer({
     title: 'tile2018',
     minZoom: 10,
     source: new TileArcGISRest({
       params: {'TILED':true},
       url: 'https://image.discomap.eea.europa.eu/arcgis/rest/services/Corine/CLC2018_WM/MapServer',
     }),
   }),
  ];

var adminLayer =
  new ImageLayer({
    title: 'admin',
    source: new ImageArcGISRest({
      ratio: 1,
      params: {},
      url: 'https://maratlas.discomap.eea.europa.eu/arcgis/rest/services/Maratlas/country_borders/MapServer',
    }),
  });

var labelLayer =
  new TileLayer({
    title: 'Labels',
    source: new Stamen({
      layer: 'toner-labels' }),
      });

//vector layers
// var vSource2000 = new VectorSource({
//   format: new GeoJSON(),
//   url: function (extent) {
//     return (
//       'https://clc-timeseries.gaf.de/wfs?service=wfs&version=1.1.0&' +
//       '&REQUEST=GetFeature&TYPENAME=timeseries:U2006_CLC2000_V2020_20u1&' +
//       'outputFormat=application/json&srsname=EPSG:3857&' +
//       'bbox=' +
//       extent.join(',') +
//       ',EPSG:3857'
//     );
//   },
//   strategy: bboxStrategy,
// });

// var vSource2006 = new VectorSource({
//   format: new GeoJSON(),
//   url: function (extent) {
//     return (
//       'https://clc-timeseries.gaf.de/wfs?service=wfs&version=1.1.0&' +
//       '&REQUEST=GetFeature&TYPENAME=timeseries:U2012_CLC2006_V2020_20u1U2012_CLC2006_V2020_20u1&' +
//       'outputFormat=application/json&srsname=EPSG:3857&' +
//       'bbox=' +
//       extent.join(',') +
//       ',EPSG:3857'
//     );
//   },
//   strategy: bboxStrategy,
// });
//
// var vSource2012 = new VectorSource({
//   format: new GeoJSON(),
//   url: function (extent) {
//     return (
//       'https://clc-timeseries.gaf.de/wfs?service=wfs&version=1.1.0&' +
//       '&REQUEST=GetFeature&TYPENAME=timeseries:U2018_CLC2012_V2020_20u1U2018_CLC2012_V2020_20u1&' +
//       'outputFormat=application/json&srsname=EPSG:3857&' +
//       'bbox=' +
//       extent.join(',') +
//       ',EPSG:3857'
//     );
//   },
//   strategy: bboxStrategy,
// });
//
// var vSource2018 = new VectorSource({
//   format: new GeoJSON(),
//   url: function (extent) {
//     return (
//       'https://clc-timeseries.gaf.de/wfs?service=wfs&version=1.1.0&' +
//       '&REQUEST=GetFeature&TYPENAME=timeseries:U2018_CLC2018_V2020_20u1U2018_CLC2018_V2020_20u1&' +
//       'outputFormat=application/json&srsname=EPSG:3857&' +
//       'bbox=' +
//       extent.join(',') +
//       ',EPSG:3857'
//     );
//   },
//   strategy: bboxStrategy,
// });
//
// var vectorLayers = [
//   new VectorLayer({
//     visible: false,
//     opacity: 1,
//     title: 'vector2000',
//     source: vSource2000,
//   }),
//   new VectorLayer({
//     visible: false,
//     opacity: 0,
//     title: 'vector2006',
//     source: vSource2006,
//   }),
//   new VectorLayer({
//     visible: false,
//     opacity: 0,
//     title: 'vector2012',
//     source: vSource2012,
//   }),
//   new VectorLayer({
//     visible: false,
//     opacity: 0,
//     title: 'vector2018',
//     source: vSource2018,
//   })
// ]

var view = new View({
  center: [1069099, 7200000],
  zoom: 4.1,
  constrainRotation: 16,
});

var map = new Map({
  layers: [baseLayer],
  target: 'map',
  overlays: [overlay],
  view: view,
});

for (var i = 0; i < 4; i++) {
  map.addLayer(layers[i]);
  map.addLayer(tileLayers[i]);
}

// map.addLayer(vectorLayers[0]);
map.addLayer(adminLayer);
map.addLayer(labelLayer);

function parseXml(xmlStr) {
   return new window.DOMParser().parseFromString(xmlStr, "text/xml");
}

map.on('singleclick', function (evt) {
  content.innerHTML = '';
  var coordinate = evt.coordinate
  const viewResolution = /** @type {number} */ (view.getResolution());
  const url2000 = wms2000.getFeatureInfoUrl(
    coordinate,
    viewResolution,
    'EPSG:3857',
    {'INFO_FORMAT': 'text/xml'}
  );
  const url2006 = wms2006.getFeatureInfoUrl(
    coordinate,
    viewResolution,
    'EPSG:3857',
    {'INFO_FORMAT': 'text/xml'}
  );
  const url2012 = wms2012.getFeatureInfoUrl(
    coordinate,
    viewResolution,
    'EPSG:3857',
    {'INFO_FORMAT': 'text/xml'}
  );
  const url2018 = wms2018.getFeatureInfoUrl(
    coordinate,
    viewResolution,
    'EPSG:3857',
    {'INFO_FORMAT': 'text/xml'}
  );

  Promise.all([
  fetch(url2000).then(resp => resp.text()),
  fetch(url2006).then(resp => resp.text()),
  fetch(url2012).then(resp => resp.text()),
  fetch(url2018).then(resp => resp.text())
]).then((xml) => {
        const xml2000 = parseXml(xml[0]);
        const label2000 = xml2000.getElementsByTagName("FIELDS")[0].getAttribute("LABEL3");
        // var code2000 = xml2000.getElementsByTagName("FIELDS")[0].getAttribute("CODE_00");

        const xml2006 = parseXml(xml[1]);
        const label2006 = xml2006.getElementsByTagName("FIELDS")[0].getAttribute("LABEL3");
        // var code2006 = xml2006.getElementsByTagName("FIELDS")[0].getAttribute("CODE_06");

        const xml2012 = parseXml(xml[2]);
        const label2012 = xml2012.getElementsByTagName("FIELDS")[0].getAttribute("LABEL3");
        // var code2012 = xml2012.getElementsByTagName("FIELDS")[0].getAttribute("CODE_12");

        const xml2018 = parseXml(xml[3]);
        const label2018 = xml2018.getElementsByTagName("FIELDS")[0].getAttribute("LABEL3");
        // var code2018 = xml2018.getElementsByTagName("FIELDS")[0].getAttribute("CODE_18");

        const hdms = toStringHDMS(toLonLat(coordinate));

        content.innerHTML = '<code>' + hdms + '</code><br><br>' +
        '<code><b>2000: </b>' + label2000 +'</code><br><code><b>2006: </b>' + label2006 + '</code><br>' +
        '<code><b>2012: </b>' + label2012 +'</code><br><code><b>2018: </b>' + label2018 + '</code>'
        overlay.setPosition(coordinate);
      });
});

map.on('pointermove', function (evt) {
  if (evt.dragging) {
    return;
  }
  const pixel = map.getEventPixel(evt.originalEvent);
  const hit = map.forEachLayerAtPixel(pixel, function () {
    return true;
  });
  map.getTargetElement().style.cursor = hit ? 'pointer' : '';
});

// execute the displayFeatureInfo  method //

// var displayFeatureInfo  = function(pixel, coordinate) {
//   var features = [];
//
//   map.forEachFeatureAtPixel(pixel, function(feature) {
//      features.push(feature);
//    }, {
//      layerFilter: function (layer) {
//        return layer.get('title').includes('vector');
//      }
//    }
//  )
//  console.log(features);
//  if (features.length == 4) {
//    content.innerHTML =
//    '<p></p><code>2000 CLC Code: ' + features[3].get('code_00') + '</code>' +
//    '<p></p><code>2006 CLC Code: ' + features[2].get('code_06') + '</code>' +
//    '<p></p><code>2012 CLC Code: ' + features[1].get('code_12') + '</code>' +
//    '<p></p><code>2018 CLC Code: ' + features[0].get('code_18') + '</code>';
//    overlay.setPosition(coordinate);
//
//  } else {
//    content.innerHTML = '<p>'+ 'Loading timeline...<br>'+features.length + '/4 years loaded<br>Please wait a few seconds and click here again' + '</p>';
//    overlay.setPosition(coordinate);
//  }
// }
//
//
// map.on('click', function(event) {
//   var coordinate = event.coordinate
//   var resolutionForZoom = map.getView().getResolutionForZoom(map.getView().getZoom());
//   var minx = coordinate[0] - 150;
//   var maxx = coordinate[0] + 150;
//   var miny = coordinate[1] - 150;
//   var maxy = coordinate[1] + 150;
//
//   console.log(minx);
//
//   vSource2000.setUrl(
//         'https://clc-timeseries.gaf.de/wfs?service=wfs&version=1.1.0&' +
//         '&REQUEST=GetFeature&TYPENAME=timeseries:U2006_CLC2000_V2020_20u1&' +
//         'outputFormat=application/json&srsname=EPSG:3857&' +
//         'bbox=' + minx + ',' + miny + ',' + maxx + ',' + maxy + ',EPSG:3857');
//   vSource2006.setUrl(
//         'https://clc-timeseries.gaf.de/wfs?service=wfs&version=1.1.0&' +
//         '&REQUEST=GetFeature&TYPENAME=timeseries:U2012_CLC2006_V2020_20u1U2012_CLC2006_V2020_20u1&' +
//         'outputFormat=application/json&srsname=EPSG:3857&' +
//         'bbox=' + minx + ',' + miny + ',' + maxx + ',' + maxy + ',EPSG:3857');
//   vSource2012.setUrl(
//         'https://clc-timeseries.gaf.de/wfs?service=wfs&version=1.1.0&' +
//         '&REQUEST=GetFeature&TYPENAME=timeseries:U2018_CLC2012_V2020_20u1U2018_CLC2012_V2020_20u1&' +
//         'outputFormat=application/json&srsname=EPSG:3857&' +
//         'bbox=' + minx + ',' + miny + ',' + maxx + ',' + maxy + ',EPSG:3857');
//   vSource2018.setUrl(
//         'https://clc-timeseries.gaf.de/wfs?service=wfs&version=1.1.0&' +
//         '&REQUEST=GetFeature&TYPENAME=timeseries:U2018_CLC2018_V2020_20u1U2018_CLC2018_V2020_20u1&' +
//         'outputFormat=application/json&srsname=EPSG:3857&' +
//         'bbox=' + minx + ',' + miny + ',' + maxx + ',' + maxy +',EPSG:3857');
//   for (var i = 0; i < 4; i++) {
//       vectorLayers[i].setVisible(true);
//     }
//   displayFeatureInfo(event.pixel, coordinate)
// })


$(".range input").on('input change', function(){
  var opacity, n = $(this).val();
  for (var i=0; i<(layers.length); i++){
    opacity = ((i+1)==n ? 1 : 0);
    if ((layers[i].getOpacity() != opacity) && (tileLayers[i].getOpacity() != opacity)) {
      layers[i].setOpacity(opacity);
      tileLayers[i].setOpacity(opacity);
    }
  }
}).change();


var coll = document.getElementsByClassName("action");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}

var sheet = document.createElement('style'),
  $rangeInput = $('.range input'),
  prefs = ['webkit-slider-runnable-track', 'moz-range-track', 'ms-track'];

document.body.appendChild(sheet);

var getTrackStyle = function (el) {
  var curVal = el.value,
      val = (curVal - 1) * 33.333333334,
      style = '';

  // Set active label
  $('.range-labels li').removeClass('active selected');

  var curLabel = $('.range-labels').find('li:nth-child(' + curVal + ')');

  curLabel.addClass('active selected');
  curLabel.prevAll().addClass('selected');

  // Change background gradient
  for (var i = 0; i < prefs.length; i++) {
    style += '.range {background: linear-gradient(to right, #a13dea 0%, #a13dea ' + (val - 2) + '%, #ffffff00 ' + (val - 2) + '%, #ffffff00 100%)}';
    style += '.range input::-' + prefs[i] + '{background: linear-gradient(to right, #a13dea 0%, #a13dea ' + (val - 2) + '%, #5e5e5e ' + (val -2) + '%, #5e5e5e 100%)}';
  }

  return style;
};

$rangeInput.on('input', function () {
  sheet.textContent = getTrackStyle(this);
});

// Change input value on label click
$('.range-labels li').on('click', function () {
  var index = $(this).index();

  $rangeInput.val(index + 1).trigger('input');

});


// a normal select interaction to handle click
const select = new Select();
map.addInteraction(select);

const selectedFeatures = select.getFeatures();

// a DragBox interaction used to select features by drawing boxes
const dragBox = new DragBox({
  condition: platformModifierKeyOnly,
});

map.addInteraction(dragBox);

// let viewProjection = "EPSG:3857";
//
// map.on("click", function(evt) {
//
//     let clickedCoordinate = evt.coordinate;
//     var resolutionForZoom = map.getView().getResolutionForZoom(map.getView().getZoom());
//
//     var minx = evt.coordinate[0] - 0.5 * resolutionForZoom;
//     var maxx = evt.coordinate[0] + 0.5 * resolutionForZoom;
//     var miny = evt.coordinate[1] - 0.5 * resolutionForZoom;
//     var maxy = evt.coordinate[1] + 0.5 * resolutionForZoom;
//

// );

var extentSource = new VectorSource({});
var extentStyle = new Style({
    stroke: new Stroke({
        color: 'white',
        width: 1.5
    }),
    fill: new Fill({
        color: 'rgba(255, 255, 255, 0.5)'
    })
});
var extentLayer = new VectorLayer({
    projection: 'EPSG:3857',
    source: extentSource,
});
map.addLayer(extentLayer);

dragBox.on('boxend', function () {
  // features that intersect the box geometry are added to the
  // collection of selected features

  // if the view is not obliquely rotated the box geometry and
  // its extent are equalivalent so intersecting features can
  // be added directly to the collection
  const extent = dragBox.getGeometry().getExtent();
  const polygon = fromExtent(extent);
  var feature = new Feature(polygon);
  extentSource.addFeature(feature);
  feature.setStyle(extentStyle);
  const minx = extent[0];
  const miny = extent[1];
  const maxx = extent[2];
  const maxy = extent[3];

  const params = {
      service: "WFS",
      version: "1.1.0",
      request: "GetFeature",
      typename: "timeseries:U2006_CLC2000_V2020_20u1,timeseries:U2012_CLC2006_V2020_20u1U2012_CLC2006_V2020_20u1," +
      "timeseries:U2018_CLC2012_V2020_20u1U2018_CLC2012_V2020_20u1,timeseries:U2018_CLC2018_V2020_20u1U2018_CLC2018_V2020_20u1",
      srsname: "EPSG:3857",
      outputFormat: "application/json",
      //CQL_FILTER: CAN THIS BE USED???
      bbox: minx + ',' + miny + ',' + maxx + ',' + maxy + ",EPSG:3857"
  };

  $.ajax('https://thawing-waters-16552.herokuapp.com/https://clc-timeseries.gaf.de/wfs?', {
      type: "GET",
      data: params,
      dataType: "json",
      contentType: "application/json"
  }).then(data => {
       console.log(data);
       // overlay.setPosition(clickedCoordinate);
  }).fail((jqXHR, textStatus, errorThrown) => {
      // FAIL
  });



  // var vSource2000 = new VectorSource({
  //   format: new GeoJSON(),
  //   url: function (extent) {
  //     return (
  //       'https://clc-timeseries.gaf.de/wfs?service=wfs&version=1.1.0&' +
  //       '&REQUEST=GetFeature&TYPENAME=timeseries:U2006_CLC2000_V2020_20u1&' +
  //       'outputFormat=application/json&srsname=EPSG:3857&' +
  //       'bbox=' + minx + ',' + miny + ',' + maxx + ',' + maxy + ',EPSG:3857');
  //   },
  //   strategy: bboxStrategy,
  // });
  //
  // var testV =
  //   new VectorLayer({
  //     visible: true,
  //     opacity: 1,
  //     title: 'vector2000',
  //     source: vSource2000,
  //   });

  // vSource2000.setUrl(
  //       'https://clc-timeseries.gaf.de/wfs?service=wfs&version=1.1.0&' +
  //       '&REQUEST=GetFeature&TYPENAME=timeseries:U2006_CLC2000_V2020_20u1&' +
  //       'outputFormat=application/json&srsname=EPSG:3857&' +
  //       'bbox=' + minx + ',' + miny + ',' + maxx + ',' + maxy + ',EPSG:3857');
  // vSource2006.setUrl(
  //       'https://clc-timeseries.gaf.de/wfs?service=wfs&version=1.1.0&' +
  //       '&REQUEST=GetFeature&TYPENAME=timeseries:U2012_CLC2006_V2020_20u1U2012_CLC2006_V2020_20u1&' +
  //       'outputFormat=application/json&srsname=EPSG:3857&' +
  //       'bbox=' + minx + ',' + miny + ',' + maxx + ',' + maxy + ',EPSG:3857');
  // vSource2012.setUrl(
  //       'https://clc-timeseries.gaf.de/wfs?service=wfs&version=1.1.0&' +
  //       '&REQUEST=GetFeature&TYPENAME=timeseries:U2018_CLC2012_V2020_20u1U2018_CLC2012_V2020_20u1&' +
  //       'outputFormat=application/json&srsname=EPSG:3857&' +
  //       'bbox=' + minx + ',' + miny + ',' + maxx + ',' + maxy + ',EPSG:3857');
  // vSource2018.setUrl(
  //       'https://clc-timeseries.gaf.de/wfs?service=wfs&version=1.1.0&' +
  //       '&REQUEST=GetFeature&TYPENAME=timeseries:U2018_CLC2018_V2020_20u1U2018_CLC2018_V2020_20u1&' +
  //       'outputFormat=application/json&srsname=EPSG:3857&' +
  //       'bbox=' + minx + ',' + miny + ',' + maxx + ',' + maxy +',EPSG:3857');
  // for (var i = 0; i < 4; i++) {
  //     vectorLayers[i].setVisible(true);
  //   }
  // map.addLayer(testV);

  // const rotation = map.getView().getRotation();
  // const oblique = rotation % (Math.PI / 2) !== 0;
  // const candidateFeatures = oblique ? [] : selectedFeatures;

  // vSource2000.forEachFeatureIntersectingExtent(extent, function (feature) {
  //   candidateFeatures.push(feature);
  // });
  // when the view is obliquely rotated the box extent will
  // exceed its geometry so both the box and the candidate
  // feature geometries are rotated around a common anchor
  // to confirm that, with the box geometry aligned with its
  // extent, the geometries intersect
  // if (oblique) {
  //   const anchor = [0, 0];
  //   const geometry = dragBox.getGeometry().clone();
  //   geometry.rotate(-rotation, anchor);
  //   const extent = geometry.getExtent();
  //   candidateFeatures.forEach(function (feature) {
  //     const geometry = feature.getGeometry().clone();
  //     geometry.rotate(-rotation, anchor);
  //     if (geometry.intersectsExtent(extent)) {
  //       selectedFeatures.push(feature);
  //     }
  //   });
  // }
  // map.removeLayer(testV);
});

// clear selection when drawing a new box and when clicking on the map
dragBox.on('boxstart', function () {
  selectedFeatures.clear();
});
