/**
* a linked view visualization consisting of two linked graphs is made
*
* Nadja van 't Hoff (11030720)
*/

// set width, height and margins
var width = 650, height = 350;
var margin = {top: 50, right: 150, bottom: 70, left: 60},
			inner_width = width - margin.left - margin.right,
			inner_height = height - margin.top - margin.bottom;

// define functions to scale width and height for the barchart
var y_bars = d3.scale.linear()
	.range([inner_height, 0]);
var x_bars = d3.scale.ordinal()
	.rangeRoundBands([0, inner_width], 0.2);

// create axes of the barchart
var y_axis_bars = d3.svg.axis()
	.scale(y_bars)
	.orient("left");
var x_axis_bars = d3.svg.axis()
	.scale(x_bars)
	.orient("bottom");

// define functions to scale width and height for the linegraph
var y = d3.scale.linear()
	.range([inner_height, 0]);
var x = d3.time.scale()
	.range([0, inner_width]);

// create axes of the linegraph
var x_axis = d3.svg.axis()
	.scale(x)
	.orient("bottom");
var	y_axis = d3.svg.axis()
	.scale(y)
	.orient("left");

var color = d3.scale.ordinal()
	.range(["#66c2a5", "#fc8d62", "#8da0cb"]);

var categories = ["young", "working", "elderly"];

