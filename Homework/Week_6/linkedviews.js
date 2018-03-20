window.onload = function() {

	// set width, height and margins of line graph
	var width = 900, height = 400;
	var margin = {top: 40, right: 150, bottom: 40, left: 150},
				inner_width = width - margin.left - margin.right,
				inner_height = height - margin.top - margin.bottom;

	var y_bars = d3.scale.linear()
		.range([inner_height, 0]);
	var x_bars = d3.scale.ordinal()
		.rangeRoundBands([0, inner_width], 0.2);
	var color = d3.scale.ordinal()
		.range(["#66c2a5", "#fc8d62", "#8da0cb"]);

	var yAxis_bars = d3.svg.axis()
		.scale(y_bars)
		.orient("left");
	var xAxis_bars = d3.svg.axis()
		.scale(x_bars)
		.orient("bottom");

	// define functions to scale width, height and colors of line graph
	var y = d3.scale.linear()
		.range([inner_height, 0]);
	var x = d3.time.scale()
		.range([0, inner_width]);
	var colors = d3.scale.ordinal()
		.range(["#fc8d62", "#8da0cb", "#66c2a5"]);

	// create axes of line graph
	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");
	var	yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

	// set attributes of the barchart
	var barchart = d3.select(".barchart")
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

		var categories = ["young", "working", "elderly"];

		// transpose the data into layers
		var dataset = d3.layout.stack()(categories.map(function(value) {
			return barchart_data.map(function(d) {
				return {x: d.country, y: +d[value]};
			});
		}));
		
		// set the domains of the barchart
		var countries = dataset[0].map(function(d) { return d.x; });
		x_bars.domain(countries);
		y_bars.domain([0, d3.max(dataset, function(d) { 
			return d3.max(d, function(d) { return d.y0 + d.y; }); }) 
		]);
		color.domain(countries);

		// add x axis
		barchart.append("g")
			.attr("class", "x axis bars")
			.attr("transform", "translate(0," + inner_height + ")")
			.call(xAxis_bars);

		// add y axis
		barchart.append("g")
			.attr("class", "y axis bars")
			.call(yAxis_bars)
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", - 40)
			.attr( "dy", ".71em")
			.style("text-anchor", "end")
			.text("Population in million people");

		var groups = barchart.selectAll("barpart")
			.data(dataset)
			.enter().append("g")
			.attr("class", "barpart")
			.style("fill", function(d, i) { return color(i); });

		// create rectangles of the stacked barchart
		var rect = groups.selectAll("rect")
			.data(function(d) { return d; })
			.enter().append("rect")
			.attr("x", function(d) { return x_bars(d.x); })
			.attr("y", function(d) { return y_bars(d.y0 + d.y); })
			.attr("height", function(d) { return y_bars(d.y0) - y_bars(d.y0 + d.y); })
			.attr("width", x_bars.rangeBand)
			.style("opacity", 0.7)
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
			});

		// create tooltip
		var tooltip = barchart.append("g")
			.attr("class", "tooltip")
			.style("display", "none");

		tooltip.append("rect")
			.attr("width", 80)
			.attr("height", 20)
			.attr("fill", "white")
			.style("opacity", 0.5);

		tooltip.append("text")
			.attr("x", 40)
			.attr("dy", "1.2em")
			.style("text-anchor", "middle")
			.attr("font-size", "12px")
			.attr("font-weight", "bold");

		// add legend to the barchart
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

		// add the title of the plot
		barchart.append("text")
			.attr("class", "title_")
			.attr("transform", "rotate(-90)")
			.attr("x", - inner_height / 2)
			.attr("y", - margin.left / 1.5)
			.attr( "dy", ".71em")
			.style("text-anchor", "middle")
			.text("The composition of the population in 2013");

		// prepare data for linegraph
		var bel = [], deu = [], dnk = [], fra = [], gbr = [], lux = [], nld = [], 
			nor = [], swe = [];
		linegraph_data.forEach(function(d) {
			console.log(d);
			bel = d["BEL"];
			deu = d["DEU"];
			dnk = d["DNK"];
			fra = d["FRA"];
			gbr = d["GBR"];
			lux = d["LUX"];
			nld = d["NLD"];
			nor = d["NOR"];
			swe = d["SWE"];
		});

		// convert dates to Javascript dates
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
				LUX[i][j] = +LUX[i][j];
				NLD[i][j] = +NLD[i][j];
				NOR[i][j] = +NOR[i][j];
				SWE[i][j] = +SWE[i][j];
			}
		};

		// add the title of the plot
		linegraph.append("text")
			.attr("class", "title_")
			.attr("transform", "rotate(-90)")
			.attr("x", - inner_height / 2)
			.attr("y", - margin.left / 1.5)
			.attr( "dy", ".71em")
			.style("text-anchor", "middle")
			.text("Development of the composition of the population");

		// define function to draw lines
		var line = d3.svg.line()
			.interpolate("basis")
			.x(function(d, i) { return x(year[i]); })
			.y(function(d) { return y(d); });

		function update_linegraph(country) {

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
				}
			};

			// define the domains of the data values
			x.domain([year[0], year[(year.length - 1)]]);
			y.domain([(minimum - 1), (maximum + 1)]);
			colors.domain(categories);

			// add the x-axis of the line graph
			linegraph.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + inner_height + ")")
				.call(xAxis);

			// add the y-axis of the line graph
			linegraph.append("g")
				.attr("class", "y axis")
				.call(yAxis)
				.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", - 40)
				.attr( "dy", ".71em")
				.style("text-anchor", "end")
				.text("Percentage of total population");
			
			// join new data with old elements, if any
			var graphs = linegraph.selectAll(".graphs")
				.data(country)

			// update old elements as needed
			graphs.attr("class", "update")

			// apply operations to both entered elements and update selection
			graphs.enter().append("g")
				.attr("class", "enter")
				.append("path")
				.attr("d", function(d) { return line(d); })
				.style("fill", "none")
				.style("stroke-width", 3)
				.style("stroke", function(d, i) {return colors(i); });
		};

		update_linegraph(DEU);

	};

};