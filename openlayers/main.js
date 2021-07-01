import 'ol/ol.css';
import 'ol-layerswitcher/dist/ol-layerswitcher.css';

import Map from 'ol/Map';
import View from 'ol/View';
import Feature from 'ol/Feature';
import {ImageArcGISRest, OSM, Vector as VectorSource} from 'ol/source';
import Stamen from 'ol/source/Stamen';
import {Image as ImageLayer, Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {Fill, Stroke, Style, Text} from 'ol/style';
import GeoJSON from 'ol/format/GeoJSON';
import LayerGroup from 'ol/layer/Group';

import LayerSwitcher from 'ol-layerswitcher';
import { BaseLayerOptions, GroupLayerOptions } from 'ol-layerswitcher';

var url2000 =
  'https://image.discomap.eea.europa.eu/arcgis/rest/services/Corine/CLC2000_WM/MapServer';

var url2006 =
  'https://image.discomap.eea.europa.eu/arcgis/rest/services/Corine/CLC2006_WM/MapServer';

var url2012 =
  'https://image.discomap.eea.europa.eu/arcgis/rest/services/Corine/CLC2012_WM/MapServer';

var url2018 =
  'https://image.discomap.eea.europa.eu/arcgis/rest/services/Corine/CLC2018_WM/MapServer';

var adminBoundaries =
  'https://maratlas.discomap.eea.europa.eu/arcgis/rest/services/Maratlas/country_borders/MapServer'


var layers = [
  // new TileLayer({
  //   source: new OSM(),
  // }),
  new ImageLayer({
    source: new ImageArcGISRest({
      ratio: 1,
      params: {},
      url: 'https://services.arcgisonline.com/arcgis/rest/services/World_Shaded_Relief/MapServer',
    }),
  }),
  new LayerGroup({
    title: 'CLC Years',
    layers: [
      new ImageLayer({
        title: '2000',
        source: new ImageArcGISRest({
          ratio: 1,
          params: {},
          url: url2000,
        }),
      }),
      new ImageLayer({
        title: '2006',
        source: new ImageArcGISRest({
          ratio: 1,
          params: {},
          url: url2006,
        }),
      }),
      new ImageLayer({
        title: '2012',
        source: new ImageArcGISRest({
          ratio: 1,
          params: {},
          url: url2012,
        }),
      }),
      new ImageLayer({
        title: '2018',
        source: new ImageArcGISRest({
          ratio: 1,
          params: {},
          url: url2018,
        }),
      }),
      ]
    }),
   new ImageLayer({
     source: new ImageArcGISRest({
       ratio: 1,
       params: {},
       url: adminBoundaries,
     }),
   }),
  new TileLayer({
    title: 'Labels',
    source: new Stamen({
      layer: 'toner-labels' }),
      title:'Labels' }),
 ];

//  new VectorLayer({
//   source: new VectorSource({
//     url: './data/countries.json',
//     format: new GeoJSON(),
//   }),
// }),

var map = new Map({
  layers: layers,
  target: 'map',
  view: new View({
    center: [1069099, 7200000],
    zoom: 3.75,
  }),
});


var layerSwitcher = new LayerSwitcher({
  startActive: true,
  activationMode: 'click',
});
map.addControl(layerSwitcher);


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
// Define the available dates
// var dates = ['2000', '2006', '2012','2018',]
//
// var sliderRange = document.getElementById("myRange");
// sliderRange.max = dates.length-1;
//
// var dateValue = document.getElementById("date_value");
// dateValue.innerHTML = dates[sliderRange.value].slice(0,10);
// lapply(layers, `[[`, 1).getSource().setUrl('https://image.discomap.eea.europa.eu/arcgis/rest/services/Corine/CLC' + dates[sliderRange.value] + '_WM/MapServer');

// // Update the current slider value (each time you drag the slider handle)
// sliderRange.oninput = function() {
// dateValue.innerHTML = dates[this.value].slice(0,10);
// lapply(layers, `[[`, 1).getSource().setUrl('https://image.discomap.eea.europa.eu/arcgis/rest/services/Corine/CLC' + dates[this.value] + '_WM/MapServer');
// }
