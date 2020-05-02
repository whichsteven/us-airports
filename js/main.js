// Create a map object.
var mymap = L.map('map', {
  center: [46, -122],
  zoom: 3,
  maxZoom: 10,
  minZoom: 4,
  detectRetina: true
});

// Add a base map.
L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png').addTo(mymap);

// Get GeoJSON and put on it on the map when it loads
var airports = L.geoJson.ajax("assets/airports.geojson", {
  // assign a function to the onEachFeature parameter of the airports object.
  // Then each (point) feature will bind a popup window.
  onEachFeature: function(feature, layer) {
    layer.bindPopup(
      "Airport Name: " + feature.properties.AIRPT_NAME +
      "<br>" +
      "Location: " +
      feature.properties.CITY +
      ", " +
      feature.properties.STATE, {
        closeButton: false
      }
    );
    layer.on('mouseover',
      function() {
        layer.openPopup();
      }
    );
    layer.on('mouseout',
      function() {
        layer.closePopup();
      }
    );

  },
  pointToLayer: function(feature, latlng) {
    return L.marker(latlng, {
      icon: L.divIcon({
        className: "fas fa-plane"
      })
    });
  },
  attribution: 'Airports Data &copy; DATA.GOV | US States &copy; Mike Bostock | Base Map &copy; CartoDB | Made By Steven Bao'
}).addTo(mymap);


// Set function for color ramp
colors = chroma.scale('Blues').colors(5);

function setColor(count) {
  var id = 0;
  if (count > 40) {
    id = 4;
  } else if (count > 30 && count <= 40) {
    id = 3;
  } else if (count > 20 && count <= 30) {
    id = 2;
  } else if (count > 10 && count <= 20) {
    id = 1;
  } else {
    id = 0;
  }
  return colors[id];
}


// Set style function that sets fill color.md property equal to the counts of airports
function style(feature) {
  return {
    fillColor: setColor(feature.properties.count),
    fillOpacity: 0.4,
    weight: 2,
    opacity: 1,
    color: '#b4b4b4',
    dashArray: '4'
  };
}

// Add county polygons
// create counties variable, and assign null to it.
var states = null;
states = L.geoJson.ajax("assets/us-states.geojson", {
  style: style
}).addTo(mymap);


// Create Leaflet Control Object for Legend
var legend = L.control({
  position: 'bottomleft'
});

// Function that runs when legend is added to map
legend.onAdd = function() {

  // Create Div Element and Populate it with HTML
  var div = L.DomUtil.create('div', 'legend');
  div.innerHTML += '<b># Airports in the state</b><br />';
  div.innerHTML += '<i style="background: ' + colors[4] + '; opacity: 0.5"></i><p>40+</p>';
  div.innerHTML += '<i style="background: ' + colors[3] + '; opacity: 0.5"></i><p>30-40</p>';
  div.innerHTML += '<i style="background: ' + colors[2] + '; opacity: 0.5"></i><p>20-30</p>';
  div.innerHTML += '<i style="background: ' + colors[1] + '; opacity: 0.5"></i><p>10-20</p>';
  div.innerHTML += '<i style="background: ' + colors[0] + '; opacity: 0.5"></i><p> 0-10</p>';
  // Return the Legend div containing the HTML content
  return div;
};

// Add a scale bar to map
L.control.scale({
  position: 'bottomright'
}).addTo(mymap);

// Add a legend to map
legend.addTo(mymap);
