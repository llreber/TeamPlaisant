console.log('here')
console.log('here2')

var plot_first_country=true
var color_Label=-1;
var color_panel=["red","green","blue","yellow","cyan","black"]
var first_single_plot=1
var svg_copy=d3.select("Meiyou")
var countries

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

  // svg1=d3.select("#scatter_1")
  // .append("svg")
  // .attr("width", svgWidth)
  // .attr("height", svgHeight)

  // var chartGroup1 = d3.select("MeiYou")
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
max_val=1000000000
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
countries=[]

function plot_data(country){
d3.json(`/country/${country}`).then(function(AidData) {
  first_single_plot=1
  countries.push(country)  

    AidData.forEach(function(data) {
    //   data.date = parseTime(data.date);
      data.constant_amount = +data.constant_amount;
      data.fiscal_year= parseTime(data.fiscal_year);
    });


    // chartGroup2=d3.select("#svg")
    // var chartGroup2 = svg.append("g")
    // .attr("transform", `translate(${margin.left}, ${margin.top})`)


  var circlesGroup=  chartGroup2.selectAll("g.dot")
  .data(AidData)
  .enter().append('g');


  var labelsGroup_x = chartGroup2.append("g")
  .attr("transform", `translate(${chartWidth/2}, ${chartHeight})`);
  // Create group template for  3 y- axis labels
var labelsGroup_y = chartGroup2.append("g")
//.attr("transform", `translate(${chartWidth/2 +margin.left}, ${chartHeight+margin.top-20})`);
.attr("x", -chartHeight/2)
     .attr("y", 0)
     .attr("dy", "0.375em")
     .attr("transform", "rotate(-90)")

  labelsGroup_x.append("text")
  .attr("x", 0)
  .attr("y", 20+20)
  .attr("text-anchor", "middle")
  .text("Year");

  labelsGroup_y.append("text")
  .attr("x", -chartHeight/2)
  .attr("y", -70)
   .attr("text-anchor", "middle")
  .text("US-Aid Amount($)");

circlesGroup.append("circle")
.attr("class", "dot")
.attr("r", "6")
.attr("cx",data=>xLinearScale(data["fiscal_year"]))
.attr("cy",data=>yLinearScale(data["constant_amount"]))
// .attr("fill", rainbow(color_N*20))
.attr("fill", color_panel[color_Label])

.attr("data-legend",function(d) { return d.country_name})

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
})


var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([0, 0])
    .html(function(d) {return `<center>${d.country_name}:<br>${d["fiscal_year"].getFullYear()} <br> ${formatter.format(d.constant_amount)} </center>`});


  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data,this);
  })
  
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data,this);
    });

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
  .text(" ");

thead.append('th')
.style("min-width","190px")
  .text("selected contries:");

var tbody=table2.append('tbody');
Legend_label=tbody.append('tr')

var tfoot=table2.append("tfoot").append('tr')
tfoot.append('td')
tfoot.append('td').append("div")
.append("button")
.attr('id',`myBtn`)
.attr("value",`back`)
.attr("onclick","BackToM()")
.text('Back to multiple plot')
.style("color","#cc33ff")



function BackToM(){
  // if (!svg.empty()){svg.remove()}  
  d3.select("#scatter_2").html("")
  document.getElementById("scatter_2").appendChild(svg_copy);

}



if (plot_first_country===true){
color_Label=color_Label+1;
country="Afghanistan";
plot_data(country)
Legend_label.append('td').attr("align","center")
.append('div')
.attr("id","circle_label1")
Legend_label.append('td')
.append("button")
.attr('id',`myBtn`)
.attr("value",`${country}`)
.attr("onclick","myfunction(this)")
.text(`${country}`)
}


