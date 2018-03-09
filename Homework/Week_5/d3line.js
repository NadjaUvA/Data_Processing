// set width, height and margins of scatterplot
var width = 800, height = 550;
var margin = {top: 70, right: 90, bottom: 70, left: 90},
			inner_width = width - margin.left - margin.right,
			inner_height = height - margin.top - margin.bottom;

// define functions to scale width, height and colors
var y = d3.scale.linear()
	.range([inner_height, 0]);
var x = d3.time.scale()
	.range([0, inner_width]);
var color = d3.scale.category10();

// create axes
var xAxis = d3.svg.axis()
	.scale(x)
	.orient("bottom");
var yAxis = d3.svg.axis()
	.scale(y)
	.orient("left");

d3.json("unempdata_us_can.json", function(error, data) {

	// return error if problem arrises
	if (error) {
		return alert(error);
	}

	// select the two years from the data object
	var usa = [], canada = [];
	data.forEach(function(d) {
		usa = d["usa"];
		canada = d["canada"];
	});

	var parseDate = d3.time.format("%Y-%m").parse;
	var date = usa["date_usa"];
	for (var i = 0, n = date.length; i < n; i++) {
		date[i] = parseDate(date[i]);
	};

	var datalist_usa = [usa["men_usa"], usa["women_usa"], usa["youthmen_usa"], 
		usa["youthwomen_usa"]]; 
	var datalist_canada = [canada["men_canada"], canada["women_canada"], 
		canada["youthmen_canada"], canada["youthwomen_canada"]];

	var value = 0, minimum = 0, maximum = 0;
	for (var i = 0, n1 = datalist_usa.length; i < n1; i++){
		for (var j = 0, n2 = date.length; j < n2; j++){
			value = datalist_usa[i][j];
			value = +value;

			// keep track of maximum and minimum y-value for domain of y
			if (minimum == 0 && maximum == 0) {
				minimum = value;
				maximum = value;
			}
			else if (value < minimum) { 
				minimum = value;
			}
			else if (value > maximum) {
				maximum = value;
			}
		}
	};

	// define the domains of the data values
	x.domain([date[0], date[date.length - 1]]);
	y.domain([(minimum - 1), (maximum + 1)]);
	color.domain(d3.map(usa, function(d) { return d.usa; } ).keys(),
		d3.map(canada, function(d) { return d.canada; } ).keys());

	// set attributes of the plot
	var d3line = d3.select(".d3line")
		.attr("width", width)
		.attr("height", height)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	// add x-axis
	d3line.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + inner_height + ")")
		.call(xAxis)
		.append("text")
		.attr("class", "label")
		.attr("x", inner_width)
		.attr("y", 33)
		.style("text-anchor", "end")
		.text("Time in years");

	// add y-axis
	d3line.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("class", "label")
		.attr("transform", "rotate(-90)")
		.attr("y", - 40)
		.attr( "dy", ".71em")
		.style("text-anchor", "end")
		.text("Unemployment in % of labor force");

	// add the title of the plot
	d3line.append("text")
		.attr("class", "title_")
		.attr("y", - margin.top / 2)
		.attr("x", inner_width / 2)
		.style("text-anchor", "middle")
		.text("The unemployment rate in the USA and Canada");

	var legend = d3line.append("g")
		.attr("class", "legend");

	// create the colored lines in the legend
	legend.selectAll("line")
		.data(datalist_usa)
		.enter().append("line")
		.attr("x1", inner_width - margin.right)
	    .attr("y1", function(d, i) { return margin.top / 2 + i * 15; })
	    .attr("x2", inner_width - margin.right - 15)
	    .attr("y2", function(d, i) { return margin.top / 2 + i * 15; })
	    .style("stroke", function(d, i) { return color(i); })
	    .style("fill", "none");
	
	// add text to the rectangles and circles of the legend
	legend.selectAll("text")
		.data(["Rate of men", "Rate of women", 
			"Rate of young men", "Rate of young women"])
		.enter().append("text")
		.attr("x", inner_width - margin.right + 5)
		.attr("y", function(d, i) { return margin.top / 2 + i * 15; })
		.attr("dy", ".35em")
		.text(function(d, i) { return d; });

	var line = d3.svg.line()
		.interpolate("basis")
		.x(function(d, i) { return x(date[i]); })
		.y(function(d) { return y(d); });

	// add lines for usa
	var rate_usa = d3line.selectAll(".rate_usa")
		.data(datalist_usa)
		.enter().append("g")
		.attr("class", "rate_usa");

	rate_usa.append("path")
		.attr("class", "line_usa")
		.attr("d", function(d) { return line(d); })
		.style("fill", "none")
		.style("opacity", "1")
		.style("stroke", function(d, i) { return color(i); });

	// add lines for canada
	var rate_canada = d3line.selectAll(".rate_canada")
		.data(datalist_canada)
		.enter().append("g")
		.attr("class", "rate_canada");

	rate_canada.append("path")
		.attr("class", "line_canada")
		.attr("d", function(d) { return line(d); })
		.style("fill", "none")
		.style("opacity", "0")
		.style("stroke", function(d, i) { return color(i); });

	// add interactivity
	interactive_values("usa");

	d3.selectAll(".m")
		.on("click", function() { 
			var country = this.getAttribute("value");

			var str;
			if (country == "usa") {
				d3.selectAll(".line_canada")
					.transition.delay(750)
					.style("opacity", "0");
				d3.selectAll(".line_usa")
					.transition.delay(750)
					.style("opacity", "1");
				d3.selectAll(".mouse-over-effects_canada").remove();
				interactive_values(country)
			}
			else if (country == "canada") {
				var canada = "canada";
				d3.selectAll(".line_" + canada)
					.transition.delay(750)
					.style("opacity", "1");
				d3.selectAll(".line_usa")
					.transition.delay(750)
					.style("opacity", "0");
				d3.selectAll(".mouse-over-effects_usa").remove();
				interactive_values(country);
			}
		});

	function interactive_values(country) {

		var mouseG = d3line.append("g")
			.attr("class", "mouse-over-effects_" + country);

		// black vertical line following the mouse
		mouseG.append("path")
			.attr("class", "mouse-line_" + country)
			.style("stroke", "black")
			.style("stroke-width", "1px")
			.style("opacity", "0");

		var lines = document.getElementsByClassName("line_" + country);
		
		if (country == "canada") {
			var mousePerLine = mouseG.selectAll(".mouse-per-line_" + country)
			.data(datalist_canada)
			.enter().append("g")
			.attr("class", "mouse-per-line_" + country);
		}
		else {
			var mousePerLine = mouseG.selectAll(".mouse-per-line_" + country)
				.data(datalist_usa)
				.enter().append("g")
				.attr("class", "mouse-per-line_" + country);
		};		

		mousePerLine.append("text")
			.attr("class", "texts_" + country)
			.style("stroke", function(d, i) { return color(i); })
			.style("opacity", "0");

		mousePerLine.append("circle")
			.attr("class", "circles_" + country)
			.attr("r", 5)
			.style("stroke", function(d, i) { return color(i); })
			.style("fill", "none")
			.style("stroke-width", "1px")
			.style("opacity", "0");

		// append a rect to catch mouse movements on canvas
		mouseG.append("d3line:rect")
			.attr("width", inner_width)
			.attr("height", inner_height)
			.attr("fill", "none")
			.attr("pointer-events", "all")
			.on("mouseout", function () {
				d3.select(".mouse-line_" + country).style("opacity", "0");
				d3.selectAll(".circles_" + country).style("opacity", "0");
				d3.selectAll(".texts_" + country).style("opacity", "0");
			})
			.on("mouseover", function () {
				d3.select(".mouse-line_" + country).style("opacity", "1");
				d3.selectAll(".circles_" + country).style("opacity", "1");
				d3.selectAll(".texts_" + country).style("opacity", "1");
			})
			.on("mousemove", function() {
				var mouse = d3.mouse(this);
				d3.select(".mouse-line_" + country)
					.attr("d", function() {
						var d = "M" + mouse[0] + "," + inner_height;
						d += " " + mouse[0] + "," + 0;
						return d;
					});

				d3.selectAll(".mouse-per-line_" + country)
					.attr("transform", function(d, i) {
						var xDate = x.invert(mouse[0]),
							bisect = d3.bisector(function(h) { return h; }).right;
							idx = bisect(date, xDate);

						if (country == "usa") {
							var y_values = [datalist_usa[0][idx], datalist_usa[1][idx], 
							datalist_usa[2][idx], datalist_usa[3][idx]]
						}
						else {
							var y_values = [datalist_canada[0][idx], datalist_canada[1][idx], 
							datalist_canada[2][idx], datalist_canada[3][idx]]
						}
						var x_value = date[idx];

						d3.selectAll(".circles_" + country)
							.data(y_values)
							.attr("cx", x(x_value))
							.attr("cy", function(d) { return y(d); })
							.style("opacity", "1");					
						
						d3.selectAll(".texts_" + country)
							.data(y_values)
							.attr("x", x(x_value) + 3)
							.attr("y", function(d, i) { return y(d); })
							.style("opacity", "1")
							.text(function(d) { return d; });
					});
			});
	};

});