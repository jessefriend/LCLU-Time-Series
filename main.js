import 'ol/ol.css';
import 'ol-layerswitcher/dist/ol-layerswitcher.css';

import Map from 'ol/Map';
import View from 'ol/View';
import Feature from 'ol/Feature';
import {
  TileArcGISRest,
  TileWMS,
  ImageArcGISRest,
  XYZ,
  OSM,
  Vector as VectorSource,
  Image
} from 'ol/source';
import Stamen from 'ol/source/Stamen';
import {
  Image as ImageLayer,
  Tile as TileLayer,
  Vector as VectorLayer
} from 'ol/layer';
import {
  Fill,
  Stroke,
  Style,
  Text
} from 'ol/style';
import GeoJSON from 'ol/format/GeoJSON';
import LayerGroup from 'ol/layer/Group';
import {
  bbox as bboxStrategy
} from 'ol/loadingstrategy';
import Overlay from 'ol/Overlay';
import {
  toLonLat
} from 'ol/proj';
import {
  toStringHDMS
} from 'ol/coordinate';
import {
  DragBox,
  Select,
  defaults as defaultInteractions,
} from 'ol/interaction';
import {
  shiftKeyOnly
} from 'ol/events/condition';
import {
  fromExtent
} from 'ol/geom/Polygon';
import {
  FullScreen,
  defaults as defaultControls
} from 'ol/control';
import {
  getArea
} from 'ol/sphere';
import LayerSwitcher from 'ol-layerswitcher';
import Chart from 'chart.js/auto';

/**
 * HTML Elements to access.
 */
const container = document.getElementById('popup');
const content = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');

const featureDeleter = document.getElementById('feature');
const deleteButton = document.getElementById('feature-deleter');



// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();
document.getElementById("defaultOpen00").click();
document.getElementById("defaultOpen06").click();
document.getElementById("defaultOpen12").click();
document.getElementById("defaultOpen18").click();


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
closer.onclick = function() {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};

overlay.setPosition([1202421.87941632581, 6156688.215256455]);

const xButton = new Overlay({
  element: featureDeleter,
  position: undefined,
});


deleteButton.onclick = function() {
  extentSource.clear()
  xButton.setPosition(undefined);
  deleteButton.blur();
  return false;
};

var baseLayer =
  new TileLayer({
    title: "World Shaded Relief",
    type: 'base',
    source: new XYZ({
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/' +
        'World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}',
    }),
  });

var baseLayer2 =
  new TileLayer({
    title: "World Terrain",
    type: 'base',
    source: new XYZ({
      url: 'https://server.arcgisonline.com/arcgis/rest/services/' +
        'World_Terrain_Base/MapServer/tile/{z}/{y}/{x}',
    }),
  });

var baseLayer3 =
  new TileLayer({
    title: "World Imagery",
    type: 'base',
    source: new XYZ({
      url: 'https://server.arcgisonline.com/arcgis/rest/services/' +
        'World_Imagery/MapServer/tile/{z}/{y}/{x}',
    }),
  });

var wms2000 =
  new TileWMS({
    params: {
      'LAYERS': 'Corine_Land_Cover_2000_raster11306',
      'TILED': true
    },
    projection: 'EPSG:3857',
    crossOrigin: 'anonymous',
    serverType: 'mapserver',
    url: 'https://image.discomap.eea.europa.eu/arcgis/services/Corine/CLC2000_WM/MapServer/WmsServer',
  });

var wms2006 =
  new TileWMS({
    params: {
      'LAYERS': 'Corine_Land_Cover_2006_raster43084',
      'TILED': true
    },
    projection: 'EPSG:3857',
    crossOrigin: 'anonymous',
    serverType: 'mapserver',
    url: 'https://image.discomap.eea.europa.eu/arcgis/services/Corine/CLC2006_WM/MapServer/WmsServer',
  });

var wms2012 =
  new TileWMS({
    params: {
      'LAYERS': 'Corine_Land_Cover_2012_raster59601',
      'TILED': true
    },
    projection: 'EPSG:3857',
    crossOrigin: 'anonymous',
    serverType: 'mapserver',
    url: 'https://image.discomap.eea.europa.eu/arcgis/services/Corine/CLC2012_WM/MapServer/WmsServer',
  });

