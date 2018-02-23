// set width and height of chart and bars
var width = 1000, height = 400;
var barWidth = 25; 

// define function to scale width and height
var y = d3.scale.linear()
	.range([height, 0]);

d3.json("data.json", function(error, data) {

	// return error if problem
	if (error) {
		return alert(error);
	}
	else {

		// convert data to array of numbers
		data_array = [];
		for (var i = 0, n = Object.keys(data).length; i < n; i++) {
			data_array[i] = +data[i];
		};

		// 
		y.domain([0, d3.max(data_array, function(d) { return d; })]);

		// select class of the bar chart and set attributes
		var chart = d3.select(".chart")
		.attr("width", width)
		.attr("height", height);

		// join data with the bars of chart
		var bar = chart.selectAll('g')
			.data(data_array)
			.enter().append("g")
			.attr("transform", function(d, i) {return "translate(" + 1.5 * i * barWidth + ",0)"} );

		// create rectangles for bars
		bar.append("rect")
			.attr("y", function(d) { return y(d); })
			.attr("width", barWidth)
			.attr("height", function(d) { return height - y(d)});

		// add text to bars
		bar.append("text")
			.attr("x", barWidth / 2)
			.attr("y", function(d) { return y(d) + 3 })
			.attr("dy", ".75em")
			.text(function(d) { return d; });
	}
});