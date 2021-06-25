'use strict'
console.log("debut du js")
import * as helper from './scripts/helper.js'
import * as scales from './scripts/scales.js'
import * as viz from './scripts/viz.js'
import * as tooltip from './scripts/tooltip.js'
import * as legend from './scripts/legend.js'
import * as preproc from './scripts/preprocess.js'
//import datepicker from 'js-datepicker'
import d3Tip from 'd3-tip'

console.log("fin des import")


/*
const startDate = datepicker("#start-picker", 
	{ 	id: 1,
		minDate: new Date(2017, 1, 1),
		maxDate: new Date(2020, 11, 29),
		showAllDates: true,
		defaultView: 'overlay',
		overlayPlaceholder: '2017 - 2020',
		formatter: (input, date, instance) => {
			// This will display the date as `1/1/2019`.
			input.value = date.toDateString()
		},
		onSelect: instance => {
			console.log("Range " + instance.dateSelected) 
			document.getElementById("startDate").innerHTML = instance.dateSelected.toDateString();
		},
	})
const endDate = datepicker("#end-picker", 
	{ 	id: 1,
		minDate: new Date(2017, 1, 1),
		maxDate: new Date(2020, 11, 29),
		showAllDates: true,
		defaultView: 'overlay',
		overlayPlaceholder: '2017 - 2020',
		onSelect: instance => {
			console.log("Range " + instance.dateSelected) 
			document.getElementById("endDate").innerHTML = instance.dateSelected.toDateString();
		},
		formatter: (input, date, instance) => {
			// This will display the date as `1/1/2019`.
			input.value = date.toDateString()
		},
		overlayButton: 'Go!',
	})
*/
//startDate.setDate(new Date(2017, 0, 0), true)

//endDate.setDate(new Date(2020, 11, 30), true)

