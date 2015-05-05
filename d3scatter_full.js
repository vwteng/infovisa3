var margin = {top: 20, right: 20, bottom: 30, left: 50};
    var w = 960 - margin.left - margin.right;
    var h = 500 - margin.top - margin.bottom;

// var parseDate = d3.time.format("%Y").parse;

var dataset; //to hold full dataset

d3.csv("deathrates1_income.csv", function(error, rates) {
  //read in the data
  if (error) return console.warn(error);
     rates.forEach(function(d) {
        d.year = d.year;
        d.death = +d.death;
     });
   dataset=rates;
   drawVis(dataset);
});


var col = d3.scale.category20b();

var svg = d3.select("body").append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scale.linear()
        .domain([1958, 2014])
        .range([0, w]);

var y = d3.scale.linear()
        .domain([0, 55])
        .range([h, 0]);

var tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);


var mytype = "all"; //keep track of currently selected type; default is all 
var patt = new RegExp("all"); 

function filterType(mtype) {      
  mytype = mtype;       
  var res = patt.test(mytype);       
  if(res){  
    var toVisualize = dataset;  //use all the data       
  }else{            
    var toVisualize= dataset.filter(function(d, i) { //filter to only the selected type         
    return d["type"] == mytype;  
   });         
  }     
  drawVis(toVisualize); 
}

var attributes = ["year", "income"];
var ranges = [[0, 2014], [0, 3]];

function filterData(attr, values) {
  for (i = 0; i < attributes.length; i++) {
    if (attr == attributes[i]) { 
      ranges[i] = values;
    }
  }
  var toVisualize = dataset.filter(function(d) {
    for (i = 0; i < attributes.length; i++) {
      return d[attributes[i]] >= ranges[i][0] && d[attributes[i]] <= ranges[i][1];
    }
  });
  drawVis(toVisualize);
}

document.getElementById("myselectform").onchange = function(){ 
    $("#mytype").val(this.value);
    filterType(this.value);                  
  }

  $(function() {
    $("#income").slider({
      range: true,
      min: 0,
      max: 4,
      values: [0, 4],
      slide: function(event, ui) {
        $("#incomeamount").val(ui.values[0] + "-" + ui.values[1]);
        filterData("income", ui.values);
      }
    });
    // $("#incomeamount").val($("#vol").slider("values", 0) + "-" + $("#vol").slider("values", 1));
    //     filterData("income", ui.values);
  });


function drawVis(data) {
  var circles = svg.selectAll("circle")
   .data(data)
   .enter()
   .append("circle")
    .attr("cx", function(d) { return x(d.year);  })
    .attr("cy", function(d) { return y(d.death);  })
    .attr("r", 2)
    .style("fill", function(d) { return col(d.country); })
    .style("opacity", 0.5)

    // circles.exit().remove();

    // circles.enter().append("circle")
    // .attr("cx", function(d) { return x(d.year);  })
    // .attr("cy", function(d) { return y(d.death);  })
    // .attr("r", 3)
    //  .style("fill", function(d) { return col(d.country); })
    // .style("opacity", 0.5)

    .on("mouseover", function(d) {
      tooltip.transition()
        .duration(200)
        .style("opacity", 1);
      tooltip.html(d.country + "<br>" + d.death + "<br>" + d.region + "<br>" + d.income + "<br>" + d.year)
        // .style("left", (d3.event.pageX - 65) + "px")
        // .style("top", (d3.event.pageY - 80) + "px")
        .style("text-align", "center")
        .style("background-color", "gray")
        .style("z-index", "100")
    })
    .on("mouseout", function(d) {
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    });
}



var xAxis = d3.svg.axis()
    .scale(x)
    .tickFormat(d3.format("d"));

svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + h + ")")
    .call(xAxis)
     // .append("text")
     //  .attr("x", w)
     //  .attr("y", -6)
     //  .style("text-anchor", "end")
     //  .text("Price");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

svg.append("g")
   .attr("class", "axis")
   .call(yAxis)
      // .append("text")
      // .attr("transform", "rotate(-90)")
      // .attr("y", 6)
      // .attr("dy", ".71em")
      // .style("text-anchor", "end")
      // .text("True Value");


d3.select('select')
    .on("change", function() {

    var key = mytype;

    d3.selectAll('circle')
        .transition()
        .duration(300)
        .ease("quad")
        .attr( 'r', 2)
        .attr('cx', function(d) {return x(d.year);})
        .attr('cy', function(d) {return y(d.death);})

        // if a data point is selected highlight other 
        // data points of the same color
        .style('fill', function(d) { 
            if (key == "all") {
              return col(d.country)
            } else if (d.region == key){
              return col(d.country)
            }
            else {return "#ccc"}

        ;})


        .style('opacity', function(d) { 
            if (key == "all") {
              return .5
            } else if (d.region == key){
              return 1
            }
            else {return .2}
        ;})

});



