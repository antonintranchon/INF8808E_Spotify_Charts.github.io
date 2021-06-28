import * as preproc from './preprocess.js'
import * as addon from './add-ons.js'

var bumpRadius = 13
var padding = 25
var artistNo = 25;
var margin = ({left: 105, right: 105, top: 20, bottom: 50})
var bx, by, ax, y;
var width, height;


export function setSize(territories, quarters){
  
  width = quarters.length * 150
  //height = territories.length * 40
  height = artistNo * 40
}

export function setScales(){

	bx = d3.scalePoint()
	.range([0, width - margin.left - margin.right - padding * 2])

	by = d3.scalePoint()
	.range([margin.top, height - margin.bottom - padding])

	ax = d3.scalePoint()
	.range([margin.left + padding, width - margin.right - padding]); 

	y = d3.scalePoint()  
	.range([margin.top, height - margin.bottom - padding]);

}


function seq(start, length){ return Array.apply(null, {length: length}).map((d, i) => i + start);}

export function viz(rows, columns, matrix, streams, view){

  var ranking = [];
  for (let i = 0; i < matrix.length; i++) {
    //console.log( matrix[i][columns.length - 1].rank)
    if (matrix[i][columns.length - 1].rank < artistNo)
      ranking.push({artist: rows[i], first: matrix[i][0].rank, last: matrix[i][columns.length - 1].rank})
    
  }

  // var ranking = matrix.map((d, i) => ({artist: rows[i], first: d[0].rank, last: d[columns.length - 1].rank}));
  //ranking = ranking.slice(0, 50);
console.log(ranking)
	bx.domain(seq(0, columns.length))

	by.domain(seq(0, ranking.length))

	ax.domain(columns);


	var color = d3.scaleOrdinal(d3.schemeTableau10)
	.domain(seq(0, ranking.length))

	var right = ranking.sort((a, b) => a.last - b.last).map((d) => d.artist);
  console.log(ranking)
  console.log(right)


	var svg = d3.select("body").append("svg")
		.attr("cursor", "default")
		.attr("viewBox", [0, 0, width, height*2]);
  //var svg = d3.select('svg');
	
  svg.transition();
	svg.append("g")
		.attr("transform", `translate(${margin.left + padding},0)`)
		.selectAll("path")
		.data(seq(0, columns.length))
		.enter().append("path")
		.attr("stroke", "#ccc")
		.attr("stroke-width", 2)
		.attr("stroke-dasharray", "5,5")
		.attr("d", d => { d3.line()([[bx(d), 0], [bx(d), height - margin.bottom]])})
	
	const series = svg.selectAll(".series")
		.data(matrix)
		.enter().append("g")
		.attr("class", "series")
		.attr("opacity", function(d) {/*console.log("d opacity = ", d);*/ return 1;})
    //.attr("opacity", d=> {console.log("ICIIIII d =", d)
    //                      console.log("d.profit = ", d.profit)
    //                      if (d.profit.stream == 0) return "0";
    //                      else return "1"; })
		.attr("fill", d => color(d[0].rank))
		.attr("stroke", d => color(d[0].rank))
		.attr("transform", `translate(${margin.left + padding},0)`)
		.on("mouseover", highlight)
		.on("mouseout", restore);
	
	series.selectAll("path")
		.data(d => d)
		.enter().append("path")
		.attr("stroke-width", 5)
		.attr("d", (d, i) => { 
      if (d.next && d.rank < artistNo && d.next.rank < artistNo) {
        //console.log(d)
        return d3.line()([[bx(i), by(d.rank)], [bx(i + 1), by(d.next.rank)]]);
      }
    });


	function hover(g) { 
		g.append("title")
		.text((d, i) => {return `${d.artist} - ${ columns[i]}\nRank: ${d.profit.rank + 1}\nStreams: ${d.profit.stream}`})
	}

var max = new Array(columns.length).fill(0);
	const bumps = series.selectAll("g")
		.data((d, i) => {
      /*
      var selected = [];
      for (let j = 0; j < d.length; j++) {
        //console.log(d[j])
        if (d[j].rank < artistNo)
          selected.push({artist: rows[i], profit: d[j], last: d[0].rank})
        
      }
      console.log(selected)
      return selected;*/
      return d.map(v => ({artist: rows[i], profit: v, first: d[0].rank}))
    })
		.enter().append("g")
		.attr("transform", (d, i) => `translate(${bx(i)},${by(d.profit.rank < artistNo? d.profit.rank: d.profit.rank)})`)
    .attr("opacity", (d, i)=> { if (d.profit.stream > max[i]) max[i] = d.profit.stream;
      return (d.profit.stream == 0)? "0": "1"; })
		.call(hover)
		.on("click", function(d){
      view = "artist"; 
      preproc.getDataFinal(addon.getBeginDate(), addon.getEndDate());
      console.log(d.artist)
    })
		//.on("mouseover", function(d){bumps.selectAll("circle") = "artist"; console.log(d.artist)});;
	
	bumps.append("circle").attr("r", (d, i) => {
    //console.log(d, i)
    //var max = streams[i]/ranking.length/100;
      //console.log(d.profit)
      /*view == "main"? bumpRadius: */
			return Math.max(d.profit.stream/max[i]*2*bumpRadius, bumpRadius/3)
		});
	bumps.append("text")
		.attr("dy",  "0.35em")
		.attr("fill", "white")
		.attr("stroke", "white")
		.attr("text-anchor", "middle")    
		.style("font-weight", "bold") 
		.style("font-size", (d, i) => Math.max(d.profit.stream/max[i]*1.5*bumpRadius, bumpRadius/3))
		.style("text-shadow", "none")
		.style("opacity", d=> {if (d.profit.stream == 0) return "0";
                          else return 1; })
		.text(d => view == "main"? d.profit.rank + 1: "");   
	
	const topX = svg.append("g").call(g => drawAxis(g, 0, height - margin.top - margin.bottom + padding, d3.axisBottom(ax), true));
	//const leftY = svg.append("g").call(g => drawAxis(g, margin.left, 0, d3.axisLeft(y.domain(left))));
	const rightY = svg.append("g").call(g => drawAxis(g, width - margin.right, 0, d3.axisRight(y.domain(right))));
	
  var ap = topX.selectAll(".tick text")
    .on("mouseover", function(d){
    //ap.attr("font-weight", "bold")
    d3.select(this).attr("font-weight", "bold")
    d3.select(this).style("stroke", "black")
    })
    .on("mouseout", function(d){
    //ap.attr("font-weight", "bold")
    ap.attr("font-weight", "normal")
    ap.style("stroke", "none")
    })
    .on("click", function(d){
      view = "country";
      console.log(d);
      preproc.getDataFinal(addon.getBeginDate(), addon.getEndDate());
    })
	
	
	function highlight(e, d) {  
		this.parentNode.appendChild(this);
		series.filter((s, i) => { return e[0].rank !== s[0].rank})
		.transition().duration(100)
		.attr("fill", "#ddd").attr("stroke", "#ddd");
		//markTick(leftY, 0);
		markTick(rightY,  columns.length - 1);
		//markTick(topX,  0);
		
		function markTick(axis, pos) {
		var pp = axis.selectAll(".tick text").filter(function (s, i) {
			return i === e[pos].rank })
			.transition().duration(100)
			.attr("font-weight", "bold")
			.attr("fill", color(e[0].rank));
			
		}
  }

  
  function restore(e, d) {
    series.transition().duration(100)
      .attr("fill", s => color(s[0].rank)).attr("stroke", s => color(s[0].rank));    
    //restoreTicks(leftY);
    restoreTicks(rightY);
    
    function restoreTicks(axis) {
      axis.selectAll(".tick text")
      .transition().duration(100)
      .attr("font-weight", "normal").attr("fill", "black");
    }
  }



// var   margin = {top: 20, right: 20, bottom: 30, left: 40},
 //   width = +svg.attr("width") - margin.left - margin.right,
  //  height = +svg.attr("height") - margin.top - margin.bottom;

var xi = d3.scaleBand().rangeRound([0, width-padding]).padding(padding),
    yi = d3.scaleLinear().rangeRound([150, 0]);

var g = svg.append("g")

    .attr("transform", `translate(0,${margin.top + height})`)
    //.attr("transform", "translate(" + margin.left + "," + margin.top - height + ")")
    .attr("class", "bar");


  xi.domain(streams);
  yi.domain(streams);
  console.log(streams)
  var max = Math.max(...streams);
/*
  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height/5 + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(10, "%"))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Frequency");
*/
  g.selectAll(".bar")
    //.data(seq(0, streams.length))
    .data(streams)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d, i) {
        /* console.log("streams = ", streams, "d =", d, " xi(d) = ",xi(d), " yi(d) = ", yi(d), "height =", height );*/ 
        //return xi(d);
        return width/i
      })
      .attr("y", function(d) {return yi(d)} )
      .attr("width", 30)
      .attr("height", function(d) { return 200 - yi(d) /*d/max*100*/ })
      .attr("fill", "green");

}