var wms2018 =
  new TileWMS({
    params: {
      'LAYERS': '12',
      'TILED': true
    },
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
      params: {
        'TILED': true
      },
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
      params: {
        'TILED': true
      },
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
      params: {
        'TILED': true
      },
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
      params: {
        'TILED': true
      },
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
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/' +
        'Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}',
    }),
  });

var labelLayer =
  new TileLayer({
    title: 'Boundaries & Labels',
    source: new XYZ({
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/' +
        'Reference/World_Boundaries_and_Places_Alternate/MapServer/tile/{z}/{y}/{x}',
    }),
  });

var view = new View({
  center: [1289458.1725134826, 6130139.093652532],
  zoom: 9,
  constrainRotation: 16,
  projection: 'EPSG:3857',
});

// var view = new View({
//   center: [1069099, 7200000],
//   zoom: 3.8,
//   constrainRotation: 16,
//   projection: 'EPSG:3857',
// });


var map = new Map({
  layers: [baseLayer3, baseLayer2, baseLayer],
  target: 'map',
  overlays: [overlay, xButton],
  view: view,
});

for (var i = 0; i < 4; i++) {
  map.addLayer(layers[i][0]);
  map.addLayer(layers[i][1]);
}

map.addLayer(transportationLayer);
map.addLayer(labelLayer);


