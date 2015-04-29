var margin = {top: 20, right: 20, bottom: 30, left: 50};
    var w = 960 - margin.left - margin.right;
    var h = 500 - margin.top - margin.bottom;

var dataset;

d3.csv("stocks.csv", function(error, stocks) {
  if (error) return console.warn(error);
    stocks.forEach(function(d) {
      d.price =+d.price;
    });
  dataset = stocks;
  drawVis(dataset);
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

var y = d3.scale.linear()
        .domain([0, 1000])
        .range([h, 0]);

var tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

var circles = svg.selectAll("circle")
 .data(data)
 .enter()
 .append("circle")
    .attr("cx", function(d) { return x(d.price);  })
    .attr("cy", function(d) { return y(d.tValue);  })
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