var margin = {top: 100, right: 200, bottom: 100, left: 125};
   
   	var width = 1260 - margin.left - margin.right,
    		height = 900 - margin.top - margin.bottom;
        
   	var svg = d3.select("body").append("svg")
    		.attr("width", width + margin.left + margin.right)
    		.attr("height", height + margin.top + margin.bottom)
    	.append("g")
    		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
    var cfg = {
      strokeWidth: 5
    };
    
    var colour = d3.scaleOrdinal(d3.schemeCategory20);
    
    // Use indexOf to fade in one by one
    var highlight = [];
    
    svg.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height + cfg.strokeWidth);
    
    var x = d3.scaleLinear()
    	.range([0, width]);
    
    var y = d3.scaleLinear()
    	.range([0, height]);
    
    var voronoi = d3.voronoi()
    	.x(d => x(d.year))
    	.y(d => y(d.rank))
    	.extent([[-margin.left / 2, -margin.top / 2], [width + margin.right / 2, height + margin.bottom / 2]]);
    
    var line = d3.line()
    	.x(d => x(d.year))
    	.y(d => y(d.rank))

    console.log("test")
    console.log("Data recupérée")
    
    d3.csv("test.csv", function(error, data) {
      if (error) throw error;
      
      var parsedData = [];
      data.forEach((d) => {
        var dObj = {department: d.department, ranks: []};
        for (var year in d) {
          if (year != "department") {
			dObj.ranks.push({year: year, rank: +d[year], department: dObj});
          }
        }
        parsedData.push(dObj);
      })
      console.log(parsedData);
      
      
      var xTickNo = parsedData[0].ranks.length;
      x.domain(d3.extent(parsedData[0].ranks, d => d.year));
      
      colour.domain(data.map(d => d.department));
      
      // Ranks
      var ranks = 20;
      y.domain([0.5, ranks]);
      
      var axisMargin = 20;
      var tickLabels = ['CAN', 'USA', 'JPN', 'KOR', 'FRC', 'GBR', 'ALG', 'BEL', 'BRZ' ]
      var xAxis = d3.axisTop(x)
        .tickFormat(function(d, i) {d3.format("d"); return tickLabels[i]})
      	.ticks(xTickNo)
      	.tickSize(0);
      
     	var yAxis = d3.axisLeft(y)
      	.ticks(ranks)
      	.tickSize(0);
      
      var xGroup = svg.append("g");
      var xAxisElem = xGroup.append("g")
      	.attr("transform", "translate(" + [0, axisMargin * -0.8] + ")")
      	.attr("class", "x-axis")
      	.call(xAxis);
      
      xGroup.append("g").selectAll("line")
      	.data(x.ticks(xTickNo))
      	.enter().append("line")
      		.attr("class", "grid-line")
      		.attr("y1", 0)
      		.attr("y2", height + 10)
      		.attr("x1", d => x(d))
      		.attr("x2", d => x(d));
      
      var yGroup = svg.append("g");
      var yAxisElem = yGroup.append("g")
      	.attr("transform", "translate(" + [-axisMargin, 0] + ")")
      	.attr("class", "y-axis")
      	.call(yAxis);
      yAxisElem.append("text")
      	.attr("class", "y-label")
      	.attr("text-anchor", "middle")
      	.attr("transform", "rotate(-90) translate(" + [-height / 2, -margin.left / 3] + ")")
      	.text("Spotify Country Ranking");
      
      yGroup.append("g").selectAll("line")
      	.data(y.ticks(ranks))
      	.enter().append("line")
      		.attr("class", "grid-line")
      		.attr("x1", 0)
      		.attr("x2", width)
      		.attr("y1", d => y(d))
      		.attr("y2", d => y(d));
      
      //var lines = 
	  svg.append("g")
      	.selectAll("path")
      	.data(parsedData)
      	.enter().append("path")
      		.attr("class", "rank-line")
      		.attr("d", function(d) { d.line = this; return line(d.ranks)})
      		.attr("clip-path", "url(#clip)")
      		.style("stroke", d => colour(d.department))
      		.style("stroke-width", cfg.strokeWidth)
      		.style("opacity", 0.1)
			  /*
      		.transition()
      			.duration(500)
      			.delay(d => (highlight.indexOf(d.department) + 1) * 500)*/
      		.style("opacity", 1);
      
      var endLabels = svg.append("g")
      	.attr("class", "end-labels")
      	.selectAll("text")
      	.data(parsedData)
      	.enter().append("text")
      		.attr("class", "end-label")
      		.attr("x", d => x(d.ranks[d.ranks.length - 1].year))
      		.attr("y", d => y(d.ranks[d.ranks.length - 1].rank))
      		.attr("dx", 20)
      		.attr("dy", cfg.strokeWidth / 2)
      		.text(d => d.department)
      		.style("opacity", 1)
      
      var endDots = svg.append("g")
      	.selectAll("circle")
      	.data(parsedData)
      	.enter().append("circle")
      		.attr("class", "end-circle")
      		.attr("cx", (d, i) =>  x(d.ranks[d.ranks.length - 1].year))
      		.attr("cy", (d, i) => y(d.ranks[d.ranks.length - 1].rank))
      		.attr("r", cfg.strokeWidth*2)
      		.style("fill", d => colour(d.department))
      		.style("opacity", 1);
			
            
      var tooltip = svg.append("g")
      	.attr("transform", "translate(-100, -100)")
      	.attr("class", "tooltip")
		.style("opacity", 0);
		 
		  
		tooltip.append("circle")
      	.attr("r", cfg.strokeWidth*3)
      tooltip.append("text")
      	.attr("class", "name")
      	.attr("y", -20);
      
      var voronoiGroup = svg.append("g")
      	.attr("class", "voronoi");
		  
      
      voronoiGroup.selectAll("path")
      	.data(voronoi.polygons(d3.merge(parsedData.map(d => d.ranks))))
      	.enter().append("path")
      		.attr("d", function(d) { return d ? "M" + d.join("L") + "Z" : null; })
      		.on("mouseover", mouseover)
      		.on("mouseout", mouseout)
			.on("click", onclick);
      
      svg.selectAll(".rank-line")
      	.each(d => highlight.includes(d.department) ? d.line.parentNode.appendChild(d.line) : 0);
      
      svg.select("g.end-labels").raise();
      
      function mouseover(d) {
        // Hide labels and dots from initial animation
		endLabels.style("opacity", 0);
        endDots.style("opacity", 0);
        
        svg.selectAll(".rank-line").style("opacity", 0.3);
        d3.select(d.data.department.line)
			.style("opacity", 1)
			.style("stroke-width", cfg.strokeWidth*1.5);
        d.data.department.line.parentNode.appendChild(d.data.department.line);
        tooltip.attr("transform", "translate(" + x(d.data.year) + "," + y(d.data.rank) + ")")
        	.style("fill", colour(d.data.department.department))
			.style("opacity", 1);
        tooltip.select("text").text(d.data.department.department)
        	.attr("text-anchor", d.data.year == x.domain()[0] ? "start" : "middle")
        	.attr("dx", d.data.year == x.domain()[0] ? -10 : 0)
      }
    
      function mouseout(d) {
      	svg.selectAll(".rank-line").style("opacity", 1)
		  .style("stroke-width", cfg.strokeWidth);
        
        endLabels.style("opacity", 1);
        endDots.style("opacity", 1);
        tooltip.attr("transform", "translate(-100,-100)");
		tooltip.style("opacity", 0);
     }

	 function onclick(d){
		console.log(d.data.department.department)

	 }
    });



