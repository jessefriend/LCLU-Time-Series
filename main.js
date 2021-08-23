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
import {FullScreen, defaults as defaultControls} from 'ol/control';
import {getArea} from 'ol/sphere';
import LayerSwitcher from 'ol-layerswitcher';


/**
 * HTML Elements to access.
 */
const container = document.getElementById('popup');
const content = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');
const stats2000 = document.getElementById('content2000');


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
    title: "World Shaded Relief",
    type: 'base',
    source: new XYZ({
        url:
          'https://server.arcgisonline.com/ArcGIS/rest/services/' +
          'World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}',
      }),
  });

var baseLayer2 =
  new TileLayer({
    title: "World Terrain",
    type: 'base',
    source: new XYZ({
        url:
          'https://server.arcgisonline.com/arcgis/rest/services/' +
          'World_Terrain_Base/MapServer/tile/{z}/{y}/{x}',
      }),
  });

var baseLayer3 =
  new TileLayer({
    title: "World Imagery",
    type: 'base',
    source: new XYZ({
        url:
          'https://server.arcgisonline.com/arcgis/rest/services/' +
          'World_Imagery/MapServer/tile/{z}/{y}/{x}',
      }),
  });

var wms2000 =
  new TileWMS({
    params: {'LAYERS': 'Corine_Land_Cover_2000_raster11306', 'TILED':true},
    projection: 'EPSG:3857',
    crossOrigin: 'anonymous',
    serverType: 'mapserver',
    url: 'https://image.discomap.eea.europa.eu/arcgis/services/Corine/CLC2000_WM/MapServer/WmsServer',
  });

var wms2006 =
  new TileWMS({
    params: {'LAYERS': 'Corine_Land_Cover_2006_raster43084', 'TILED':true},
    projection: 'EPSG:3857',
    crossOrigin: 'anonymous',
    serverType: 'mapserver',
    url: 'https://image.discomap.eea.europa.eu/arcgis/services/Corine/CLC2006_WM/MapServer/WmsServer',
  });

var wms2012 =
  new TileWMS({
    params: {'LAYERS': 'Corine_Land_Cover_2012_raster59601', 'TILED':true},
    projection: 'EPSG:3857',
    crossOrigin: 'anonymous',
    serverType: 'mapserver',
    url: 'https://image.discomap.eea.europa.eu/arcgis/services/Corine/CLC2012_WM/MapServer/WmsServer',
  });

var wms2018 =
  new TileWMS({
    params: {'LAYERS': '12', 'TILED':true},
    projection: 'EPSG:3857',
    crossOrigin: 'anonymous',
    serverType: 'mapserver',
    url: 'https://image.discomap.eea.europa.eu/arcgis/services/Corine/CLC2018_WM/MapServer/WmsServer',
  });

var layers2000 = [
  new TileLayer({
    source: wms2000,
    maxZoom: 10,
  }),
  new TileLayer({
    minZoom: 10,
    source: new TileArcGISRest({
      params: {'TILED':true},
      projection: 'EPSG:3857',
      url: 'https://image.discomap.eea.europa.eu/arcgis/rest/services/Corine/CLC2000_WM/MapServer',
    }),
  })
];

var layers2006 = [
  new TileLayer({
    source: wms2006,
    maxZoom: 10,
  }),
  new TileLayer({
    minZoom: 10,
    source: new TileArcGISRest({
      params: {'TILED':true},
      projection: 'EPSG:3857',
      url: 'https://image.discomap.eea.europa.eu/arcgis/rest/services/Corine/CLC2006_WM/MapServer',
    }),
  })
];

var layers2012 = [
  new TileLayer({
    source: wms2012,
    maxZoom: 10,
  }),
  new TileLayer({
    minZoom: 10,
    source: new TileArcGISRest({
      params: {'TILED':true},
      projection: 'EPSG:3857',
      url: 'https://image.discomap.eea.europa.eu/arcgis/rest/services/Corine/CLC2012_WM/MapServer',
    }),
  })
];

