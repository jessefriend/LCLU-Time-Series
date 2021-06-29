import 'ol/ol.css';
import ImageWMS from 'ol/source/ImageWMS';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
import {Image as ImageLayer, Tile as TileLayer} from 'ol/layer';


var map = L.map('map').setView([51.505, 13], 4);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiamVzc2VmcmllbmQiLCJhIjoiY2s2MjZlYXNoMDF1OTNocXBvZ2w5aTdsMCJ9.ltjNWwN6-e1VYzwlp07RcA'
}).addTo(map);

var clc_years = {

  '2006': L.tileLayer.wms('https://image.discomap.eea.europa.eu/arcgis/services/Corine/CLC2006_WM/MapServer/WMSServer?', {
      layers: 'Corine_Land_Cover_2006_raster43084',
      tiled: true,
      transparent: true,
      format: 'image/png',
      version: '1.3.0'
  }),

  '2012': L.tileLayer.wms('https://image.discomap.eea.europa.eu/arcgis/services/Corine/CLC2012_WM/MapServer/WmsServer?', {
      layers: 'Corine_Land_Cover_2012_raster59601',
      tiled: true,
      transparent: true,
      format: 'image/png',
      version: '1.3.0'
  }),

  '2018': L.tileLayer.wms('https://image.discomap.eea.europa.eu/arcgis/services/Corine/CLC2018_WM/MapServer/WmsServer?', {
      layers: '12',
      tiled: true,
      transparent: true,
      format: 'image/png',
      version: '1.3.0'
  }),
};

L.control.layers(clc_years).addTo(map);
