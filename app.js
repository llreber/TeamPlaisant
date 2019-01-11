function makeResponsive() {

  var svgArea = d3.select("body").select("svg");

  if (!svgArea.empty()){
    svgArea.remove();
  }

  // Define SVG container
  var svgWidth = window.innerWidth;
  var svgHeight = window.innerHeight;

  // Define the chart's margins as an object
  var chartMargin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
  };

  // Define dimensions of the chart area
  var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
  var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
  var svg = d3.select("body")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);


// Load data from hours-of-tv-watched.csv
// YOUR CODE HERE
// Load the US Foreign Aid Data and give it a callback function for error and for the data
  d3.csv("./us_foreign_aid_small.csv", function(error, aidData) {
    
    if(error) console.error;

      console.log(aidData);

    var aidCountry = aidData.map(data => data.country);
    console.log("Amount: " , aidCountry);
    var aidLat = aidData.map(data => data.latitude);
    console.log("Amount: " , aidLat);
    var aidLon = aidData.map(data => data.longitude);
    console.log("Amount: " , aidLon);
    var aidCategory = aidData.map(data => data.category);
    console.log("Amount: " , aidCategory);
    var aidType = aidData.map(data => data.type);
    console.log("Amount: " , aidType);
    var aidYears = aidData.map(data => data.year);
    console.log("Year: ", aidYears);
    var aidAmount = aidData.map(data => data.amount);
    console.log("Amount: " , aidAmount);

// Cast the hours value to a number for each piece of aidData
  aidData.forEach(function(data) {
      data.amount = +data.amount;
  }); 


  // Create a linear scale for the vertical axis.
  var yScale = d3.scaleLinear()
    .domain([0,d3.max(aidData, d=> d.amount)])
    .range([chartHeight, 0]);

  // Configure a band scale for the horizontal axis with a padding of 0.1 (10%)
  var xScale = d3.scaleBand()
    .domain(aidData.map(d => d.category))
    .range([0, chartWidth])
    .padding(0.1);

  
  // Create two new axes functions passing our scales in as arguments

  var yAxis = d3.axisLeft(yScale).ticks(10);

  var xAxis = d3.axisBottom(xScale);
 
  // Append two SVG group elements to the chartGroup area,
  // and create the bottom and left axes inside of them
  chartGroup.append("g")
    .call(yAxis);
    
  chartGroup.append("g")
    .attr("transform", `translate(0,${chartHeight})`)
    .call(xAxis);


// append bars
var barGroup = chartGroup.selectAll("bar")
  .data(aidData)
  .enter()
  .append("bar")
  .attr("x", d => xScale(d.country))
  .attr("y", d => yScale(d.amount))
  .attr("fill", "gold")
  .attr("stroke-width", "1")
  .attr("stroke", "black");

  // Create one SVG rectangle per piece of tvData
  // Use the linear and band scales to position each rectangle within the chart

  chartGroup.selectAll(".bar")
  .data(aidData)
  .enter()
  .append('rect')
  .attr("class", "bar")
  .attr("x", d => xScale(d.category))
  .attr("y", d => yScale(d.amount))
  .attr("width", xScale.bandwidth())
  .attr("height", d => chartHeight - yScale(d.amount))
  .attr("fill", "green")
  .on("click", function (d,i) {
    alert(`${category[i]}`);
  })
  .on("mouseover", function() {
    d3.select(this).attr("fill","red");
  })
  .on("mouseout", function() {
    d3.select(this).attr("fill","green");
  });
  
 });

}

 makeResponsive();
// event listener for resizing the window
 d3.select(window).on("resize", makeResponsive);
