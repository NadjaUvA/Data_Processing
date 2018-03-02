// set width and height of scatterplot
var width = 700, height = 450;
var margin = {top: 60, right: 40, bottom: 40, left: 70},
			inner_width = width - margin.left - margin.right,
			inner_height = height - margin.top - margin.bottom;

// define functions to scale width and height
var y = d3.scale.linear()
	.range([inner_height, 0]);
var x = d3.scale.linear()
	.range([0, inner_width]);
var z = d3.scale.ordinal()
	.range(["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494"]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
	.scale(x)
	.orient("bottom");

var yAxis = d3.svg.axis()
	.scale(y)
	.orient("left");

d3.json("hpidata.json", function(error, data) {

	// return error if problem
	if (error) {
		return alert(error);
	}

	// convert data to array of numbers
	var data_array = [], count = 0;
	data.forEach(function(d) {
		d["life_exp"] = +d["life_exp"];
		d["footprint"] = +d["footprint"];
		d["gdp"] = +d["gdp"] / 1000;
		data_array[count] = d;
		count++;
	});
	var countries = d3.map(data_array, function(d) { return d.region; } ).keys();

	// define domain of data values
	x.domain([0, d3.max(data_array, function(d) { return d.gdp; } )]);
	y.domain([-2 + d3.min(data_array, function(d) { return d.life_exp; } ), 
		d3.max(data_array, function(d) { return d.life_exp + 5; } )]);
	z.domain(countries);

	// add title
	d3.select(".scatterplot").append("text")
	.attr("class", "title_")
	.attr("y", margin.top / 2)
	.attr("x", width / 2)
	.style("text-anchor", "middle")
	.text("The relationship of life expectancy, GDP and ecological footprint per country (2016)");

	// select class of the bar chart and set attributes
	var scatterplot = d3.select(".scatterplot")
		.attr("width", width)
		.attr("height", height)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	scatterplot.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + inner_height + ")")
		.call(xAxis)
		.append("text")
		.attr("class", "label")
		.attr("x", inner_width)
		.attr("y", 33)
		.style("text-anchor", "end")
		.text("GDP per capita in $PPP/1000");

	scatterplot.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("class", "label")
		.attr("transform", "rotate(-90)")
		.attr("y", -38)
		.attr( "dy", ".71em")
		.style("text-anchor", "end")
		.text("Life expectancy in years");

	// Define the div for the tooltip
	var div = d3.select(".container").append("div")	
    	.attr("class", "tooltip")				
    	.style("opacity", 0);

	scatterplot.selectAll(".dot")
		.data(data)
		.enter().append("circle")
		.attr("class", "dot")
		.attr("r", function(d) { return d.footprint; })
		.attr("cx", function(d) { return x(d.gdp); })
		.attr("cy", function(d) { return y(d.life_exp); })
		.style("fill", function(d) { return z(d.region); })
		.on("mouseover", function(d) {	
            div.transition()		
                .duration(200)		
                .style("opacity", .9)
                .style("font-weight", "bold");	
            div	.html("Country: " + d.country + "<br/> GDP per capita: " 
            	+ d.gdp.toFixed(2) * 1000 + " $PPP <br/> Life expectancy: " 
            	+ d.life_exp + " years <br/> Ecological Footprint: " + d.footprint)
            })					
        .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0) });

	// select class of the bar chart and set attributes
	var legend = scatterplot.append("g").attr("class", "legend");

	// make rectangles and set colors
	legend.selectAll("rect")
		.data(d3.map(data_array, function(d) { return d.region; } ).keys())
		.enter().append("rect")
		.attr("width", 7)
	    .attr("height", 7)
	    .attr("x", 443)
	    .attr("y", function(d, i) { return i * 16 + 190; })
	    .style("fill", function(d) { return z(d); })
	    .style("stroke", "#000");

	legend.selectAll("circle")
		.data([1, 5, 10])
		.enter().append("circle")
		.attr("class", "circle_legend")
		.attr("r", function(d) { return d; })
		.attr("cx", 446.5)
		.attr("cy", function(d, i) { return (d + i) * 3 + 287; });
	
	// add text to rectangles and circles
	legend.selectAll("text")
		.data(countries.concat(["Ecological footprint of 1", 
			"Ecological footprint of 5", "Ecological footprint of 10"]))
		.enter().append("text")
		.attr("x", 459)
		.attr("y", function(d, i) { return i * 16 + 193; })
		.attr("dy", ".35em")
		.text(function(d, i) { return d; });
});