window.onload = function() {

	// set attributes of the barchart
	var barchart = d3.select(".barchart")
		.attr("class", "barchart")
		.attr("width", width)
		.attr("height", height)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// set attributes of the linegraph
	var linegraph = d3.select(".linegraph")
		.attr("width", width)
		.attr("height", height)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// wait loading the figures until the data is loaded
	queue()
		.defer(d3.json, "barchart_data.json")
		.defer(d3.json, "linegraph_data.json")
		.await(make_figures);

	function make_figures(error, barchart_data, linegraph_data) {

		// return error if problem arrises
		if (error) {
			return alert(error);
		}

		// transpose the data into layers for the barchart
		var dataset = d3.layout.stack()(categories.map(function(value) {
			return barchart_data.map(function(d) {
				return {x: d.country, y: +d[value]};
			});
		}));

		// set the domains of the barchart
		var countries = dataset[0].map(function(d) { return d.x; }),
			total_countries = countries.length;
		x_bars.domain(countries);
		y_bars.domain([0, d3.max(dataset, function(d) { 
			return d3.max(d, function(d) { return d.y0 + d.y; }); }) 
		]);
		color.domain(categories);

		// add x axis to the barchart
		barchart.append("g")
			.attr("class", "x axis bars")
			.attr("transform", "translate(0," + inner_height + ")")
			.call(x_axis_bars);

		// add y axis to the barchart
		barchart.append("g")
			.attr("class", "y axis bars")
			.call(y_axis_bars)
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", - 40)
			.attr( "dy", ".71em")
			.style("text-anchor", "end")
			.text("Population in million people");

		// create groups for each series
		var groups = barchart.selectAll("barpart")
			.data(dataset)
			.enter().append("g")
			.attr("class", "barpart")
			.style("fill", function(d, i) { return color(i); });

		// create rectangles of the stacked barchart
		var rects = groups.selectAll("rect")
			.data(function(d) { return d; })
			.attr("class", "bar_rect")
			.enter().append("rect")
			.attr("x", function(d) { return x_bars(d.x); })
			.attr("y", function(d) { return y_bars(d.y0 + d.y); })
			.attr("height", function(d) { return y_bars(d.y0) - y_bars(d.y0 + d.y); })
			.attr("width", x_bars.rangeBand)
			.style("opacity", 0.7)

			// add interactivity to the bars
			.on("mouseover", function() {
				tooltip.style("display", null);
				d3.select(this).style("opacity", 1) 
			})
			.on("mouseout", function() { 
				tooltip.style("display", "none");
				d3.select(this).style("opacity", 0.7) 
			})
			.on("mousemove", function(d) {
				var xPosition = d3.mouse(this)[0] -  15;
				var yPosition = d3.mouse(this)[1] - 25;
				tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
				tooltip.select("text").text(d3.format(".2f")(d.y) + " million");
			})
			.on("click", function(d, i) {
				var name = countries[i];
				update_linegraph(eval(d.x), name);
				linegraph_values(name);
			});

		// create tooltip
		var tooltip = barchart.append("g")
			.attr("class", "tooltip1")
			.style("display", "none");

		tooltip.append("rect")
			.attr("width", 80)
			.attr("height", 20)
			.attr("fill", "white")
			.style("opacity", 0.5)
			.style('display', 'block');

		tooltip.append("text")
			.attr("x", 40)
			.attr("dy", "1.2em")
			.style("text-anchor", "middle")
			.attr("font-size", "12px")
			.attr("font-weight", "bold")
			.style('display', 'block');

		// update the chart when input field is changed
		$("input").change(function(){
			var selected_countries = [];
			for (var i = 0, n =countries.length; i < n; i++) {
				var country_checked = document.getElementById("checkbox" + i).checked;
				if (country_checked) {
					selected_countries.push(document.getElementsByClassName("dropdown-item")[i].id);
				};
			};

			// update barcharts
			groups.transition().style("opacity", "0").remove();
			update_barchart(selected_countries);
		});

		// add a legend to the barchart
		var legend = barchart.selectAll(".legend")
			.data(categories)
			.enter().append("g")
			.attr("class", "legend")
			.attr("transform", function(d, i) { return "translate(30," + i * 19 + ")"; });

		legend.append("rect")
			.attr("x", inner_width - 18)
			.attr("width", 18)
			.attr("height", 18)
			.style("fill", function(d, i) { return color(i); })
			.style("opacity", 0.7);

		legend.append("text")
			.attr("x", inner_width + 5)
			.attr("y", 9)
			.attr("dy", ".35em")
			.style("text-anchor", "start")
			.text(function(d, i) {
				switch (i) {
					case 0: return "Young population";
					case 1: return "Working force";
					case 2: return "Elderly population";
				}
			});

		// add the title of the barchart
		barchart.append("text")
			.attr("class", "title_")
			.attr("x", inner_width / 2)
			.attr("y", - margin.top / 1.5)
			.attr( "dy", ".71em")
			.style("text-anchor", "middle")
			.text("The composition of the population in 2013");

		// prepare data for the linegraph
		var bel = [], deu = [], dnk = [], fra = [], gbr = [], irl = [], lux = [], nld = [], 
			nor = [], swe = [];
		linegraph_data.forEach(function(d) {
			bel = d["BEL"];
			deu = d["DEU"];
			dnk = d["DNK"];
			fra = d["FRA"];
			gbr = d["GBR"];
			irl = d["IRL"];
			lux = d["LUX"];
			nld = d["NLD"];
			nor = d["NOR"];
			swe = d["SWE"];
		});

		// convert years to Javascript years
		var parseDate = d3.time.format("%Y").parse;
		var year = bel["year"];
		for (var i = 0, n = year.length; i < n; i++) {
			year[i] = parseDate(year[i])
		};

		// set data into easy-to-handle data structure
		var BEL = [bel["young"], bel["working"], bel["elderly"]];
		var DEU = [deu["young"], deu["working"], deu["elderly"]];
		var DNK = [dnk["young"], dnk["working"], dnk["elderly"]];
		var FRA = [fra["young"], fra["working"], fra["elderly"]];
		var GBR = [gbr["young"], gbr["working"], gbr["elderly"]];
		var IRL = [irl["young"], irl["working"], irl["elderly"]];
		var LUX = [lux["young"], lux["working"], lux["elderly"]];
		var NLD = [nld["young"], nld["working"], nld["elderly"]];
		var NOR = [nor["young"], nor["working"], nor["elderly"]];
		var SWE = [swe["young"], swe["working"], swe["elderly"]];

		// convert every value in data strings into number
		for (var i = 0, n1 = BEL.length; i < n1; i++){
			for (var j = 0, n2 = year.length; j < n2; j++){
				BEL[i][j] = +BEL[i][j];
				DEU[i][j] = +DEU[i][j];
				DNK[i][j] = +DNK[i][j];
				FRA[i][j] = +FRA[i][j];
				GBR[i][j] = +GBR[i][j];
				IRL[i][j] = +IRL[i][j];
				LUX[i][j] = +LUX[i][j];
				NLD[i][j] = +NLD[i][j];
				NOR[i][j] = +NOR[i][j];
				SWE[i][j] = +SWE[i][j];
			}
		};

		// define function to draw the lines
		var line = d3.svg.line()
			.interpolate("basis")
			.x(function(d, i) { return x(year[i]); })
			.y(function(d) { return y(d); });

		// define the domains of the data values
		x.domain([year[0], year[(year.length - 1)]]);
		var domain_values = y_domain(NLD, year);
		y.domain([(domain_values[0] - 1), (domain_values[1] + 1)]);

		// add the x axis of the line graph
		linegraph.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + inner_height + ")")
			.call(x_axis);

		// add the y axis of the line graph
		linegraph.append("g")
			.attr("class", "y axis")
			.call(y_axis)
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", - 40)
			.attr( "dy", ".71em")
			.style("text-anchor", "end")
			.text("Percentage of total population");
			
		// join data with the elements
		var graph = linegraph.selectAll(".graph")
			.data(NLD)
			.attr("class", "graph")

		// draw the lines
		graph.enter().append("g")
			.append("path")
			.attr("class", "line")
			.attr("d", function(d) { return line(d); })
			.style("fill", "none")
			.style("stroke-width", 3)
			.style("stroke", function(d, i) {return color(i); });

		// add interactivity with data values of the linegraph
		linegraph_values("NLD");

		// add legend to the linegraph
		var legend_linegraph = linegraph.selectAll(".legend")
			.data(categories)
			.enter().append("g")
			.attr("class", "legend")
			.attr("transform", function(d, i) { return "translate(30," + i * 19 + ")"; });

		legend_linegraph.append("rect")
			.attr("x", inner_width - 18)
			.attr("width", 18)
			.attr("height", 18)
			.style("fill", function(d, i) { return color(i); })
			.style("opacity", 0.7);

		legend_linegraph.append("text")
			.attr("x", inner_width + 5)
			.attr("y", 9)
			.attr("dy", ".35em")
			.style("text-anchor", "start")
			.text(function(d, i) {
				switch (i) {
					case 0: return "Young population";
					case 1: return "Working force";
					case 2: return "Elderly population";
				}
			});

		// add the title of the linechart
		linegraph.append("text")
			.attr("class", "title_")
			.attr("x", inner_width / 2)
			.attr("y", - margin.top / 1.5)
			.attr( "dy", ".71em")
			.style("text-anchor", "middle")
			.text("Development of the composition of the population in NLD");

		/**
		* updates the barchart according to the user-chosen countries
		*/
		function update_barchart(countries) {

			// only use selected countries in the barchart
			var selected_dataset = [];
			for (var i = 0, n = categories.length; i < n; i++) {
				var data_array = [];
				for (var j = 0, n2 = total_countries; j < n2; j++) {
					var country_check = countries.includes((dataset[i][j.toString()]).x);

					// country is added to the used data if it is selected 
					if (country_check) {
						data_array.push(dataset[i][j.toString()]);
					};
				};
				selected_dataset.push(data_array);
			};

			// define the domains of the data values
			x_bars.rangeRoundBands([0, inner_width], Math.max(0.2, 0.9 - (countries.length * 0.1)))
				.domain(countries);
			y_bars.domain([0, d3.max(selected_dataset, function(d) { 
				return d3.max(d, function(d) { return d.y0 + d.y; }); }) 
			]);

			// update x axis
			barchart.selectAll(".x.axis.bars")
				.call(x_axis_bars);

			// update y axis
			barchart.selectAll(".y.axis.bars")
				.call(y_axis_bars);

			d3.selectAll("rect.bar_rect").transition().style("opacity", "0").remove();

			// create groups for each series
			var groups = barchart.selectAll("barpart")
				.data(selected_dataset)
				.enter().append("g")
				.attr("class", "barpart")
				.style("fill", function(d, i) { return color(i); });

			// recreate tooltip
			var tooltip = barchart.append("g")
				.attr("class", "tooltip1")
				.style("display", "none");

			tooltip.append("rect")
				.attr("width", 80)
				.attr("height", 20)
				.attr("fill", "white")
				.style("opacity", 0.5)
				.style('display', 'block');

			tooltip.append("text")
				.attr("x", 40)
				.attr("dy", "1.2em")
				.style("text-anchor", "middle")
				.attr("font-size", "12px")
				.attr("font-weight", "bold")
				.style('display', 'block');

			// create rectangles of the stacked barchart
			var rects = groups.selectAll("rect")
				.data(function(d) { return d; })
				.enter().append("rect")
				.attr("class", "bar_rect");

			rects.attr("x", function(d) { return x_bars(d.x); })
				.attr("y", function(d) { return y_bars(d.y0 + d.y); })
				.attr("height", function(d) { return y_bars(d.y0) - y_bars(d.y0 + d.y); })
				.attr("width", x_bars.rangeBand)
				.style("opacity", 0.7)

				// add interactivity
				.on("mouseover", function() {
					tooltip.style("display", null);
					d3.select(this).style("opacity", 1) 
				})
				.on("mouseout", function() { 
					tooltip.style("display", "none");
					d3.select(this).style("opacity", 0.7) 
				})
				.on("mousemove", function(d) {
					var xPosition = d3.mouse(this)[0] -  15;
					var yPosition = d3.mouse(this)[1] - 25;
					tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
					tooltip.select("text").text(d3.format(".2f")(d.y) + " million");
				})
				.on("click", function(d, i) {
					var name = countries[i];
					update_linegraph(eval(d.x), name);
					linegraph_values(name);
				});
		};

		function update_linegraph(country, name) {

			// determine domain of y
			var domain_values = y_domain(country, year);

			// define the domains of the data values
			y.domain([(domain_values[0] - 1), (domain_values[1] + 1)]);

			d3.selectAll("path.line").remove();

			// join new data with old elements, if any
			var graph = linegraph.selectAll(".line")
				.data(country)
				.attr("class", "graph")

			// apply operations to both entered elements and update selection
			graph.enter().append("g")
				.append("path")
				.attr("class", "line")
				.transition()
				.attr("d", function(d) { return line(d); })
				.style("fill", "none")
				.style("stroke-width", 3)
				.style("stroke", function(d, i) {return color(i); });

			// change the y axis
			linegraph.selectAll(".y.axis")
				.transition()
				.call(yAxis)

			// change title
			linegraph.select(".title_")
				.text("Development of the composition of the population in " + name);
		};

		function linegraph_values(country) {

			// add a group for the interactive effects
			var mouse_g = linegraph.append("g")
				.attr("class", "mouse-over-effects_" + country)

			// add data for the graph
			var mouse_per_line = mouse_g.selectAll(".mouse-per-line_" + country)
				.data(eval(country))
				.enter().append("g")
				.attr("class", "mouse-per-line_" + country);

			// initiate text to show the data values
			mouse_per_line.append("text")
				.attr("class", "texts_" + country)
				.style("stroke", "LightSlateGrey")
				.style("opacity", "0");

			// initiate the circles on the graphs at data values
			mouse_per_line.append("circle")
				.attr("class", "circles_" + country)
				.attr("r", 5)
				.style("stroke", "LightSlateGrey")
				.style("fill", "none")
				.style("stroke-width", "1px")
				.style("opacity", "0");

			// append a rect to catch mouse movements on canvas
			mouse_g.append("linegraph:rect")
				.attr("width", inner_width)
				.attr("height", inner_height)
				.attr("fill", "none")
				.attr("pointer-events", "all")

			// on mouse out hide line, circles and text
				.on("mouseout", function () {
					d3.selectAll(".circles_" + country).style("opacity", "0");
					d3.selectAll(".texts_" + country).style("opacity", "0");
				})

			// show line, circles and text
				.on("mouseover", function () {
					d3.selectAll(".circles_" + country).style("opacity", "1");
					d3.selectAll(".texts_" + country).style("opacity", "1");
				})

			// define properties for mouse moving over canvas
				.on("mousemove", function() {
					var mouse = d3.mouse(this);

					// find position of circles and text
					d3.selectAll(".mouse-per-line_" + country)
						.attr("transform", function(d, i) {
							var xDate = x.invert(mouse[0]),
								bisect = d3.bisector(function(h) { return h; }).right;
								idx = bisect(year, xDate);

							// save data of where the mouse is
							var y_values = [(eval(country)[0][idx]).toFixed(2), (eval(country)[1][idx]).toFixed(2), 
								(eval(country)[2][idx]).toFixed(2)],
								x_value = year[idx];

							// set position of the circles
							d3.selectAll(".circles_" + country)
								.data(y_values)
								.attr("cx", x(x_value))
								.attr("cy", function(d, i) { return y(d); });

							// set position of text and add data value as text
							d3.selectAll(".texts_" + country)
								.data(y_values)
								.attr("x", function(d, i) { 
									if (i == 0) {
										return x(x_value) - 40; 
									};
									return x(x_value) + 8; 
								})
								.attr("y", function(d, i) { return y(d); })
								.text(function(d) { return d; });
						});
				});
		};
	};
};

		
function y_domain(country, year) {
			
	// determine domain of y
	var value = 0, minimum = 0, maximum = 0;
	for (var i = 0, n1 = country.length; i < n1; i++){
		for (var j = 0, n2 = year.length; j < n2; j++){
			value = country[i][j];
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
		};
	};
	return [minimum, maximum];
};