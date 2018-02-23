// set width and height of chart and bars
var barWidth = 25; 
var width = 550, height = 400;

var margin = {top: 70, right: 40, bottom: 60, left: 70},
			inner_width = width - margin.left - margin.right,
			inner_height = height - margin.top - margin.bottom;

// initiate array with months
var months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

// define functions to scale width and height
var y = d3.scale.linear()
	.range([inner_height, 0]);
var x = d3.scale.ordinal()
	.domain(months)
	.rangeBands([- 5, inner_width + 5]);

d3.json("data.json", function(error, data) {

	// return error if problem
	if (error) {
		return alert(error);
	}
	else {

		// convert data to array of numbers
		var data_array = [];
		for (var i = 0, n = Object.keys(data).length; i < n; i++) {
			data_array[i] = +data[months[i]];
		};

		// define domain of data values
		y.domain([0, d3.max(data_array, function(d) { return d; })]);

		// select class of the bar chart and set attributes
		var chart = d3.select(".chart")
		.attr("width", width)
		.attr("height", height)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// add title
		chart.append("text")
		.attr("id", "title_")
		.attr("y", - 30)
		.attr("x", inner_width / 2)
		.text("Average monthly rain in De Bilt")

		// join data with the bars of chart
		var bar = chart.selectAll("g")
			.data(data_array)
			.enter().append("g")
			.attr("transform", function(d, i) {return "translate(" + 1.5 * i * barWidth + "," + 0 + ")"} );

		// add text
		bar.append("text")
			.attr("class", "data_label")
			.attr("x", barWidth / 2)
			.attr("y", function(d) { return y(d) - 10 })
			.attr("dy", ".70em")
			.text(function(d) { return d; })

		// create rectangles for bars
		bar.append("rect")
			.attr("y", function(d) { return y(d); })
			.attr("width", barWidth)
			.attr("height", function(d) { return inner_height - y(d); })
			.on("mouseover", function(d) { 
				d3.select(this).style("fill", "DarkSlateBlue");
				d3.select("data_label").style("visibility", "visible");
			})
			.on("mouseout", function(d) { 
				d3.select(this).style("fill", "CadetBlue");
				d3.select("data_label").style("visibility", "hidden");
			});

		// initiate x axis settings
		var xAxis = d3.svg.axis()
			.scale(x)
			.tickPadding(5)
			.orient("bottom");

		// initiate x axis settings
		var yAxis = d3.svg.axis()
			.scale(y)
			.tickPadding(3)
			.orient("left");

		// add x-axes and labels
		d3.select(".chart").append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(" + margin.left + "," + (inner_height + margin.top) + ")")
			.call(xAxis)
			.append("text")
				.attr("class", "label")
				.attr("x", inner_width / 2)
				.attr("y", 45)
				.text("Year 2017");

		// add y-axes and labels
		d3.select(".chart").append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(" + (margin.left - 5) + "," + margin.top + ")")
			.call(yAxis)
			.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", - 60)
				.attr("x", - 160)
				.attr("dy", ".71em")
				.text("Average amount of rain in 0.1 mm");
	}
});