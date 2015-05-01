var margin = {top: 20, right: 20, bottom: 30, left: 50};
    var w = 960 - margin.left - margin.right;
    var h = 500 - margin.top - margin.bottom;    

var dataset;

d3.csv("deathrates.csv", function(error, rates) {
  if (error) return console.warn(error);
    rates.forEach(function(d) {
      //console.log(d);
      //d.code += d.code;
      //d.region += d.region;
      //for (i = 1960; i <= 2013; i++) {
       // d.i += i;/
    
  });

  dataset = rates;
  drawVis(dataset);
  //console.log(dataset);
});

function drawVis(data) {

var col = d3.scale.category10();

var svg = d3.select("body").append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scale.linear()
        .domain([0, 1000])
        .range([0, w]);

var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

var y = d3.scale.linear()
        .domain([0, 1000])
        .range([h, 0]);

var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

var circles = svg.selectAll("circle")
 .data(dataset)
 .enter()
 .append("circle")
    .attr("cx", function(d) { return x(d.cat);  })
    .attr("cy", function(d) { return y(d.dog);  })
    .attr("r", 4)
    .style("stroke", "red")

    .on("mouseover", function(d) {
      tooltip.transition()
        .duration(200)
        .style("opacity, 1");
      tooltip.html("Stock" + d.name + ":" + d.price + "," + d.tValue + "," + d.vol)
        .style("left", (d3.event.pageX + 5) + "px")
        .style("top", (d3.event.pageY - 28) + "px")
        .style("opacity", 1)
    })
    .on("mouseout", function(d) {
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    })
}