function drawAxis (g, x, y, axis, domain) {
  g.attr("transform", `translate(${x},${y})`)
    .call(axis)
    .selectAll(".tick text")
    .attr("font-size", "12px");
  
  if (!domain) g.select(".domain").remove();
}




































/**
 * Positions the x axis label and y axis label.
 *
 * @param {*} g The d3 Selection of the graph's g SVG element
 * @param {number} width The width of the graph
 * @param {number} height The height of the graph
 */
export function positionLabels (g, width, height) {
  // TODO : Position axis labels
  g.select(".x.axis-text")
  .attr('transform', 'translate('+(width/2)+','+(height+40)+')')
  
  g.select(".y.axis-text")
  .attr('transform', 'translate('+(-40)+','+(height/2)+') rotate(-90)')
  

}

/**
 * Draws the circles on the graph.
 *
 * @param {object} data The data to bind to
 * @param {*} rScale The scale for the circles' radius
 * @param {*} colorScale The scale for the circles' color
 */
export function drawCircles (data, rScale, colorScale, xScale, yScale) {
  // TODO : Draw the bubble chart's circles
  // Each circle's size depends on its population
  // and each circle's color depends on its continent.
  // The fill opacity of each circle is 70%
  // The outline of the circles is white
  
  d3.select("#graph-g").selectAll("circle")
    .data(data)
    .enter().append("circle")
    .attr("r", function(d) {return rScale(d["Population"]);})
    .attr("cx", function(d) {return xScale(d["GDP"])})
    .attr("cy", function(d) {return yScale(d["CO2"])})
    .attr("fill", function(d) {return colorScale(d["Continent"])})
    .style("stroke", "white")
    .style("opacity", "70%")
}