// var bumpRadius = 13

// var padding = 25

// var margin = ({left: 105, right: 105, top: 20, bottom: 50})

//  d3.csv("data.csv", function(error, data_) {
//       if (error) throw error;
      
//       var data = [];
//       data_.forEach((d) => {
//         var dObj = {territory: d.territory, quarter: d.quarter, profit: d.profit};
//         data.push(dObj);
//       })
	


  
// 	var territories = Array.from(new Set(data.flatMap(d => [d.territory])))
// 	var quarters = Array.from(new Set(data.flatMap(d => [d.quarter])))
// 	var width = quarters.length * 80
//    	var height = territories.length * 60

// 	const ti = new Map(territories.map((territory, i) => [territory, i]));
// 	const qi = new Map(quarters.map((quarter, i) => [quarter, i]));  
	
// 	const matrix = Array.from(ti, () => new Array(quarters.length).fill(null));  
// 	for (const {territory, quarter, profit} of data) 
// 		matrix[ti.get(territory)][qi.get(quarter)] = {rank: 0, profit: +profit, next: null};
	
// 	matrix.forEach((d) => {
// 		for (let i = 0; i<d.length - 1; i++) 
// 			d[i].next = d[i + 1];
// 	});
	
// 	quarters.forEach((d, i) => {
// 		const array = [];
// 		matrix.forEach((d) => array.push(d[i]));
// 		array.sort((a, b) => b.profit - a.profit);
// 		array.forEach((d, j) => d.rank = j);
// 	});
	
// 	var chartData = matrix;

// 	console.log(chartData);

// 	const len = quarters.length - 1;
// 	const ranking = chartData.map((d, i) => ({territory: territories[i], first: d[0].rank, last: d[len].rank}));
// 	ranking;



// 	/*var strokeWidth = d3.scaleOrdinal()
//   .domain(["default", "transit", "compact"])
//   .range([5, bumpRadius * 2 + 2, 2]);*/

//   function seq(start, length){ Array.apply(null, {length: length}).map((d, i) => i + start);}

//   var bx = d3.scalePoint()
//   .domain(seq(0, quarters.length))
//   .range([0, width - margin.left - margin.right - padding * 2])

