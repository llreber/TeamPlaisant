console.log('here')
console.log('here2')
// const sqlite3 = require('sqlite3').verbose();


var trace1 = {
  x: [1, 2, 3, 4],
  y: [10, 15, 13, 17],
  mode: 'markers',
  type: 'scatter'
};

var trace2 = {
  x: [2, 3, 4, 5],
  y: [16, 5, 11, 9],
  mode: 'lines',
  type: 'scatter'
};

var trace3 = {
  x: [1, 2, 3, 4],
  y: [12, 9, 15, 12],
  mode: 'lines+markers',
  type: 'scatter'
};

var data = [trace1, trace2, trace3];

Plotly.newPlot('scatter_plotly', data);


// var svgArea = d3.select("#scatter>svg ")

    // svg params
  var svgHeight = window.innerHeight;
  var svgWidth = window.innerWidth*8/10;

  var margin = {
    top: 20+30+30,
    right: 120+30+30+100,
    bottom: 80,
    left: 80+30+30
  }

  var chartWidth = svgWidth - margin.left - margin.right;
  var chartHeight = svgHeight - margin.top - margin.bottom;


  svg=d3.select("#scatter_d3")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)

  var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)


  function rainbow(n) {
    //from value to color where n is from 0 to 255
      n = n * 240 / 255;
      return 'hsl(' + n + ',100%,50%)';
    }

var parseTime = d3.timeParse("%Y");
// d3.csv("./us_foreign_aid_complete.csv").then(function(AidData) {


country="Afghanistan"
d3.json(`/country/${country}`).then(function(AidData) {

    AidData.forEach(function(data) {
    //   data.date = parseTime(data.date);
      data.constant_amount = +data.constant_amount;
      data.fiscal_year= parseTime(data.fiscal_year);
    });

console.log('here  33')

// function used for updating x-scale var upon click on axis label
function xScale(AidData) {
    // create scales
    var xLinearScale = d3.scaleTime()
      .domain([d3.min(AidData, d => d["fiscal_year"]),
        d3.max(AidData, d => d["fiscal_year"])
      ])
      .range([0, chartWidth]);
    return xLinearScale;
  }
  
  function yScale(AidData){
    // create scales
    var yLinearScale = d3.scaleLinear()
    .domain([d3.min(AidData, d => d["constant_amount"]),
        d3.max(AidData, d => d["constant_amount"])
      ])
      .range([chartHeight,0]);
  
    return yLinearScale;
  
  }

  xLinearScale=xScale(AidData);
  yLinearScale=yScale(AidData);


  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis   = d3.axisLeft(yLinearScale);
 
 
    var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
   //  .attr("transform", `translate(${margin.left}, ${chartHeight+margin.top})`)
   .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);
 
  // append y axis
   var  yAxis= chartGroup.append("g")
   // .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .classed("y-axis", true)
    .call(leftAxis);
 

  var circlesGroup=  chartGroup.selectAll("g.dot")
  .data(AidData)
  .enter().append('g');

circlesGroup.append("circle")
.attr("class", "dot")
.attr("r", "5")
.attr("cx",data=>xLinearScale(data["fiscal_year"]))
.attr("cy",data=>yLinearScale(data["constant_amount"]))
.attr("fill", rainbow(100))
.attr("data-legend",function(d) { return d.country_name})

// circlesGroup.append("text").text(function(d){
// return d.abbr;
// })
// .attr("x",data=>xLinearScale(data.fiscal_year))
// .attr("y",data=>yLinearScale(data.constant_amount))
// .attr("text-anchor", "middle")
// .attr("font-size","60%")

// legend = svg.append("g")
//   .attr("class","legend")
//   .attr("transform","translate(50,30)")
//   .style("font-size","12px")
//   .call(d3.legend)


})

var table1 = d3.selectAll("#selected_country_table")
             .append('div').attr("class","col-md-12").append('div')
              .attr("id","table-area")
              .style("text-align", "center")
              .append('table')
              .attr('class','table-striped')
              .style("width","100%")
    
var thead=table1.append('thead')

thead.append('th')
.style("min-width","90px")
  .text("symbol:");

thead.append('th')
.style("min-width","190px")
  .text("selected contries:");

var tbody=table1.append('tbody');
Legend_label=tbody.append('tr')
// Legend_label.append('td')
// .append("circle")
// .attr("class", "dot")
// .attr("r", "5")
// .attr("fill", "red");

function getOffset(el) {
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY
  };
}

// Legend_label.append('td')
// var rect = element.getBoundingClientRect();
// console.log(rect.top, rect.right, rect.bottom, rect.left);

element=Legend_label.append('td').attr('id','circle1').text(' ss')
ss=document.getElementById("circle1")



element.append('svg').attr("height","20").attr("height","20")
.append("circle")
.attr("cx",getOffset(ss).left)
.attr("cy",getOffset(ss).top)
.attr("class", "dot")
.attr("r", "5")
.attr("fill", "red");
Legend_label.append('td').text("Afghanistan")





// var legend_keys = ["Austin", "New York", "San Francisco"]

// var lineLegend =d3.selectAll("#selected_country_table")
//    .append('div').attr("class","col-md-12").append('div')
// .attr("id","legend-area")
// .style("text-align", "center")
// .selectAll(".Legend")
//     .data(legend_keys)
//     .enter().append("g")
//     .attr("class","Legend")
//     .attr("transform", function (d,i) {
//             return "translate(" + svgWidth  + "," + (i*20)+")";
//         });

// lineLegend.append("text").text(function (d) {return d;})
//     .attr("transform", "translate(15,9)"); //align texts with boxes

// lineLegend.append("rect")
//     .attr("fill", function (d, i) {return rainbow(i*20); })
//     .attr("width", 10).attr("height", 10);

          // .selectAll('th').style("min-width","90px")
          // .data(columns).enter()
         


MoreFilter=d3.select('body').append('div').append('center').attr("class","col-md-10").append('div').attr("class","btn-group btn-group-lg")
MoreFilter.append("button").attr("type","button")
                      .attr("class","btn btn-primary")
                      .attr("id","countryfilter").text("choose country")
 
// data_3 =[Array.from(filter_data[filter_kind])]; 
data_3=[]

d3.json("./names").then(function(CountryNames) { 
  CountryNames.forEach(function(data) {
    //   data.date = parseTime(data.date);
    data_3.push(data.country);
    });
  

// data_3 =["china","japan","German"]; 


select = d3.select("#countryfilter")
  .append('select')
    .attr('class','select')
    .on('change',onchange)

var options = select
.selectAll('option')
  .data(data_3).enter()
  .append('option')
      .text(function (d) { return d; });     
      



function onchange() {
  // d3.event.preventDefault();
  // var str=d3.event.target.id;
  // var value = d3.select(this).attr("value");
  // console.log("str=",str)
  // console.log("value=",value)
  filter_value = d3.select('select').property('value')
  console.log('Onchange:',filter_value)

  Legend_label=tbody.append('tr')
  Legend_label.append('td').text("color")
  Legend_label.append('td').text(filter_value)

  
  // .selectAll('th').style("min-width","90px")
  // .data(columns).enter()
  

  //  d3.select("div.parent").html("");
};    

      
    })   

  // <select id="selDataset" onchange="optionChanged(this.value)"></select>
        
  
// d3.select("#datefilter").on("click",moreFilterClick);