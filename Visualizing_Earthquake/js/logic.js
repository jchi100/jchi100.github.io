

link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(link, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  var tectonicData;
  d3.json("./PB2002_plates.json", function(d) {
  tectonicData = d;
  createFeatures(data.features, tectonicData.features);
  });
  
});

function createFeatures(earthquakeData, tectionicData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

 
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
     
      var geojsonMarkerOptions = {
        radius: 4*feature.properties.mag,
        fillColor: chooseColor(feature.properties.mag),
        color: "black",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };
      return L.circleMarker(latlng, geojsonMarkerOptions);
    }

  });

  var tectonicline =  L.geoJSON(tectionicData, {
    onEachFeature: onEachFeature,

        style: function(feature) { return {
          color: "#FFA500",
          fill: false
        }
      } 
  })


  // Sending our earthquakes layer, fault line layer to the createMap function
  createMap(earthquakes,tectonicline);
}

function chooseColor(d) {
  return d < 1 ? 'rgb(137, 244, 66)' :
        d < 2  ? 'rgb(205, 244, 65)' :
        d < 3  ? 'rgb(244, 244, 65)' :
        d < 4  ? 'rgb(244, 187, 65)' :
        d < 5  ? 'rgb(244, 124, 65)' :
                    'rgb(244, 76, 65)';
}

function createMap(earthquakes, tectonicline) {


  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoiamNoaTEwMCIsImEiOiJjamh2NGI0ZTIwdmRtM3ZydjFhZnN4MHdqIn0.L20XsxCdnrdcViqMZud6nQ");

    var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoiamNoaTEwMCIsImEiOiJjamh2NGI0ZTIwdmRtM3ZydjFhZnN4MHdqIn0.L20XsxCdnrdcViqMZud6nQ");

  var outdoormap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoiamNoaTEwMCIsImEiOiJjamh2NGI0ZTIwdmRtM3ZydjFhZnN4MHdqIn0.L20XsxCdnrdcViqMZud6nQ");

 // var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
 //   "access_token=pk.eyJ1IjoiamNoaTEwMCIsImEiOiJjamh2NGI0ZTIwdmRtM3ZydjFhZnN4MHdqIn0.L20XsxCdnrdcViqMZud6nQ");

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Satellite":satellitemap,
    "Grayscale": streetmap,
    //"Dark Map": darkmap,
    "Outdoors": outdoormap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    FaultLines: tectonicline,
    Earthquakes: earthquakes  
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map-id", {
    center: [
      37.7749, -122.4194
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  //------------------Create legend
 

// Create a legend to display information about our map
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 1, 2, 3, 4, 5],
    labels = [];


    // loop through our density intervals and generate a label with a colored square for each interval
    var legendstr = '<div style="font-size:10px">';
    for (var i = 0; i < grades.length; i++) {
      //  div.innerHTML +=
          legendstr +=
            '<i style="background:' + chooseColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
          div.innerHTML = legendstr + '</div>';
}

return div;
};

legend.addTo(myMap);

}

