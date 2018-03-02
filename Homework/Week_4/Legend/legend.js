window.onload = function() {

	// set data
	data = [{value:"std. dev.", color:"none"}, {value:"0 < 1", color: "#ffffb2"}, {value:"1 < 2", color: "#fecc5c"}, {value:"2 < 3", color:"#fd8d3c"}, 
			{value:"3 < 4", color:"#f03b20"}, {value:"4 < 5", color: "#bd0026"}, {value:"no data", color:"silver"}];

	// set margins
	var margin = {top: 20, right: 20, bottom: 30, left: 40},
	    width = 300 - margin.left - margin.right,
	    height = 300 - margin.top - margin.bottom;

	// select class of the bar chart and set attributes
	var legend = d3.select(".legend")
		.attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	    .append("g");

	// make rectangles and set colors
	legend.selectAll("rect")
		.data(data)
		.enter().append("rect")
		.attr("width", 10)
	    .attr("height", 10)
	    .attr("x", margin.left)
	    .attr("y", function(d, i) { return i * 30 + 50 })
	    .style("fill", function(d, i) { return d.color });
	
	// add text to rectangles
	legend.selectAll("text")
		.data(data)
		.enter().append("text")
		.attr("x", margin.left + 20)
		.attr("y", function(d, i) { return i * 30 + 54 })
		.attr("dy", ".35em")
		.text(function(d, i) { return d.value; });
};