var legendText = {
  "111": {
    "CLC_CODE": 111,
    "LABEL3": "Continuous urban fabric",
    "RGB": "230,000,077"
  },
  "112": {
    "CLC_CODE": 112,
    "LABEL3": "Discontinuous urban fabric",
    "RGB": "255,000,000"
  },
  "121": {
    "CLC_CODE": 121,
    "LABEL3": "Industrial or commercial units",
    "RGB": "204,077,242"
  },
  "122": {
    "CLC_CODE": 122,
    "LABEL3": "Road and rail networks and associated land",
    "RGB": "204,000,000"
  },
  "123": {
    "CLC_CODE": 123,
    "LABEL3": "Port areas",
    "RGB": "230,204,204"
  },
  "124": {
    "CLC_CODE": 124,
    "LABEL3": "Airports",
    "RGB": "230,204,230"
  },
  "131": {
    "CLC_CODE": 131,
    "LABEL3": "Mineral extraction sites",
    "RGB": "166,000,204"
  },
  "132": {
    "CLC_CODE": 132,
    "LABEL3": "Dump sites",
    "RGB": "166,077,000"
  },
  "133": {
    "CLC_CODE": 133,
    "LABEL3": "Construction sites",
    "RGB": "255,077,255"
  },
  "141": {
    "CLC_CODE": 141,
    "LABEL3": "Green urban areas",
    "RGB": "255,166,255"
  },
  "142": {
    "CLC_CODE": 142,
    "LABEL3": "Sport and leisure facilities",
    "RGB": "255,230,255"
  },
  "211": {
    "CLC_CODE": 211,
    "LABEL3": "Non-irrigated arable land",
    "RGB": "255,255,168"
  },
  "212": {
    "CLC_CODE": 212,
    "LABEL3": "Permanently irrigated land",
    "RGB": "255,255,000"
  },
  "213": {
    "CLC_CODE": 213,
    "LABEL3": "Rice fields",
    "RGB": "230,230,000"
  },
  "221": {
    "CLC_CODE": 221,
    "LABEL3": "Vineyards",
    "RGB": "230,128,000"
  },
  "222": {
    "CLC_CODE": 222,
    "LABEL3": "Fruit trees and berry plantations",
    "RGB": "242,166,077"
  },
  "223": {
    "CLC_CODE": 223,
    "LABEL3": "Olive groves",
    "RGB": "230,166,000"
  },
  "231": {
    "CLC_CODE": 231,
    "LABEL3": "Pastures",
    "RGB": "230,230,077"
  },
  "241": {
    "CLC_CODE": 241,
    "LABEL3": "Annual crops associated with permanent crops",
    "RGB": "255,230,166"
  },
  "242": {
    "CLC_CODE": 242,
    "LABEL3": "Complex cultivation patterns",
    "RGB": "255,230,077"
  },
  "243": {
    "CLC_CODE": 243,
    "LABEL3": "Land principally occupied by agriculture, with significant areas of natural vegetation",
    "RGB": "230,204,077"
  },
  "244": {
    "CLC_CODE": 244,
    "LABEL3": "Agro-forestry areas",
    "RGB": "242,204,166"
  },
  "311": {
    "CLC_CODE": 311,
    "LABEL3": "Broad-leaved forest",
    "RGB": "128,255,000"
  },
  "312": {
    "CLC_CODE": 312,
    "LABEL3": "Coniferous forest",
    "RGB": "000,166,000"
  },
  "313": {
    "CLC_CODE": 313,
    "LABEL3": "Mixed forest",
    "RGB": "077,255,000"
  },
  "321": {
    "CLC_CODE": 321,
    "LABEL3": "Natural grasslands",
    "RGB": "204,242,077"
  },
  "322": {
    "CLC_CODE": 322,
    "LABEL3": "Moors and heathland",
    "RGB": "166,255,128"
  },
  "323": {
    "CLC_CODE": 323,
    "LABEL3": "Sclerophyllous vegetation",
    "RGB": "166,230,077"
  },
  "324": {
    "CLC_CODE": 324,
    "LABEL3": "Transitional woodland-shrub",
    "RGB": "166,242,000"
  },
  "331": {
    "CLC_CODE": 331,
    "LABEL3": "Beaches, dunes, sands",
    "RGB": "230,230,230"
  },
  "332": {
    "CLC_CODE": 332,
    "LABEL3": "Bare rocks",
    "RGB": "204,204,204"
  },
  "333": {
    "CLC_CODE": 333,
    "LABEL3": "Sparsely vegetated areas",
    "RGB": "204,255,204"
  },
  "334": {
    "CLC_CODE": 334,
    "LABEL3": "Burnt areas",
    "RGB": "000,000,000"
  },
  "335": {
    "CLC_CODE": 335,
    "LABEL3": "Glaciers and perpetual snow",
    "RGB": "166,230,204"
  },
  "411": {
    "CLC_CODE": 411,
    "LABEL3": "Inland marshes",
    "RGB": "166,166,255"
  },
  "412": {
    "CLC_CODE": 412,
    "LABEL3": "Peat bogs",
    "RGB": "077,077,255"
  },
  "421": {
    "CLC_CODE": 421,
    "LABEL3": "Salt marshes",
    "RGB": "204,204,255"
  },
  "422": {
    "CLC_CODE": 422,
    "LABEL3": "Salines",
    "RGB": "230,230,255"
  },
  "423": {
    "CLC_CODE": 423,
    "LABEL3": "Intertidal flats",
    "RGB": "166,166,230"
  },
  "511": {
    "CLC_CODE": 511,
    "LABEL3": "Water courses",
    "RGB": "000,204,242"
  },
  "512": {
    "CLC_CODE": 512,
    "LABEL3": "Water bodies",
    "RGB": "128,242,230"
  },
  "521": {
    "CLC_CODE": 521,
    "LABEL3": "Coastal lagoons",
    "RGB": "000,255,166"
  },
  "522": {
    "CLC_CODE": 522,
    "LABEL3": "Estuaries",
    "RGB": "166,255,230"
  },
  "523": {
    "CLC_CODE": 523,
    "LABEL3": "Sea and ocean",
    "RGB": "230,242,255"
  },
  "999": {
    "CLC_CODE": 999,
    "LABEL3": "NODATA",
    "RGB": ""
  },
  "990": {
    "CLC_CODE": 990,
    "LABEL3": "UNCLASSIFIED LAND SURFACE",
    "RGB": ""
  },
  "995": {
    "CLC_CODE": 995,
    "LABEL3": "UNCLASSIFIED WATER BODIES",
    "RGB": "230,242,255"
  }
};

function parseXml(xmlStr) {
  return new window.DOMParser().parseFromString(xmlStr, "text/xml");
}