//   var by = d3.scalePoint()
//   .domain(seq(0, ranking.length))
//   .range([margin.top, height - margin.bottom - padding])

//   var ax = d3.scalePoint()
//   .domain(quarters)
//   .range([margin.left + padding, width - margin.right - padding]); 

//   var y = d3.scalePoint()  
//   .range([margin.top, height - margin.bottom - padding]);


//   var color = d3.scaleOrdinal(d3.schemeTableau10)
//   .domain(seq(0, ranking.length))


//   var left = ranking.sort((a, b) => a.first - b.first).map((d) => d.territory);

//   var right = ranking.sort((a, b) => a.last - b.last).map((d) => d.territory);


//   const svg = d3.create("svg")
//     .attr("cursor", "default")
//     .attr("viewBox", [0, 0, width, height]);
  
//   svg.append("g")
//     .attr("transform", `translate(${margin.left + padding},0)`)
//     .selectAll("path")
//     .data(seq(0, quarters.length))
//     .join("path")
//     .attr("stroke", "#ccc")
//     .attr("stroke-width", 2)
//     .attr("stroke-dasharray", "5,5")
//     .attr("d", d => d3.line()([[bx(d), 0], [bx(d), height - margin.bottom]]));
  
//   const series = svg.selectAll(".series")
//     .data(chartData)
//     .join("g")
//     .attr("class", "series")
//     .attr("opacity", 1)
//     .attr("fill", d => color(d[0].rank))
//     .attr("stroke", d => color(d[0].rank))
//     .attr("transform", `translate(${margin.left + padding},0)`)
//     .on("mouseover", highlight)
//     .on("mouseout", restore);
  
//   series.selectAll("path")
//     .data(d => d)
//     .join("path")
//     .attr("stroke-width", 5)
//     .attr("d", (d, i) => { 
//       if (d.next) 
//         return d3.line()([[bx(i), by(d.rank)], [bx(i + 1), by(d.next.rank)]]);
//     });
  
//   const bumps = series.selectAll("g")
//     .data((d, i) => d.map(v => ({territory: territories[i], profit: v, first: d[0].rank})))
//     .join("g")
//     .attr("transform", (d, i) => `translate(${bx(i)},${by(d.profit.rank)})`)
//     //.call(g => g.append("title").text((d, i) => `${d.territory} - ${quarters[i]}\n${toCurrency(d.profit.profit)}`)); 
//     .call(title);
  
//   bumps.append("circle").attr("r", bumpRadius);
//   bumps.append("text")
//     .attr("dy",  "0.35em")
//     .attr("fill", "white")
//     .attr("stroke", "none")
//     .attr("text-anchor", "middle")    
//     .style("font-weight", "bold")
//     .style("font-size", "14px")
//     .text(d => d.profit.rank + 1);   
  
//   svg.append("g").call(g => drawAxis(g, 0, height - margin.top - margin.bottom + padding, d3.axisBottom(ax), true));
//   const leftY = svg.append("g").call(g => drawAxis(g, margin.left, 0, d3.axisLeft(y.domain(left))));
//   const rightY = svg.append("g").call(g => drawAxis(g, width - margin.right, 0, d3.axisRight(y.domain(right)))); 
  
//   //return svg.node();
  
// });
//   function highlight(e, d) {       
//     this.parentNode.appendChild(this);
//     series.filter(s => s !== d)
//       .transition().duration(500)
//       .attr("fill", "#ddd").attr("stroke", "#ddd");
//     markTick(leftY, 0);
//     markTick(rightY,  quarters.length - 1);
    
//     function markTick(axis, pos) {
//       axis.selectAll(".tick text").filter((s, i) => i === d[pos].rank)
//         .transition().duration(500)
//         .attr("font-weight", "bold")
//         .attr("fill", color(d[0].rank));
//     }
//   }
  
