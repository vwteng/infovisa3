var margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 50
};
var w = 960 - margin.left - margin.right;
var h = 500 - margin.top - margin.bottom;

var dataset; //to hold full dataset
var hi;
var lo;
d3.csv("aaa.csv", function(error, rates) {
    //read in the data
    if (error) return console.warn(error);
    rates.forEach(function(d) {
        d.year = d.year;
        d.death = +d.death;
    });
    dataset = rates;
    drawVis(dataset);
    $("#incomeamount").val("low" + " - " + "high");
});
var col = d3.scale.category20b();

var svg = d3.select("body").append("svg").attr("width", w + margin.left +
        margin.right).attr("height", h + margin.top + margin.bottom).append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var x = d3.scale.linear().domain([1958, 2014]).range([0, w]);
var y = d3.scale.linear().domain([0, 55]).range([h, 0]);
var tooltip = d3.select("body").append("div").attr("class", "tooltip").style(
    "opacity", 0);
var mytype = "all"; //keep track of currently selected type; default is all 
var patt = new RegExp("all");

function filterType(mtype) {
        mytype = mtype;
        var res = patt.test(mytype);
        if (res) {
            var toVisualize = dataset;
            filterData(lo, hi);
        } else {
            var toVisualize = dataset.filter(function(d) { //filter to only the selected type       
                return d["region"] == mytype;
                filterData(lo, hi);
            });
        }
        drawVis(toVisualize);
    }

function filterData(low, high) {
    var toVisualize = dataset.filter(function(d) {
        if ($("#myselectform").val() != "all") {
            return d.income >= low && d.income <= high && d.region ==
                $("#myselectform").val();
        } else {
            return d.income >= low && d.income <= high;
        }
    });
    d3.selectAll("circle").remove();
    drawVis(toVisualize);
}
document.getElementById("myselectform").onchange = function() {
    $("#mytype").val(this.value);
    filterType(this.value);
}
$(function() {
    $("#income").slider({
        range: true,
        min: 0,
        max: 3,
        values: [0, 3],
        slide: function(event, ui) {
            var range1;
            var range2;
            hi = ui.values[1];
            lo = ui.values[0];
            if (ui.values[0] == 0) {
                range1 = "low";
            } else if (ui.values[0] == 1) {
                range1 = "lower middle";
            } else if (ui.values[0] == 2) {
                range1 = "upper middle";
            } else if (ui.values[0] == 3) {
                range1 = "high";
            }
            if (ui.values[1] == 0) {
                range2 = "low";
            } else if (ui.values[1] == 1) {
                range2 = "lower middle";
            } else if (ui.values[1] == 2) {
                range2 = "upper middle";
            } else if (ui.values[1] == 3) {
                range2 = "high";
            }
            $("#incomeamount").val(range1 + " - " + range2);
            filterData(ui.values[0], ui.values[1]);
        }
    });
});

function drawVis(data) {
        // d3.selectAll("circle").remove();
        var circles = svg.selectAll("circle").data(data).enter().append(
                "circle").attr("cx", function(d) {
                return x(d.year);
            }).attr("cy", function(d) {
                return y(d.death);
            }).attr("r", 3).style("fill", function(d) {
                return col(d.country);
            }).style("opacity", 1)
            // circles.exit().remove();
            // circles.enter().append("circle")
            // .attr("cx", function(d) { return x(d.year);  })
            // .attr("cy", function(d) { return y(d.death);  })
            // .attr("r", 3)
            //  .style("fill", function(d) { return col(d.country); })
            // .style("opacity", 0.5)
            .on("mouseover", function(d) {
                tooltip.transition().duration(200).style("opacity", 1);
                tooltip.html("<b>" +d.country.toUpperCase()  + "<br>" + "CDR: </b>" + d.death + "<br>" + "<b>Region: </b>" + d.region +
                        "<br>" + "<b> Year: </b>" +d.year)
                    .style("left", "725px")
                    .style("top", "100px")
                    .style("text-align", "center").style("background-color",
                        "white").style("z-index", "1")
            }).on("mouseout", function(d) {
                tooltip.transition().duration(500).style("opacity", 0);
            });
    }
    // var line = d3.svg.line()
    //          .x(function(d,i) { 
    //            return x(i); 
    //          })
    //          .y(function(d) { 
    //            return y(d); 
    //          })
var xAxis = d3.svg.axis().scale(x).tickFormat(d3.format("d"));
svg.append("g").attr("class", "axis").attr("transform", "translate(0," + h +
        ")").call(xAxis)
        .append("text")
         .attr("x", w/2)
         .attr("y", 35)
         .style("text-anchor", "middle")
         .text("Year");
         
var yAxis = d3.svg.axis().scale(y).orient("left");
svg.append("g").attr("class", "axis").call(yAxis)
    .append("text")
     .attr("transform", "rotate(-90)")
     .attr("y", 6)
     .attr("dy", ".71em")
     .style("text-anchor", "end")
     .text("Crude Death Rate (Per 1,000 People)");
    //var path = svg.append("svg:path").attr("class","path").attr("clip-path", "url(#clip)").attr("d", line(dataset));
d3.select('select').on("change", function() {
    var key = mytype;
    d3.selectAll('circle').transition().duration(300).ease("quad").attr(
            'r', 3).attr('cx', function(d) {
            return x(d.year);
        }).attr('cy', function(d) {
            return y(d.death);
        })
        // if a data point is selected highlight other 
        // data points of the same color
        .style('fill', function(d) {
            if (key == "all") {
                return col(d.country)
            } else if (d.region == key) {
                return col(d.country)
            } else {
                return "#ccc"
            };
        }).style('opacity', function(d) {
            if (key == "all") {
                return 1
            } else if (d.region == key) {
                return 1
            } else {
                return 0
            };
        })
});

function resetSlider() {
    var $slider = $("#income");
    $slider.slider("values", 0, 0);
    $slider.slider("values", 3, 3);
    $("#incomeamount").val("low" + " - " + "high");
    $("#myselectform").val("all");
    drawVis(dataset);
}