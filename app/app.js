/* globals SC */

import Leaflet from './vendor/leaflet/dist/leaflet.js';
import geojsonData from './data.json';

var soundCloudSetUrl = 'https://soundcloud.com/correctiv_org/sets/mh17-eindrucke-aus-der-ostukraine';

var mapCenter = [48.27588152743497, 37.14752197265624];
var mapZoom = 9;
var minZoom = 8;
var bounds = new Leaflet.LatLngBounds(
  [49.5822, 33.728], [47.1225, 40.5285]
);
var iframeID = 'iframe';
Leaflet.Icon.Default.imagePath = 'images/leaflet/';


var widget = SC.Widget(iframeID);
widget.load(soundCloudSetUrl, {});


var map = Leaflet.map('map',{
  minZoom: minZoom,
  maxZoom: mapZoom,
  maxBounds: bounds,
  zoomControl: false,
  attributionControl: false
}).setView(mapCenter, 8);
window.Lmap = map;


Leaflet.tileLayer('./images/tiles/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://osm.org/copyright">OSM contributors</a>'
}).addTo(map);


var i = 0;
var markerLayer = Leaflet.geoJson(geojsonData, {
  onEachFeature: function (feature, layer) {
    layer.bindPopup(feature.properties.title);
    layer.setOpacity(0.5);
    (function(i){
      layer.on('click', function(){
        widget.skip(i);
      });
    }(i));
    i += 1;
  }
});
markerLayer.addTo(map);


widget.bind(SC.Widget.Events.PLAY, function() {
  widget.getCurrentSound(function(data){
    markerLayer.eachLayer(function(layer){
      layer.setOpacity(0.5);
      if (layer.feature.properties.permalink === data.permalink_url) {
        layer.openPopup();
        layer.setOpacity(1.0);
        map.setView(layer.getLatLng(), mapZoom);
      }
    });
  });
});