/**
 * Sets up the hover event handler. The tooltip should show on on hover.
 *
 * @param {*} tip The tooltip
 */
export function setCircleHoverHandler (tip) {
  // TODO : Set hover handler. The tooltip shows on
  // hover and the opacity goes up to 100% (from 70%)
  d3.select("#graph-g")
  .selectAll("circle")
  .on('mouseover', function(d){
    d3.select(this).style("opacity", "100%");
     tip.show(d, this); 
  })
  .on('mouseout', function(d){
    d3.select(this).style("opacity", "70%"); 
    tip.hide(d, this); 
  })
}

/**
 * Updates the position of the circles based on their bound data. The position
 * transitions gradually.
 *
 * @param {*} xScale The x scale used to position the circles
 * @param {*} yScale The y scale used to position the circles
 * @param {number} transitionDuration The duration of the transition
 */
export function moveCircles (xScale, yScale, transitionDuration) {
  // TODO : Set up the transition and place the circle centers
  // in x and y according to their GDP and CO2 respectively
  d3.selectAll("circle").transition().duration(transitionDuration)
  .attr("cx", function(d) {return xScale(d["GDP"])})
  .attr("cy", function(d) {return yScale(d["CO2"])});
  
}

/**
 * Update the title of the graph.
 *
 * @param {number} year The currently displayed year
 */
export function setTitleText (year) {
  // TODO : Set the title
  d3.select("#graph-g")
    //.selectAll("#title")
    .append('text')
    .attr('class', 'title')
    .attr('font-size', 12)
    .attr('transform', 'translate(-2, -20)')

  d3.select(".title")
  .text('Data for year : ' + year )
}
