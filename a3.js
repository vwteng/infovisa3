var margin = {top: 20, right: 20, bottom: 30, left: 50};
    width = 960 - margin.left - margin.right;
    height = 500 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y").parse;

d3.csv("deathrates1.csv", function(error, data) {
    data.forEach(function(d) {
        d.year = parseDate(d.year);
        d.death = +d.death;
        drawVis(data);
    });

var color = d3.scale.category10(); 

var colLightness = d3.scale.linear()
 .domain([0, 1200])
 .range(["#FFFFFF", "#000000"])

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");

var x = d3.scale.linear()
    .domain([0, 2013])
    .range([0, width]);

var y = d3.scale.linear()
    .domain([0, 60])
    .range([height, 0]);

function drawVis(data) {
  var circles = d3.selectAll("circle")
   .data(data)
   .enter()
   .append("circle")
    .attr("cx", function(d) { return x(d.year);  })
    .attr("cy", function(d) { return y(d.death);  })
    .attr("r", 4)
    .style("stroke", "black")
     //.style("fill", function(d) { return colLightness(d.vol); })
     .style("fill", function(d) { return col(d.type); })
    .style("opacity", 0.5)
}

// var trendline = d3.svg.line()   
//     .x(function(d) { 
//         return x(d.year); 
//     })
//     .y(function(d) { 
//         return y(d.death); 
//     });
    
    // Scale the range of the data
    // x.domain(d3.extent(data, function(d) { 
    //     return d.year; 
    // }));
    // y.domain([0, d3.max(data, function(d) { 
    //     return d.death; 
    // })]);

    // Nest the entries by country
    var dataNest = d3.nest()
        .key(function(d) {
            return d.country;
        })
        .entries(data);

    // Loop through each country
    // dataNest.forEach(function(d,i) { 

    //     svg.append("path")
    //         .attr("class", "line")
    //         .style("stroke", function() { // Add the colours dynamically
    //             return d.color = color(d.key); })
    //         .attr("d", trendline(d.values));
    // });

    var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
        // .append("text")
         //  .attr("x", w)
         //  .attr("y", -6)
         //  .style("text-anchor", "end")
         //  .text("Price");

    var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
        // .append("text")
      // .attr("transform", "rotate(-90)")
      // .attr("y", 6)
      // .attr("dy", ".71em")
      // .style("text-anchor", "end")
      // .text("True Value");
});