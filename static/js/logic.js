// Create a map object
var myMap = L.map("map", {
  center: [15.5994, -28.6731],
  zoom: 3
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets-basic",
  accessToken: API_KEY
}).addTo(myMap);

var circleLayer = new L.LayerGroup();

function markerSize(amount) {
  //console.log(amount/1000);
  if (amount < 100000){
    return 20;
  }else{
  return amount/5000;
  }
}
const slider = sliderFactory()
let slideholder = d3.select('#slider').call(slider
  .scale(true)
  .value(2016)
	.step(1)
	.dragHandler(function(d) {
    getValue(d);
    //buildMap(d.value());
  })
  );
  
function getValue(d) {
  var parseNum = d3.format(".0f");
  //console.log (d.value);
  d3.select("#slideValue").text("Year "+parseNum(d.value()));
}

// Import Data
function buildMap(year) {
  //console.log(year);
  //circleLayer.clearLayers();
  //Use `d3.json` to fetch the sample data for the map
  var url = `/map/${year}`;
  console.log(url);
  d3.json(url).then(function(data) {
    //console.log(data);
    data.forEach((country) => {
      if (country.latitude !== null){
        //console.log(country);
          var location = [country.latitude, country.longitude];
          var aidAmount = Math.round(country.amount/1000000);
          //console.log(location);       
          var circle = L.circle(location, {
            fillOpacity: 0.75,
            fillColor: "red",
            color: "red",          
            radius: markerSize(country.amount)
          }).bindPopup("<h1>" + country.country + "</h1> <hr> <h3>"+ year + " Aid received: $" + aidAmount + " million</h3>").addTo(myMap);
          circleLayer.addLayer(circle);
        };      
      });
    }); 
    circleLayer.addTo(myMap);    
};

function init() {
  // Grab the year from the slider
    var year = slider.value();
      //console.log(year);
    buildMap(year);
}

// Initialize the map
init();

