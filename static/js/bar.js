// Define SVG area dimensions
console.log("here")

d3.select(".bar").append("h3")
.text('Total amount each year per category')

bubble_line1=d3.select(".bar")
.append('div')
.attr('id','button_bar')

bubble_line2= d3.select(".bar")
 .append('div')
 .attr('id',"bar_plot")


var svgWidth = 800;
var svgHeight = 500;

// Define the chart's margins as an object
var chartMargin = {
  top: 30,
  right: 30,
  bottom: 100,
  left: 150
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
d3.select('#button_bar').append("button").attr("type","button")
          .attr("id","year_button")
          .text("choose year:  ")

var svg_bar = d3.select("#bar_plot")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chartGroup = svg_bar.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Load data from hours-of-tv-watched.csv
// YOUR CODE HERE
// Load the US Foreign Aid Data and give it a callback function for error and for the data

year="2010"
bar_plot(year)



data_year=[]
for (var i=1950;i<2016;i++){
  data_year.push(`${i}`)
}



select2 = d3.select("#year_button")
    .append('select')
    .attr('class','select')
    .on('change',onchange_year)
    .selectAll('option')
    .data(data_year).enter()
    .append('option')
    .text(function (d) { return d; });     



function onchange_year(){
  chartGroup.html("")

year= $(this).val()
bar_plot(year)
}


function bar_plot(year){

d3.json(`/bar/${year}`).then(function(aidData) {
    
  
  chartGroup = svg_bar.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

  console.log("here2")
  // if(error) console.error;

  console.log("aidData=",aidData);

  // var aidCountry = aidData.map(data => data.country);
  // console.log("Amount: " , aidCountry);
  // var aidLat = aidData.map(data => data.latitude);
  // console.log("Amount: " , aidLat);
  // var aidLon = aidData.map(data => data.longitude);
  // console.log("Amount: " , aidLon);
  var aidCategory = aidData.map(data => data.category);
  console.log("Amount: " , aidCategory);
  // var aidType = aidData.map(data => data.type);
  // console.log("Amount: " , aidType);
  // var aidYears = aidData.map(data => data.year);
  // console.log("Year: ", aidYears);
  var aidAmount = aidData.map(data => data.amount);
  console.log("Amount: " , aidAmount);

// Cast the hours value to a number for each piece of aidData

  var count=0
  aidData.forEach(function(data) {
      data.amount = +data.amount;
      count=count+1
  }); 
 console.log(count)

  // Configure a band scale for the horizontal axis with a padding of 0.1 (10%)
  var xBandScale = d3.scaleBand()
    .domain(aidData.map(d => d.category))
    .range([0, chartWidth])
    .padding(0.1);

  // Create a linear scale for the vertical axis.
  var yLinearScale = d3.scaleLinear()
    .domain([0,d3.max(aidData, d=> d.amount)])
    .range([chartHeight, 0]);

  // Create two new axes functions passing our scales in as arguments

  var bottomAxis = d3.axisBottom(xBandScale);
  var leftAxis = d3.axisLeft(yLinearScale).ticks(10);

  // Append two SVG group elements to the chartGroup area,
  // and create the bottom and left axes inside of them
  chartGroup.append("g")
    .call(leftAxis);
    
  chartGroup.append("g")
    .attr("transform", `translate(0,${chartHeight})`)
    .call(bottomAxis);

  // Create one SVG rectangle per piece of tvData
  // Use the linear and band scales to position each rectangle within the chart

  chartGroup.selectAll(".bar")
  .data(aidData)
  .enter()
  .append('rect')
  .attr("class", "bar")
  .attr("x", d => xBandScale(d.category))
  .attr("y", d => yLinearScale(d.amount))
  .attr("width", xBandScale.bandwidth())
  .attr("height", d => chartHeight - yLinearScale(d.amount))
  .attr("fill","red")

  
  
  var labels_y = chartGroup.append("g")
  //.attr("transform", `translate(${chartWidth/2 +margin.left}, ${chartHeight+margin.top-20})`);
  .attr("x", -chartHeight/2)
       .attr("y", 0)
       .attr("dy", "0.375em")
       .attr("transform", "rotate(-90)")

  labels_y.append("text")
  .attr("x", -chartHeight/2)
  .attr("y", -100)
  .attr("text-anchor", "middle")
  .text("US-Aid Amount total($)");

  var labels_x = chartGroup2.append("g")
  .attr("transform", `translate(${chartWidth/2}, ${chartHeight})`);

  labels_x.append("text")
  .attr("x", 0)
  .attr("y", 20+20)
  .attr("text-anchor", "middle")
  .text("Category");

 })};
