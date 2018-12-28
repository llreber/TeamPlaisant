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

function markerSize(amount) {
  //console.log(amount/1000);
  return amount/1000;
}
const slider = sliderFactory()
let slideholder = d3.select('#slider').call(slider
  .scale(true)
  .value(2016)
	.step(1)
	.dragHandler(function(d) {getValue(d);})
	);
  function getValue(d) {
    var parseNum = d3.format(".0f");
    //console.log (d.value);
    d3.select("#slideValue").text("Year "+parseNum(d.value()));
  }

function markerColor(type) {
  if (type == "Disbursements") {
    color = "red"
  }else if(type == "Obligations") {
    color = "green"
  } else {
    color = "white"
  };
  return color;
}


// Import Data
function buildMap(year) {
  console.log(year);
  //Use `d3.json` to fetch the sample data for the map
  var url = `/map/${year}`;
  console.log(url);
  d3.json(url).then(function(data) {
    //console.log(data);
    data.forEach((country) => {
      if (country.latitude !== null){
        console.log(country);
          var location = [country.latitude, country.longitude];
          //console.log(location);          
          L.circle(location, {
            fillOpacity: 0.75,
            fillColor: "red",
            color: "red",          
            radius: markerSize(country.amount)
          }).bindPopup("<h1>" + country.country + "</h1> <hr> <h3>Aid received: " + country.amount + "</h3>").addTo(myMap);
        };      
      });
    });     
};

function init() {
  // Grab the year from the slider
    var year = slider.value();
      //console.log(year);
    buildMap(year);
}

function optionChanged(newYear) {
  // Fetch new data each time a new year is selected
  //var newYear = slider.value();
  console.log(newYear);
  buildMap(newYear);
}
// Initialize the map
init();

/* slideholder.on("onchange", function(){
  var newYear = slider.value();
  buildMap(newYear);
});  */