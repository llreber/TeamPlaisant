console.log('here')
console.log('here2')

var plot_first_country=true
color_Label=-1;
color_panel=["red","green","blue","yellow","cyan","black"]

  var svgHeight = window.innerHeight*7/10;
  var svgWidth = window.innerWidth*8/10;

  var margin = {
    top: 20+30+30,
    right: 120+30+30+100,
    bottom: 80,
    left: 80+30+30
  }

  var chartWidth = svgWidth - margin.left - margin.right;
  var chartHeight = svgHeight - margin.top - margin.bottom;


  svg=d3.select("#scatter_2")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)

  var chartGroup2 = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)

  svg1=d3.select("#scatter_1")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)

  var chartGroup1 = d3.select("MeiYou")
  function rainbow(n) {
    //from value to color where n is from 0 to 255
      n = n * 240 / 255;
      return 'hsl(' + n + ',100%,50%)';
    }

var parseTime = d3.timeParse("%Y");
// d3.csv("./us_foreign_aid_complete.csv").then(function(AidData) {


  function xScale() {
    // create scales
    var xLinearScale = d3.scaleTime()
      .domain([parseTime(1945),parseTime(2020)
      ])
      .range([0, chartWidth]);
    return xLinearScale;
  }

  xLinearScale=xScale();
  var bottomAxis = d3.axisBottom(xLinearScale);
    var xAxis = chartGroup2.append("g")
    .classed("x-axis", true)
   //  .attr("transform", `translate(${margin.left}, ${chartHeight+margin.top})`)
   .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);
 

// min_val=d3.min(AidData,data=>data.constant_amount)
// max_val=d3.max(AidData,data=>data.constant_amount)

min_val=0
max_val=10000000000
function yScale(){
  // create scales
  var yLinearScale = d3.scaleLinear()
  .domain([min_val,max_val])
    .range([chartHeight,0]);
  return yLinearScale;
}
// append y axis
yLinearScale=yScale();
var leftAxis   = d3.axisLeft(yLinearScale);
var  yAxis= chartGroup2.append("g")
// .attr("transform", `translate(${margin.left}, ${margin.top})`)
.classed("y-axis", true)
.call(leftAxis);

   
var color_N=1

function plot_data(country){
d3.json(`/country/${country}`).then(function(AidData) {

    AidData.forEach(function(data) {
    //   data.date = parseTime(data.date);
      data.constant_amount = +data.constant_amount;
      data.fiscal_year= parseTime(data.fiscal_year);
    });

  var circlesGroup=  chartGroup2.selectAll("g.dot")
  .data(AidData)
  .enter().append('g');

circlesGroup.append("circle")
.attr("class", "dot")
.attr("r", "5")
.attr("cx",data=>xLinearScale(data["fiscal_year"]))
.attr("cy",data=>yLinearScale(data["constant_amount"]))
// .attr("fill", rainbow(color_N*20))
.attr("fill", color_panel[color_Label])

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
}




var table2 = d3.selectAll("#selected_country_table2")
             .append('div').attr("class","col-md-12").append('div')
              .attr("id","table-area")
              .style("text-align", "center")
              .append('table')
              .attr('class','table-striped')
              .style("width","100%")
    
var thead=table2.append('thead')

thead.append('th')
.style("min-width","90px")
  .text("symbol:");

thead.append('th')
.style("min-width","190px")
  .text("selected contries:");

var tbody=table2.append('tbody');
Legend_label=tbody.append('tr')


// Legend_label.append('td')
// .append("circle")
// .attr("class", "dot")
// .attr("r", "5")
// .attr("fill", "red");

// function getOffset(el) {
//   const rect = el.getBoundingClientRect();
//   return {
//     left: rect.left + window.scrollX,
//     top: rect.top + window.scrollY
//   };
// }
// // Legend_label.append('td')
// // var rect = element.getBoundingClientRect();
// // console.log(rect.top, rect.right, rect.bottom, rect.left);

// element=Legend_label.append('td').attr('id','circle1').text(' ss')
// ss=document.getElementById("circle1")

// element.append('svg').attr("height","20").attr("height","20")
// .append("circle")
// .attr("cx",getOffset(ss).left)
// .attr("cy",getOffset(ss).top)
// .attr("class", "dot")
// .attr("r", "5")
// .attr("fill", "red");

if (plot_first_country===true){
color_Label=color_Label+1;
country="Afghanistan";
plot_data(country)
Legend_label.append('td').append('center').attr("id","circle_label1")
Legend_label.append('td').text("Afghanistan")
}



// #circle_label {
//   width: 20px;
//   height: 20px;
//   -webkit-border-radius: 10px;
//   -moz-border-radius: 10px;
//   border-radius: 10px;
//   background: red;
// }







d3.select('#button2').append("button").attr("type","button")
          .attr("id","countryfilter2")
          .text("choose country:  ")
data_3=[]

d3.json("./names").then(function(CountryNames) { 
  
  CountryNames.forEach(function(data) {
    //   data.date = parseTime(data.date);
    data_3.push(data.country);
    });



select2 = d3.select("#countryfilter2")
    .append('select')
    .attr('class','select')
    .on('change',onchange2)
    .selectAll('option')
    .data(data_3).enter()
    .append('option')
    .text(function (d) { return d; });     
      


function onchange2() {

  color_N=color_N+1
  color_Label= color_Label+1
  filter_value = $(this).val()
  // filter_value = d3.select('#countryfilter2 >select').property('value')
  console.log('Onchange:',filter_value)

  Legend_label=tbody.append('tr')
  Legend_label.append('td').append('center').attr("id",`circle_label${color_N}`)
  Legend_label.append('td').text(filter_value)
  plot_data(filter_value)

  
  // .selectAll('th').style("min-width","90px")
  // .data(columns).enter()
  

  //  d3.select("div.parent").html("");
};    

      
    })   
