var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 80
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
//and shift the latter by left and top margins.
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenYAxis = "no_healthcare";
var chosenXAxis = "poverty";

// function used for updating y-scale var upon click on axis label
function yScale(censusData, chosenYAxis) {
  // create scales
 
  var yLinearScale = d3.scaleLinear()
    .domain([0,d3.max(censusData, d => d[chosenYAxis])])
    .range([height,0])
  
    return yLinearScale

};

// function used for updating x-scale var upon click on axis label
function xScale(censusData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
      d3.max(censusData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width])

  return xLinearScale

};

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale)

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis)

  return xAxis
}


// function used for updating yAxis var upon click on axis label
function renderAxes(newYScale,yAxis) {
  console.log("start render axes");
  var leftAxis = d3.axisLeft(newYScale)
    yAxis.transition()
    .duration(1000)
    .call(leftAxis)
    console.log(newYScale);
  return yAxis
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup,newYScale, chosenYaxis) {
console.log(chosenYaxis);
  circlesGroup.selectAll("circle")
 // circlesGroup.transition()
    .transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYaxis]))
   
    circlesGroup.selectAll("text")
    .transition()
    .duration(1000)
    .attr("y", d => newYScale(d[chosenYaxis]));
  return circlesGroup
};

function renderXCircles(circlesGroup, newXScale, chosenXaxis) {
  
  circlesGroup.selectAll("circle")
    .transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXaxis]))
  
  circlesGroup.selectAll("text")
    .transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXaxis])-10);
  return circlesGroup
};


// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis,chosenYAxis, circlesGroup) {
console.log(chosenXAxis);
  if (chosenYAxis == "no_healthcare") {
    var label = "Lack Healthcare:"
  } else {
    var label = "Obesity:"
  }
  if (chosenXAxis == "poverty") {
    var xlabel = "Poverty"
  } else {
    var xlabel = "Median: $"
  }
  
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function (d) {
      if (chosenXAxis == "poverty")
      return (`${d.state}<br>${label} ${d[chosenYAxis]}%<br>${xlabel} ${d[chosenXAxis]}%`);
      else
      return (`${d.state}<br>${label} ${d[chosenYAxis]}%<br>${xlabel} ${d[chosenXAxis]}`);
    });
	

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function (data) {
      toolTip.show(data);
    })
    // onmouseout event
    .on("mouseout", function (data, index) {
      toolTip.hide(data);
    });

  return circlesGroup
}

// Retrieve data from the CSV file and execute everything below
d3.csv("./data/data.csv", function (err, censusData) {
  if (err) throw err;

  // parse data
  censusData.forEach(function (data) {
    data.state = data.state;
    data.abbr = data.abbr;
    data.poverty = +data.poverty;
    data.obesity = +data.obesity;
    data.no_healthcare = +data.no_healthcare;
    data.household_income = +data.household_income;

  });

  // yLinearScale function above csv import
  var yLinearScale = yScale(censusData, chosenYAxis)
  var xLinearScale = xScale(censusData, chosenXAxis)


  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis)

  // append y axis
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis)

  // append initial circles
 

  var circlesGroup = chartGroup.selectAll(".node")
    .data(censusData)
    .enter().append("g")
    .attr("class", "node")
   
    circlesGroup.append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 15)
    .attr("fill", "blue")
    .attr("opacity", ".5")

  //append inital state abbr. to circles
    circlesGroup.filter(function(d) { return !d.children; }).append("text")
    .attr("font-size", "12px")
    .attr("fill", "white")
   // .attr("dy", "0.3em")
    .attr("x", d => xLinearScale(d[chosenXAxis])-10)
    .attr("y", d => yLinearScale(d[chosenYAxis])+3)
    .text(function(d){return d.abbr}) ;



  // Create group for  2 y- axis labels
  var labelsGroup = chartGroup.append("g")
      .attr("transform", "rotate(-90)");

  var nohealthcareLabel = labelsGroup.append("text")
    .attr("x", 0-(height / 2))
    .attr("y", 0 - margin.left+20)
    .attr("value", "no_healthcare") //value to grab for event listener
    .classed("active", true)
    .attr("dy", "1em")
    .attr("font-size", "16px")
    .style('fill', 'black')
    .text("Lacks Healthcare (%)");


  var obesityLabel = labelsGroup.append("text")
    .attr("x", 0-(height / 2))
    .attr("y", 0 - margin.left)
    .attr("value", "obesity") //value to grab for event listener
    .classed("inactive", true)
    .attr("dy", "1em")
    .style('fill', 'blue')
    .attr("font-size", "16px")
    .text("Obesity (%)");
    
    var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width/2}, ${height + 20})`);

    var povertyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") //value to grab for event listener
    .classed("active", true)
    .style('fill', 'black')
    .attr("font-size", "16px")
    .text("Poverty (%)");

  var incomeLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "household_income") //value to grab for event listener
    .classed("inactive", true)
    .style('fill', 'blue')
    .attr("font-size", "16px")
    .text("Household Income (Median) $");


  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis,chosenYAxis, circlesGroup)

  // y axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function () {
      // get value of selection
      var value = d3.select(this).attr("value")
      console.log(value);
      if (value != chosenYAxis) {

        // replaces chosenYAxis with value
        chosenYAxis = value;

        // console.log(chosenYAxis)

        // functions here found above csv import
        // updates y scale for new data
        yLinearScale = yScale(censusData, chosenYAxis);
        
        // updates y axis with transition
        yAxis = renderAxes(yLinearScale,yAxis);
     
        // updates circles with new y values
        circlesGroup = renderCircles(circlesGroup,yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis,chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenYAxis == "no_healthcare") {
          nohealthcareLabel
            .classed("active", true)
            .classed("inactive", false)
            .style('fill', 'black')
          obesityLabel
            .classed("active", false)
            .classed("inactive", true)
            .style('fill', 'blue')
        } else {
          nohealthcareLabel
            .classed("active", false)
            .classed("inactive", true)
            .style('fill', 'blue')
            obesityLabel
            .classed("active", true)
            .classed("inactive", false)
            .style('fill', 'black')
        };
      };
    });

    xlabelsGroup.selectAll("text")
    .on("click", function () {
      // get value of selection
      var value = d3.select(this).attr("value")
      console.log(value);
      if (value != chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;
        
        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(censusData, chosenXAxis);
        
        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderXCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis,chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis == "poverty") {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false)
            .style('fill', 'black')
          incomeLabel
            .classed("active", false)
            .classed("inactive", true)
            .style('fill', 'blue')
        } else {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true)
            .style('fill', 'blue')
          incomeLabel
            .classed("active", true)
            .classed("inactive", false)
            .style('fill', 'black')
        };
      };
    });

});
