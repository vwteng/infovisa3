var margin = {top: 20, right: 20, bottom: 30, left: 50};
    var w = 960 - margin.left - margin.right;
    var h = 500 - margin.top - margin.bottom;

// var data = [
//   {name: "A", type: "tech", price: 999, tValue: 500, vol: 1200},
//   {name: "B", type: "transp", price: 772, tValue: 800, vol: 367},
//   {name: "C", type: "transp", price: 372, tValue: 670, vol: 558},
//   {name: "D", type: "tech", price: 774, tValue: 801, vol: 431},
//   {name: "E", type: "retail", price: 389, tValue: 130, vol: 123},
//   {name: "F", type: "fastfood", price: 739, tValue: 888, vol: 45},
//   {name: "G", type: "fastfood", price: 582, tValue: 230, vol: 999},
//   {name: "H", type: "tech", price: 972, tValue: 284, vol: 87},
//   {name: "I", type: "pharm", price: 791, tValue: 609, vol: 449},
//   {name: "J", type: "pharm", price: 291, tValue: 701, vol: 870},
//   {name: "K", type: "transp", price: 134, tValue: 921, vol: 699},
//   {name: "L", type: "retail", price: 532, tValue: 731, vol: 1002},
//   {name: "M", type: "retail", price: 788, tValue: 631, vol: 310}
// ];

var format = d3.time.format("%b %Y");
var dataset;

d3.csv("stocks.csv", function(error, stocks) {
  if (error) return console.warn(error);
  stocks.forEach(function(d) {
    d.price =+d.price;
  });
  dataset = stocks;
  drawVis(dataset);
});

// d3.csv("stocks.csv", function(data) {
//   dataset = data.map(function(d) { return [d["type"], +d["price"], +d["vol"]];});
//   drawVis(data);
// });

function drawVis(data) {
  // var circle = d3.selectAll("circle")
  //   .data(data)
  //   .enter()
  //   .append("circle")
  //     // .attr("cx", function(d) { return x(d.price); })
  //     // .attr("cy", function(d) { return y(d.tValue); })
  //     .attr("r", 20)
  //     .style("stroke", "red")
  //     .style("fill", function(d) { return col(d.name);})
  //     .style("opacity", 0.5)


  //   .on("mouseover", function(d) {
  //     tooltip.transition()
  //       .duration(200)
  //       .style("opacity, 1");
  //     tooltip.html("Stock" + d.name + ":" + d.price + "," + d.tValue + "," + d.vol)
  //       .style("left", (d3.event.pageX + 5) + "px")
  //       .style("top", (d3.event.pageY - 28) + "px")
  //   })
  //   .on("mouseout", function(d) {
  //     tooltip.transition()
  //       .duration(500)
  //       .style("opacity", 0);
  //   })

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