map.on('singleclick', function(evt) {
  content.innerHTML = '';
  var coordinate = evt.coordinate
  const viewResolution = /** @type {number} */ (view.getResolution());
  const url2000 = wms2000.getFeatureInfoUrl(
    coordinate,
    viewResolution,
    'EPSG:3857', {
      'INFO_FORMAT': 'text/xml'
    }
  );
  const url2006 = wms2006.getFeatureInfoUrl(
    coordinate,
    viewResolution,
    'EPSG:3857', {
      'INFO_FORMAT': 'text/xml'
    }
  );
  const url2012 = wms2012.getFeatureInfoUrl(
    coordinate,
    viewResolution,
    'EPSG:3857', {
      'INFO_FORMAT': 'text/xml'
    }
  );
  const url2018 = wms2018.getFeatureInfoUrl(
    coordinate,
    viewResolution,
    'EPSG:3857', {
      'INFO_FORMAT': 'text/xml'
    }
  );

  Promise.all([
    fetch(url2000).then(resp => resp.text()),
    fetch(url2006).then(resp => resp.text()),
    fetch(url2012).then(resp => resp.text()),
    fetch(url2018).then(resp => resp.text())
  ]).then((xml) => {
    const xml2000 = parseXml(xml[0]);
    const code2000 = xml2000.getElementsByTagName("FIELDS")[0].getAttribute("CODE_00");

    const xml2006 = parseXml(xml[1]);
    const code2006 = xml2006.getElementsByTagName("FIELDS")[0].getAttribute("CODE_06");

    const xml2012 = parseXml(xml[2]);
    const code2012 = xml2012.getElementsByTagName("FIELDS")[0].getAttribute("CODE_12");

    const xml2018 = parseXml(xml[3]);
    const code2018 = xml2018.getElementsByTagName("FIELDS")[0].getAttribute("CODE_18");

    const hdms = toStringHDMS(toLonLat(coordinate));

    content.innerHTML = '<code>' + hdms + '</code><br><br>' +
      '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="40">' +
      `<rect x="3" y="3" rx="10" ry="10" width="30" height="30" fill= "rgb(${legendText[code2000].RGB})" stroke="Gainsboro" onmousemove="n(evt, '${legendText[code2000].LABEL3}');" onmouseout="c();"/>` +
      `<rect x="53" y="3" rx="10" ry="10" width="30" height="30" fill= "rgb(${legendText[code2006].RGB})" stroke="Gainsboro" onmousemove="n(evt, '${legendText[code2006].LABEL3}');" onmouseout="c();"/>` +
      `<rect x="103" y="3" rx="10" ry="10" width="30" height="30" fill= "rgb(${legendText[code2012].RGB})" stroke="Gainsboro" onmousemove="n(evt, '${legendText[code2012].LABEL3}');" onmouseout="c();"/>` +
      `<rect x="153" y="3" rx="10" ry="10" width="30" height="30" fill= "rgb(${legendText[code2018].RGB})" stroke="Gainsboro" onmousemove="n(evt, '${legendText[code2018].LABEL3}');" onmouseout="c();"/></svg>` +
      '<span style="display:inline-block;color:#424242;width:50px;font-weight:bold">2000</span><span style="display:inline-block;color:#424242;width:50px;font-weight:bold">2006</span>' +
      '<span style="display:inline-block;color:#424242;width:50px;font-weight:bold">2012</span><span style="display:inline-block;color:#424242;width:50px;font-weight:bold">2018</span>';
    overlay.setPosition(coordinate);
  });
});

map.on('pointermove', function(evt) {
  if (evt.dragging) {
    return;
  }
  const pixel = map.getEventPixel(evt.originalEvent);
  const hit = map.forEachLayerAtPixel(pixel, function() {
    return true;
  });
  map.getTargetElement().style.cursor = hit ? 'pointer' : '';
});