function myfunction(objButton){
// var itm = document.getElementById("myList2").lastChild;
// country = document.getElementById("myBtn").value;
// country =click.Value

if (first_single_plot===1){
first_single_plot=0
var itm = document.getElementById("scatter_2").lastChild;
svg_copy = itm.cloneNode(true);
// console.log()
}

country=objButton.value
console.log("country=",country)
plot_data2(country)
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
  Legend_label.append('td').attr("align","center").append('center').attr("id",`circle_label${color_Label+1}`)
  // Legend_label.append('td').text(filter_value)
  Legend_label.append('td')
  .append("button")
.attr('id',"myBtn")
.attr("value",`${ filter_value}`)
.attr("onclick","myfunction(this)")
.text(`${ filter_value}`)
  plot_data(filter_value)

  
  // .selectAll('th').style("min-width","90px")
  // .data(columns).enter()
  

  //  d3.select("div.parent").html("");
};    
    })   




    function plot_data2(country){
      d3.json(`/country/${country}`).then(function(AidData) {
      


          AidData.forEach(function(data) {
          //   data.date = parseTime(data.date);
            data.constant_amount = +data.constant_amount;
            data.fiscal_year= parseTime(data.fiscal_year);
          });
          
          // console.log(chartGroup1)


          // if (!svg.empty()){svg.remove()}  
          d3.select("#scatter_2").html("")
      
          svg=d3.select("#scatter_2")
          .append("svg")
          .attr("width", svgWidth)
          .attr("height", svgHeight)
        
          var chartGroup2 = svg.append("g")
          .attr("transform", `translate(${margin.left}, ${margin.top})`)
    
          xLinearScale=xScale();
          var bottomAxis = d3.axisBottom(xLinearScale);
            var xAxis = chartGroup2.append("g")
            .classed("x-axis", true)
           //  .attr("transform", `translate(${margin.left}, ${chartHeight+margin.top})`)
           .attr("transform", `translate(0, ${chartHeight})`)
            .call(bottomAxis);
         
    min_val=d3.min(AidData,data=>data.constant_amount)
    max_val=d3.max(AidData,data=>data.constant_amount)
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
    
        var circlesGroup=  chartGroup2.selectAll("g.dot")
        .data(AidData)
        .enter().append('g');
      

        num_selected_single=countries.indexOf(country)
        color_country=color_panel[num_selected_single]  

        console.log("countries",countries)
        console.log("country",country)
        console.log("num_selected_single",num_selected_single)

      circlesGroup.append("circle")
      .attr("class", "dot")
      .attr("r", "5")
      .attr("cx",data=>xLinearScale(data["fiscal_year"]))
      .attr("cy",data=>yLinearScale(data["constant_amount"]))
      // .attr("fill", rainbow(color_N*20))
      .attr("fill", color_country)
      .attr("data-legend",function(d) { return d.country_name})
      
    
      var labelsGroup_x = chartGroup2.append("g")
      .attr("transform", `translate(${chartWidth/2}, ${chartHeight})`);
      // Create group template for  3 y- axis labels
    var labelsGroup_y = chartGroup2.append("g")
    //.attr("transform", `translate(${chartWidth/2 +margin.left}, ${chartHeight+margin.top-20})`);
    .attr("x", -chartHeight/2)
         .attr("y", 0)
         .attr("dy", "0.375em")
         .attr("transform", "rotate(-90)")
    
      labelsGroup_x.append("text")
      .attr("x", 0)
      .attr("y", 20+20)
      .attr("text-anchor", "middle")
      .text("Year");
    
      labelsGroup_y.append("text")
      .attr("x", -chartHeight/2)
      .attr("y", -80)
       .attr("text-anchor", "middle")
      .text("US-Aid Amount($)");
    

      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
      })
    
    
      var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([0, 0])
        .html(function(d) {return `<center>${d.country_name}:<br>${d["fiscal_year"].getFullYear()} <br> ${formatter.format(d.constant_amount)} </center>`});
    
    
      circlesGroup.call(toolTip);
    
      circlesGroup.on("mouseover", function(data) {
        toolTip.show(data,this);
      })
      
    
        // onmouseout event
        .on("mouseout", function(data, index) {
          toolTip.hide(data,this);
        });
    
      })
    
    }
    