var layers2018 = [
  new TileLayer({
    source: wms2018,
    maxZoom: 10,
  }),
  new TileLayer({
    minZoom: 10,
    source: new TileArcGISRest({
      params: {'TILED':true},
      projection: 'EPSG:3857',
      url: 'https://image.discomap.eea.europa.eu/arcgis/rest/services/Corine/CLC2018_WM/MapServer',
    }),
  })
];

var layers = [
  layers2000,
  layers2006,
  layers2012,
  layers2018
]

var transportationLayer =
  new TileLayer({
    title: 'Transportation Layer',
    source: new XYZ({
        url:
          'https://server.arcgisonline.com/ArcGIS/rest/services/' +
          'Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}',
      }),
  });

var labelLayer =
  new TileLayer({
    title: 'Boundaries & Labels',
    source: new XYZ({
        url:
          'https://server.arcgisonline.com/ArcGIS/rest/services/' +
          'Reference/World_Boundaries_and_Places_Alternate/MapServer/tile/{z}/{y}/{x}',
      }),
  });

var view = new View({
  center: [1069099, 7200000],
  zoom: 3.8,
  constrainRotation: 16,
  projection: 'EPSG:3857',
});

var map = new Map({
  layers: [baseLayer3, baseLayer2, baseLayer],
  target: 'map',
  overlays: [overlay],
  view: view,
});

for (var i = 0; i < 4; i++) {
  map.addLayer(layers[i][0]);
  map.addLayer(layers[i][1]);
}

map.addLayer(transportationLayer);
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

$(".range input").on('input change', function(){
  var opacity, n = $(this).val();
  for (var i=0; i<(4); i++){
    opacity = ((i+1)==n ? 1 : 0);
    if ((layers[i][0].getOpacity() != opacity) && (layers[i][1].getOpacity() != opacity)) {
      layers[i][0].setOpacity(opacity);
      layers[i][1].setOpacity(opacity);
    }
  }
}).change();

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
    style += '.range {background: linear-gradient(to right, #0074d9 0%, #0074d9 ' + (val - 2) + '%, #ffffff00 ' + (val - 2) + '%, #ffffff00 100%)}';
    style += '.range input::-' + prefs[i] + '{background: linear-gradient(to right, #0074d9 0%, #0074d9 ' + (val - 2) + '%, #5e5e5e ' + (val -2) + '%, #5e5e5e 100%)}';
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

// a DragBox interaction used to select features by drawing boxes
const dragBox = new DragBox({
  condition: platformModifierKeyOnly,
});

map.addInteraction(dragBox);

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

  const extent = dragBox.getGeometry().getExtent();
  const polygon = fromExtent(extent);
  // var area = getArea(polygon, { projection: map.getView().getProjection() });
  // // var areaFormat = Math.round(area * 100) / 100;
  // var haArea = area / 10000;
  // console.log(haArea);

  var feature = new Feature(polygon);

  extentSource.addFeature(feature);
  feature.setStyle(extentStyle);

  stats2000.innerHTML = '';
  $("#loader2000").toggle();
  $("#loader2006").toggle();
  $("#loader2012").toggle();
  $("#loader2018").toggle();

  const minx = extent[0];
  const miny = extent[1];
  const maxx = extent[2];
  const maxy = extent[3];

  // var minCoords = toLonLat([minx, miny]);
  // var maxCoords = toLonLat([maxx, maxy]);


  const params = {
      service: "WFS",
      version: "1.1.0",
      request: "GetFeature",
      typename: "timeseries:U2006_CLC2000_V2020_20u1,timeseries:U2012_CLC2006_V2020_20u1U2012_CLC2006_V2020_20u1," +
      "timeseries:U2018_CLC2012_V2020_20u1U2018_CLC2012_V2020_20u1,timeseries:U2018_CLC2018_V2020_20u1U2018_CLC2018_V2020_20u1",
      srsName: "EPSG:3857",
      // geometryName: "geom",
      outputFormat: "text/xml; subtype=gml/3.2",
      // cql_filter: "INTERSECTS(the_geom," + minCoords[0] + "," + minCoords[1] + "," + maxCoords[0] + "," + maxCoords[1] + ")",
      bbox: minx + ',' + miny + ',' + maxx + ',' + maxy + ",EPSG:3857"
  };