$(".range input").on('input change', function() {
  var opacity, n = $(this).val();
  for (var i = 0; i < (4); i++) {
    opacity = ((i + 1) == n ? 1 : 0);
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

var getTrackStyle = function(el) {
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
    style += '.range input::-' + prefs[i] + '{background: linear-gradient(to right, #0074d9 0%, #0074d9 ' + (val - 2) + '%, #5e5e5e ' + (val - 2) + '%, #5e5e5e 100%)}';
  }

  return style;
};

$rangeInput.on('input', function() {
  sheet.textContent = getTrackStyle(this);
});

// Change input value on label click
$('.range-labels li').on('click', function() {
  var index = $(this).index();

  $rangeInput.val(index + 1).trigger('input');

});

// a DragBox interaction used to select features by drawing boxes
const dragBox = new DragBox({
  condition: shiftKeyOnly,
});

map.addInteraction(dragBox);

var aoiFeature = new Feature(fromExtent([1244916.00839514, 6075956.30698472,
  1342871.3284003986, 6157032.3204354
]));

var aoiSource = new VectorSource({
  features: [aoiFeature]
});


aoiFeature.setStyle(extentStyle);


var aoiLayer = new VectorLayer({
  projection: 'EPSG:3857',
  source: aoiSource,
});

map.addLayer(aoiLayer);

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

var featureStyle = new Style({
  stroke: new Stroke({
    color: '#0074d9',
    width: 3
  }),
  fill: new Fill({
    color: 'rgba(255, 255, 255, 0.25)'
  })
});

map.addLayer(extentLayer);

dragBox.on('boxend', function() {
  // features that intersect the box geometry are added to the
  // collection of selected features

  const extent = dragBox.getGeometry().getExtent();
  const polygon = fromExtent(extent);
  const coords = polygon.getCoordinates()[0].join(' ');
  console.log(extent);
  console.log(coords);
  var area = getArea(polygon, {
    projection: map.getView().getProjection()
  });
  var output = Math.round(area * 100) / 100;
  var haArea = 1.5 * (output / 10000);
  console.log("ha_area: " + haArea);

  var feature = new Feature(polygon);

  extentSource.addFeature(feature);
  feature.setStyle(featureStyle);

  xButton.setPosition([extent[2], extent[3]]);


  $('#content2000').remove(); // this is my <canvas> element
  $('#stat2000').append('<div id="content2000"></div>');
  $('#content2006').remove(); // this is my <canvas> element
  $('#stat2006').append('<div id="content2006"></div>');
  $('#content2012').remove(); // this is my <canvas> element
  $('#stat2012').append('<div id="content2012"></div>');
  $('#content2018').remove(); // this is my <canvas> element
  $('#stat2018').append('<div id="content2018"></div>');


  $('#myChart2000').remove(); // this is my <canvas> element
  $('#pie2000').append('<canvas id="myChart2000"><canvas>');
  $('#myChart2006').remove(); // this is my <canvas> element
  $('#pie2006').append('<canvas id="myChart2006"><canvas>');
  $('#myChart2012').remove(); // this is my <canvas> element
  $('#pie2012').append('<canvas id="myChart2012"><canvas>');
  $('#myChart2018').remove(); // this is my <canvas> element
  $('#pie2018').append('<canvas id="myChart2018"><canvas>');

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
    version: "2.0.0",
    request: "GetFeature",
    typename: "timeseries:U2006_CLC2000_V2020_20u1_3857,timeseries:U2012_CLC2006_V2020_20u1U2012_CLC2006_V2020_20u1," +
      "timeseries:U2018_CLC2012_V2020_20u1U2018_CLC2012_V2020_20u1,timeseries:U2018_CLC2018_V2020_20u1U2018_CLC2018_V2020_20u1",
    srsName: "EPSG:3857",
    outputFormat: "text/xml; subtype=gml/3.2",
    bbox: minx + ',' + miny + ',' + maxx + ',' + maxy + ",EPSG:3857"
  };

  $.ajax('https://thawing-waters-16552.herokuapp.com/https://clc-timeseries.gaf.de/wfs?', {
    type: "GET",
    data: params,
    dataType: "xml",
    contentType: "text/xml; subtype=gml/3.2"
  }).then(data => {
    console.log(data);
    var data2000 = data.getElementsByTagName('timeseries:U2006_CLC2000_V2020_20u1_3857');
    var result2000 = {};
    var area2000 = 0;
    for (let i = 0; i < data2000.length; i++) {
      var clcCode = data2000[i].childNodes[2].textContent;
      var featureArea = parseFloat(data2000[i].childNodes[3].textContent);

      if (featureArea < haArea) {
        area2000 = area2000 + featureArea;
        if (clcCode in result2000) {
          result2000[clcCode] = result2000[clcCode] + featureArea;
        } else {
          result2000[clcCode] = featureArea;
        };
      }
    }

    var labels2000 = [];
    var percent2000 = [];
    var back2000 = [];
    var border2000 = [];

    console.log("Area2000:" + area2000);
    for (var key2000 in result2000) {
      var val2000 = parseFloat(((result2000[key2000] / area2000) * 100).toFixed(2));
      if (val2000 > 0) {
        result2000[key2000] = val2000;
        labels2000.push(key2000);
        percent2000.push(val2000);
        back2000.push(`rgb(${legendText[key2000].RGB},0.9)`);
        border2000.push(`rgb(${legendText[key2000].RGB},1)`);
      } else {
        delete result2000[key2000];
      }
    }

    $("#loader2000").toggle();
    var hovering = false;
    var tooltip = document.getElementById("legend-tooltip");
    var ctx2000 = $('#myChart2000');
    var myChart2000 = new Chart(ctx2000, {
      type: 'doughnut',
      data: {
        labels: labels2000,
        datasets: [{
          label: 'Percentage of land cover',
          hoverOffset: 4,
          data: percent2000,
          backgroundColor: back2000,
          borderColor: border2000,
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                var label = legendText[context.label].LABEL3 + ": " + context.formattedValue + "%";
                return label;
              }
            }
          },
          legend: {
            onHover: function(evt, legendItem, legend) {
              tooltip.innerHTML = legendText[legendItem.text].LABEL3;
              tooltip.style.display = "block";
              tooltip.style.left = evt.native.pageX + 10 + 'px';
              tooltip.style.top = evt.native.pageY + 10 + 'px';
            },
            onLeave: function() {
              tooltip.style.display = "none";
            }
          }
        }
      }
    });

    var data2006 = data.getElementsByTagName('timeseries:U2012_CLC2006_V2020_20u1U2012_CLC2006_V2020_20u1');
    var result2006 = {};
    var area2006 = 0;
    for (let i = 0; i < data2006.length; i++) {
      var clcCode = data2006[i].childNodes[2].textContent;
      var featureArea = parseFloat(data2006[i].childNodes[3].textContent);

      if (featureArea < haArea) {
        area2006 = area2006 + featureArea;
        if (clcCode in result2006) {
          result2006[clcCode] = result2006[clcCode] + featureArea;
        } else {
          result2006[clcCode] = featureArea;
        };
      }
    }

    var labels2006 = [];
    var percent2006 = [];
    var back2006 = [];
    var border2006 = [];

    for (var key2006 in result2006) {
      var val2006 = parseFloat(((result2006[key2006] / area2006) * 100).toFixed(2));
      if (val2006 > 0) {
        result2006[key2006] = val2006;
        labels2006.push(key2006);
        percent2006.push(val2006);
        back2006.push(`rgb(${legendText[key2006].RGB},0.9)`);
        border2006.push(`rgb(${legendText[key2006].RGB},1)`);
      } else {
        delete result2006[key2006];
      }
    }

    $("#loader2006").toggle();
    var ctx2006 = $('#myChart2006')
    var myChart2006 = new Chart(ctx2006, {
      type: 'doughnut',
      data: {
        labels: labels2006,
        datasets: [{
          label: 'Percentage of land cover',
          hoverOffset: 4,
          data: percent2006,
          backgroundColor: back2006,
          borderColor: border2006,
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                var label = legendText[context.label].LABEL3 + ": " + context.formattedValue + "%";
                return label;
              }
            }
          },
          legend: {
            onHover: function(evt, legendItem, legend) {
              if (hovering) {
                return;
              }
              hovering = true;
              tooltip.innerHTML = legendText[legendItem.text].LABEL3;
              tooltip.style.display = "block";
              tooltip.style.left = evt.native.pageX + 10 + 'px';
              tooltip.style.top = evt.native.pageY + 10 + 'px';
            },
            onLeave: function() {
              hovering = false;
              tooltip.style.display = "none";
            }
          }
        }
      }
    });

    var data2012 = data.getElementsByTagName('timeseries:U2018_CLC2012_V2020_20u1U2018_CLC2012_V2020_20u1');
    var result2012 = {};
    var area2012 = 0;
    for (let i = 0; i < data2012.length; i++) {
      var clcCode = data2012[i].childNodes[2].textContent;
      var featureArea = parseFloat(data2012[i].childNodes[3].textContent);

      if (featureArea < haArea) {
        area2012 = area2012 + featureArea;
        if (clcCode in result2012) {
          result2012[clcCode] = result2012[clcCode] + featureArea;
        } else {
          result2012[clcCode] = featureArea;
        };
      }
    }

    var labels2012 = [];
    var percent2012 = [];
    var back2012 = [];
    var border2012 = [];

    for (var key2012 in result2012) {
      var val2012 = parseFloat(((result2012[key2012] / area2012) * 100).toFixed(2));
      if (val2012 > 0) {
        result2012[key2012] = val2012;
        labels2012.push(key2012);
        percent2012.push(val2012);
        back2012.push(`rgb(${legendText[key2012].RGB},0.9)`);
        border2012.push(`rgb(${legendText[key2012].RGB},1)`);
      } else {
        delete result2012[key2012];
      }
    }

    $("#loader2012").toggle();
    var ctx2012 = $('#myChart2012')
    var myChart2012 = new Chart(ctx2012, {
      type: 'doughnut',
      data: {
        labels: labels2012,
        datasets: [{
          label: 'Percentage of land cover',
          hoverOffset: 4,
          data: percent2012,
          backgroundColor: back2012,
          borderColor: border2012,
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                var label = legendText[context.label].LABEL3 + ": " + context.formattedValue + "%";
                return label;
              }
            }
          },
          legend: {
            onHover: function(evt, legendItem, legend) {
              if (hovering) {
                return;
              }
              hovering = true;
              tooltip.innerHTML = legendText[legendItem.text].LABEL3;
              tooltip.style.display = "block";
              tooltip.style.left = evt.native.pageX + 10 + 'px';
              tooltip.style.top = evt.native.pageY + 10 + 'px';
            },
            onLeave: function() {
              hovering = false;
              tooltip.style.display = "none";
            }
          }
        }
      }
    });

    var data2018 = data.getElementsByTagName('timeseries:U2018_CLC2018_V2020_20u1U2018_CLC2018_V2020_20u1');
    var result2018 = {};
    var area2018 = 0;
    for (let i = 0; i < data2018.length; i++) {
      var clcCode = data2018[i].childNodes[2].textContent;
      var featureArea = parseFloat(data2018[i].childNodes[3].textContent);

      if (featureArea < haArea) {
        area2018 = area2018 + featureArea;
        if (clcCode in result2018) {
          result2018[clcCode] = result2018[clcCode] + featureArea;
        } else {
          result2018[clcCode] = featureArea;
        };
      }
    }

    var labels2018 = [];
    var percent2018 = [];
    var back2018 = [];
    var border2018 = [];

    for (var key2018 in result2018) {
      var val2018 = parseFloat(((result2018[key2018] / area2018) * 100).toFixed(2));
      if (val2018 > 0) {
        result2018[key2018] = val2018;
        labels2018.push(key2018);
        percent2018.push(val2018);
        back2018.push(`rgb(${legendText[key2018].RGB},0.9)`);
        border2018.push(`rgb(${legendText[key2018].RGB},1)`);
      } else {
        delete result2018[key2018];
      }
    }

    $("#loader2018").toggle();
    var ctx2018 = $('#myChart2018')
    var myChart2018 = new Chart(ctx2018, {
      type: 'doughnut',
      data: {
        labels: labels2018,
        datasets: [{
          label: 'Percentage of land cover',
          hoverOffset: 4,
          data: percent2018,
          backgroundColor: back2018,
          borderColor: border2018,
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                var label = legendText[context.label].LABEL3 + ": " + context.formattedValue + "%";
                return label;
              }
            }
          },
          legend: {
            onHover: function(evt, legendItem, legend) {
              if (hovering) {
                return;
              }
              hovering = true;
              tooltip.innerHTML = legendText[legendItem.text].LABEL3;
              tooltip.style.display = "block";
              tooltip.style.left = evt.native.pageX + 10 + 'px';
              tooltip.style.top = evt.native.pageY + 10 + 'px';
            },
            onLeave: function() {
              hovering = false;
              tooltip.style.display = "none";
            }
          }
        }
      }
    });

    // let txt2000 = "";
    // console.log(result2000);
    // for (let x in result2000) {
    //   txt2000 += "<b>" + legendText[x].LABEL3 + "</b>: " + result2000[x] + "%<br>";
    // };
    //
    // let txt2006 = "";
    // for (let x in result2006) {
    //   txt2006 += "<b>" + legendText[x].LABEL3 + "</b>: " + result2006[x] + "%<br>";
    // };
    //
    // let txt2012 = "";
    // for (let x in result2012) {
    //   txt2012 += "<b>" + legendText[x].LABEL3 + "</b>: " + result2012[x] + "%<br>";
    // };
    //
    // let txt2018 = "";
    // for (let x in result2018) {
    //   txt2018 += "<b>" + legendText[x].LABEL3 + "</b>: " + result2018[x] + "%<br>";
    // };

    new gridjs.Grid({
      search: true,
      columns: [{
        name: "CLC",
        width: '40%'
      }, {
        name: "Class",
        width: '40%',
      }, {
        name: '%',
        width: '20%',
        sort: {
          compare: (a, b) => {
            const code = (x) => x.split('%')[0];
            console.log(typeof code(a));
            if (parseFloat(code(a)) > parseFloat(code(b))) {
              return 1;
            } else if (parseFloat(code(b)) > parseFloat(code(a))) {
              return -1;
            } else {
              return 0;
            }
          }
        }
      }],
      sort: true,
      autoWidth: 0,
      data: Object.keys(result2000).map((key) => [Number(key), legendText[key].LABEL3, result2000[key] + "%"])
    }).render(document.getElementById("content2000"));

    new gridjs.Grid({
      search: true,
      columns: [{
        name: "CLC",
        width: '40%'
      }, {
        name: "Class",
        width: '40%',
      }, {
        name: '%',
        width: '20%',
        sort: {
          compare: (a, b) => {
            const code = (x) => x.split('%')[0];
            console.log(typeof code(a));
            if (parseFloat(code(a)) > parseFloat(code(b))) {
              return 1;
            } else if (parseFloat(code(b)) > parseFloat(code(a))) {
              return -1;
            } else {
              return 0;
            }
          }
        }
      }],
      sort: true,
      autoWidth: 0,
      data: Object.keys(result2006).map((key) => [Number(key), legendText[key].LABEL3, result2006[key] + "%"])
    }).render(document.getElementById("content2006"));

    new gridjs.Grid({
      search: true,
      columns: [{
        name: "CLC",
        width: '40%'
      }, {
        name: "Class",
        width: '40%',
      }, {
        name: '%',
        width: '20%',
        sort: {
          compare: (a, b) => {
            const code = (x) => x.split('%')[0];
            console.log(typeof code(a));
            if (parseFloat(code(a)) > parseFloat(code(b))) {
              return 1;
            } else if (parseFloat(code(b)) > parseFloat(code(a))) {
              return -1;
            } else {
              return 0;
            }
          }
        }
      }],
      sort: true,
      autoWidth: 0,
      data: Object.keys(result2012).map((key) => [Number(key), legendText[key].LABEL3, result2012[key] + "%"])
    }).render(document.getElementById("content2012"));

    new gridjs.Grid({
      search: true,
      columns: [{
        name: "CLC",
        width: '40%'
      }, {
        name: "Class",
        width: '40%',
      }, {
        name: '%',
        width: '20%',
        sort: {
          compare: (a, b) => {
            const code = (x) => x.split('%')[0];
            console.log(typeof code(a));
            if (parseFloat(code(a)) > parseFloat(code(b))) {
              return 1;
            } else if (parseFloat(code(b)) > parseFloat(code(a))) {
              return -1;
            } else {
              return 0;
            }
          }
        }
      }],
      sort: true,
      autoWidth: 0,
      data: Object.keys(result2018).map((key) => [Number(key), legendText[key].LABEL3, result2018[key] + "%"])
    }).render(document.getElementById("content2018"));

  }).fail((jqXHR, textStatus, errorThrown) => {
    // FAIL
  });
});

// clear selection when drawing a new box and when clicking on the map
dragBox.on('boxstart', function() {
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
ol.control.LayerSwitcher.renderPanel(map, toc, {
  reverse: true,
  groupSelectStyle: 'group'
});

map.addControl(sidebar);