//   function restore() {
//     series.transition().duration(500)
//       .attr("fill", s => color(s[0].rank)).attr("stroke", s => color(s[0].rank));    
//     restoreTicks(leftY);
//     restoreTicks(rightY);
    
//     function restoreTicks(axis) {
//       axis.selectAll(".tick text")
//         .transition().duration(500)
//         .attr("font-weight", "normal").attr("fill", "black");
//     }
//   }

	
    //var data_file = preproc.getData();
// Search
function filterFunction() {
	var input, filter, ul, li, a, i;
	input = document.getElementById("myInput");
	filter = input.value.toUpperCase();
	div = document.getElementById("myDropdown");
	a = div.getElementsByTagName("a");
	for (i = 0; i < a.length; i++) {
	  txtValue = a[i].textContent || a[i].innerText;
	  if (txtValue.toUpperCase().indexOf(filter) > -1) {
		a[i].style.display = "";
	  } else {
		a[i].style.display = "none";
	  }
	}
}

// (function (d3) {
//   const margin = {
//     top: 75,
//     right: 200,
//     bottom: 100,
//     left: 80
//   }

//   let currentYear = 2000

//   let svgSize, graphSize

//   setSizing()

//   const g = helper.generateG(margin)

//   const tip = d3Tip().attr('class', 'd3-tip').html(function (d) { return tooltip.getContents(d) })
//   g.call(tip)

//   helper.appendAxes(g)
//   helper.appendGraphLabels(g)
//   helper.placeTitle(g, graphSize.width)

//   viz.positionLabels(g, graphSize.width, graphSize.height)

//   helper.drawButton(g, currentYear === 2000 ? 2015 : 2000, graphSize.width)

//   d3.json('./countriesData.json').then((data) => {
//     const radiusScale = scales.setRadiusScale(data)
//     const colorScale = scales.setColorScale(data)
//     const xScale = scales.setXScale(graphSize.width, data)
//     const yScale = scales.setYScale(graphSize.height, data)

//     helper.drawXAxis(xScale, graphSize.height)
//     helper.drawYAxis(yScale)

//     legend.drawLegend(colorScale, g, graphSize.width)

//     build(data, 0, currentYear, radiusScale, colorScale, xScale, yScale)

//     viz.setCircleHoverHandler(tip)

//     setClickHandler()

//     /**
//      *   Sets up the click handler for the button.
//      */
//     function setClickHandler () {
//       d3.select('.button')
//         .on('click', () => {
//           const previousYear = currentYear
//           currentYear = (currentYear === 2000 ? 2015 : 2000)
//           build(data, 1000, currentYear, radiusScale, colorScale, xScale, yScale)
//           d3.select('.button').select('.button-text').text('See ' + previousYear + ' dataset')
//         }
//         )
//     }
//   })

//   /**
//    *   This function handles the graph's sizing.
//    */
//   function setSizing () {
//     svgSize = {
//       width: 1000,
//       height: 600
//     }

//     graphSize = {
//       width: svgSize.width - margin.right - margin.left,
//       height: svgSize.height - margin.bottom - margin.top
//     }

//     helper.setCanvasSize(svgSize.width, svgSize.height)
//   }

//   /**
//    * This function builds the graph.
//    *
//    * @param {object} data The data to be used
//    * @param {number} transitionDuration The duration of the transition while placing the circles
//    * @param {number} year The year to be displayed
//    * @param {*} rScale The scale for the circles' radius
//    * @param {*} colorScale The scale for the circles' color
//    * @param {*} xScale The x scale for the graph
//    * @param {*} yScale The y scale for the graph
//    */
//   function build (data, transitionDuration, year, rScale, colorScale, xScale, yScale) {
//     viz.drawCircles(data[year], rScale, colorScale, xScale, yScale, tip)
//     viz.moveCircles(xScale, yScale, transitionDuration)
//     viz.setTitleText(year)
//   }
// })(d3)