// console.log(params);

  $.ajax('https://thawing-waters-16552.herokuapp.com/https://clc-timeseries.gaf.de/wfs?', {
      type: "GET",
      data: params,
      dataType: "xml",
      contentType: "text/xml; subtype=gml/3.2"
  }).then(data => {
      // console.log(data);
      var data2000 = data.getElementsByTagName('timeseries:U2006_CLC2000_V2020_20u1');
      var result2000 = {};
      var area2000 = 0;
      for (let i = 0; i < data2000.length; i++) {
        var clcCode = data2000[i].childNodes[2].textContent;
        var featureArea = parseFloat(data2000[i].childNodes[3].textContent);
        area2000 = area2000 + featureArea;

        if (clcCode in result2000) {
          result2000[clcCode] = result2000[clcCode] + featureArea;
        } else {
          result2000[clcCode] = featureArea;
          // result2000[clcCode] = result2000[clcCode] + featureArea;
        };
      }
      for (var key in result2000) {
          result2000[key] = ((result2000[key]/area2000)*100).toFixed(2);
      }
      console.log(result2000);
      let txt = "";
      for (let x in result2000) {
        txt += "<b>" + x + "</b>: " + result2000[x] + "%<br>";
      };

      $("#loader2000").toggle();
      $("#loader2006").toggle();
      $("#loader2012").toggle();
      $("#loader2018").toggle();
      stats2000.innerHTML = txt;
      // console.log(data.getElementsByTagName('timeseries:U2006_CLC2000_V2020_20u1')[0].childNodes[2].textContent);
      // console.log(parseFloat(data.getElementsByTagName('timeseries:U2006_CLC2000_V2020_20u1')[0].childNodes[3].textContent));
     // console.log(data.getElementsByTagName('timeseries:code_00')[0].childNodes[0].nodeValue);
     // var values2000 = data.getElementsByTagName('timeseries:U2006_CLC2000_V2020_20u1');
     // var values2006 = data.getElementsByTagName('timeseries:U2012_CLC2006_V2020_20u1U2012_CLC2006_V2020_20u1');
     // var values2012 = data.getElementsByTagName('timeseries:U2018_CLC2012_V2020_20u1U2018_CLC2012_V2020_20u1');
     // var values2018 = data.getElementsByTagName('timeseries:U2018_CLC2018_V2020_20u1U2018_CLC2018_V2020_20u1');
     // console.log(values2018);
  }).fail((jqXHR, textStatus, errorThrown) => {
      // FAIL
  });
});

// clear selection when drawing a new box and when clicking on the map
dragBox.on('boxstart', function () {
  extentSource.clear()
});

var fullscreenControl = new FullScreen({
  source: document.getElementById('map').parentNode
});

map.addControl(fullscreenControl);

// Get out-of-the-map div element with the ID "layers" and renders layers to it.
// NOTE: If the layers are changed outside of the layer switcher then you
// will need to call ol.control.LayerSwitcher.renderPanel again to refesh
// the layer tree. Style the tree via CSS.
var sidebar = new ol.control.Sidebar({
  element: 'sidebar',
  position: 'left'
});
var toc = document.getElementById('layers');
ol.control.LayerSwitcher.renderPanel(map, toc,
  {
  reverse: true,
  groupSelectStyle: 'group'
});
map.addControl(sidebar);


//
// function openYear(evt, clcYear) {
//   // Declare all variables
//   var i, tabcontent, tablinks;
//
//   // Get all elements with class="tabcontent" and hide them
//   tabcontent = document.getElementsByClassName("tabcontent");
//   for (i = 0; i < tabcontent.length; i++) {
//     tabcontent[i].style.display = "none";
//   }
//
//   // Get all elements with class="tablinks" and remove the class "active"
//   tablinks = document.getElementsByClassName("tablinks");
//   for (i = 0; i < tablinks.length; i++) {
//     tablinks[i].className = tablinks[i].className.replace(" active", "");
//   }
//
//   // Show the current tab, and add an "active" class to the button that opened the tab
//   document.getElementById(clcYear).style.display = "block";
//   evt.currentTarget.className += " active";
// }
