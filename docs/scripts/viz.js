

var bumpRadius = 13
var padding = 25
var artistNo = 20;
var margin = ({left: 105, right: 120, top: 70, bottom: 50})
var bx, by, ax, y;
var width, height;


export function setSize(max, quarters){
  
  artistNo = max;
  width = quarters.length * 150
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

export function viz(rows, columns, matrix, streams){

  var ranking = [];
  for (let i = 0; i < matrix.length; i++) {
    if (matrix[i][columns.length - 1].rank < artistNo)
      ranking.push({artist: rows[i], first: matrix[i][0].rank, last: matrix[i][columns.length - 1].rank})
    
  }

	bx.domain(seq(0, columns.length))

	by.domain(seq(0, ranking.length))

	ax.domain(columns);


	var color = d3.scaleOrdinal(d3.schemeTableau10)
	.domain(seq(0, ranking.length))

	var right = ranking.sort((a, b) => a.last - b.last).map((d) => d.artist);

  var svg = d3.select('svg')
  .attr("viewBox", [0, 0, width, height*2])
  .style("width", "75%");
	
  svg.transition();
	svg.append("g")
		.attr("transform", `translate(${margin.left + padding},${margin.top})`)
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
		.attr("opacity", 1)
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
      return d.map(v => ({artist: rows[i], profit: v, first: d[0].rank}))
    })
		.enter().append("g")
		.attr("transform", (d, i) => `translate(${bx(i)},${by(d.profit.rank < artistNo? d.profit.rank: artistNo+1)})`)
    .attr("opacity", (d, i)=> { if (d.profit.stream > max[i]) max[i] = d.profit.stream;
      return (d.profit.stream == 0 || d.profit.rank > artistNo)? "0": "1"; })
		.call(hover)
		.on("click", function(d){
      console.log(d.artist)
    })
	
	bumps.append("circle").attr("r", (d, i) => {
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
		.text(d => d.profit.rank + 1);   
	
  const bottomX = svg.append("g").call(g => drawAxis(g, 0, 35, d3.axisTop(ax), true));
	const topX = svg.append("g").call(g => drawAxis(g, 0, height- margin.bottom , d3.axisBottom(ax), true));
	const rightY = svg.append("g").call(g => drawAxis(g, width - margin.right, 0, d3.axisRight(y.domain(right))));
	
  var ap = topX.selectAll(".tick text")
    .on("mouseover", function(d){
    d3.select(this).attr("font-weight", "bold")
    d3.select(this).style("stroke", "black")
    })
    .on("mouseout", function(d){
    ap.attr("font-weight", "normal")
    ap.style("stroke", "none")
    })
    .on("click", function(d){
      view = "country";
      console.log(d);
    })
	
    var aq = bottomX.selectAll(".tick text")
    .on("mouseover", function(d){
    d3.select(this).attr("font-weight", "bold")
    d3.select(this).style("stroke", "black")
    })
    .on("mouseout", function(d){
    aq.attr("font-weight", "normal")
    aq.style("stroke", "none")
    })
    .on("click", function(d){
      view = "country";
      console.log(d);
    })
	
	function highlight(e, d) {  
		this.parentNode.appendChild(this);
		series.filter((s, i) => { return e[0].rank !== s[0].rank})
		.transition().duration(100)
		.attr("fill", "#ddd").attr("stroke", "#ddd");
		markTick(rightY,  columns.length - 1);
		
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
    restoreTicks(rightY);
    
    function restoreTicks(axis) {
      axis.selectAll(".tick text")
      .transition().duration(100)
      .attr("font-weight", "normal").attr("fill", "black");
    }
  }

}

function drawAxis (g, x, y, axis, domain) {
  g.attr("transform", `translate(${x},${y})`)
    .call(axis)
    .selectAll(".tick text")
    .attr("font-size", "12px");
  
  if (!domain) g.select(".domain").remove();
}

