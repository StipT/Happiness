function BarChart(id, data, country) {

    var margin = { top: 20, right: 20, bottom: 30, left: 40 },
        width = 900 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // set the ranges
    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);
    var y = d3.scaleLinear()
        .range([height, 0]);

    var color = d3.scaleLinear()
        .range(['#0B3954', '#E0FF4F'])
        .domain([2, 8]);

    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
document.getElementById("footer_graph").innerHTML = "";
    var svg = d3.select(id).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", width + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    // get the data
    d3.json("data", function (error, dataSource) {
        if (error) throw error;

        // Scale the range of the data in the domains
        x.domain(data.map(function (d) {
            return d.rank;
        }));
        y.domain([0, 10]);

        var bars = svg.selectAll(".bar")
            .data(data)

        // append the rectangles for the bar chart
        bars
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function (d) { return x(d.rank); })
            .attr("width", x.bandwidth())
            .attr("y", function (d) { return y(d.rating); })
            .attr("height", function (d) { return height - y(d.rating); })
            .style("fill", function (d) {
                if (country == d.country) return "#FF6663";
                return color(d.rating);
            })
            .on("mousemove", function (d) {
                tooltip
                    .style("left", d3.event.pageX + 15 + "px")
                    .style("top", d3.event.pageY - 35 + "px")
                    .style("display", "inline-block")
                    .html("#" + (d.rank) + "  " + (d.country) + "<br>" + d.rating);
            })
            .on("mouseout", function (d) {
                tooltip.style("display", "none")
            });

        bars.enter()
            .append('image')
            .attr("xlink:href", function (d) { return d.flag; })
            .attr("width", x.bandwidth())
            .attr("y", function (d) { return y(d.rating / 1.5) })
            .attr("x", function (d) { return x(d.rank); })
            .on("mousemove", function (d) {
                tooltip
                    .style("left", d3.event.pageX + 15 + "px")
                    .style("top", d3.event.pageY - 35 + "px")
                    .style("display", "inline-block")
                    .html("#" + (d.rank) + "  " + (d.country) + "<br>" + d.rating);
            })
            .on("mouseout", function (d) { tooltip.style("display", "none") });


        // add the x Axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .append("text")
            .style("fill", "grey")
            .attr("y", 40)
            .attr("x", width / 2)
            .text("World Happinesss Rank Neighbors")
            .style("font-size","22px");;

        // add the y Axis
        svg.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(y))
            .append("text")

            .attr("transform", "rotate(-90)")
            .style("fill", "grey")
            .attr("y", -width / 2)
            .attr("x", -height / 2)
            .text("Happiness Score");
    });
}