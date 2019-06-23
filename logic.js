const myMap = L.map("map", {
    center: [40.924984, -115.904543],
    zoom: 5
  });
  
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>, <br> Created by Jonathan Randolph",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  }).addTo(myMap);
  
  const GEOJSONURL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';
  
  //creating colors for varying levels of magnitude
  function createColor(mag) {
    return mag >= 5 ? '#ef2d2d' :
        mag >= 4 ? '#ef632d' :
            mag >= 3 ? '#efce2d' :
                mag >= 2 ? '#ceef2d' :
                    '#5def2d'
  };
  //setting the legend on the bottom left
  const legend = L.control({ position: 'bottomleft' });
  
  legend.onAdd = function (map) {
  
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4],
        labels = [];
  
    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + createColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
  
    return div;
  };
  
  legend.addTo(myMap);
  
  d3.json(GEOJSONURL).then(data => {
  
    data.features.forEach(d => {
        coords = d.geometry.coordinates.splice(0, 2).reverse();
  
        L.circle(coords, {
            fillOpacity: 0.9,
            color: createColor(d.properties.mag),
            fillColor: createColor(d.properties.mag),
            radius: d.properties.mag * 15000
        }).bindPopup(`<h2> ${d.properties.type}</h2><hr>
        <p class = 'coords'><strong>Coordinates: </strong>${coords}</p>
        <p><strong>Magnitude: </strong>${d.properties.mag}</p>`).addTo(myMap);
    });
  })