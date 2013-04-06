function getMaxScreenHeight(){
	return  window.screen.height - (window.outerHeight-window.innerHeight) - 53;
}

function getScreenWidth() {
  return screen.width;
}

function getAvailScreenHeight() {
  return screen.availHeight;
}

function getClientWidth() {
  return document.compatMode=='CSS1Compat' && !window.opera?document.documentElement.clientWidth:document.body.clientWidth;
}

function getClientHeight() {
  return document.compatMode=='CSS1Compat' && !window.opera?document.documentElement.clientHeight:document.body.clientHeight;
}


var dates;
var headerHeight = 50;
var margin = {top: 0, right: 0, bottom: 0, left: 0},
    width = getScreenWidth(),
    height = getAvailScreenHeight(),
    formatNumber = d3.format(",d"),
    transitioning;

var x = d3.scale.linear()
    .domain([0, width])
    .range([0, width]);

var y = d3.scale.linear()
    .domain([0, height])
    .range([0, height]);

var treemap = d3.layout.treemap()
    .children(function(d, depth) { return depth ? null : d.children; })
    .sort(function(a, b) { return a.value - b.value; })
    .ratio(height / width * 0.5 * (1 + Math.sqrt(5)))
    .round(false);

var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.bottom + margin.top)
    .style("margin-left", -margin.left + "px")
    .style("margin.right", -margin.right + "px")
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .style("shape-rendering", "crispEdges");


var grandparent = svg.append("g")
    .attr("class", "grandparent");

var color = d3.scale.category20c();

grandparent.append("rect")
    .attr("y", -margin.top)
    .attr("width", width)
    .attr("height", margin.top);

grandparent.append("text")
    .attr("x", 6)
    .attr("y", 6 - margin.top)
    .attr("dy", ".75em");

d3.json("acm.json", function(root) {
  //dates = root;

  initialize(root);
  accumulate(root);
  layout(root);
  
  dates = root;
  display(root);
});

  function initialize(root) {
    root.x = root.y = 0;
    root.dx = width;
    root.dy = height;
    root.depth = 0;
  }

  // Aggregate the values for internal nodes. This is normally done by the
  // treemap layout, but not here because of our custom implementation.
  function accumulate(d) {
    return d.children
        ? d.value = d.children.reduce(function(p, v) { return p + accumulate(v); }, 0)
        : d.value;
  }

  // Compute the treemap layout recursively such that each group of siblings
  // uses the same size (1?1) rather than the dimensions of the parent cell.
  // This optimizes the layout for the current zoom state. Note that a wrapper
  // object is created for the parent node for each group of siblings so that
  // the parent's dimensions are not discarded as we recurse. Since each group
  // of sibling was laid out in 1?1, we must rescale to fit using absolute
  // coordinates. This lets us use a viewport to zoom.
  function layout(d) {
    if (d.children) {
      treemap.nodes({children: d.children});
      d.children.forEach(function(c) {
        c.x = d.x + c.x * d.dx;
        c.y = d.y + c.y * d.dy;
        c.dx *= d.dx;
        c.dy *= d.dy;
        c.parent = d;
        layout(c);
      });
    }
  }

var precG, thiz;
var transitioning = false;

  function display(d) {
   
    grandparent
        .datum(d.parent)
        .on("click", transition)				
      .select("text")
        .text(name(d));
    var g1 = svg.insert("g", ".grandparent")
        .datum(d)
        .attr("class", "depth");

//if(!transitioning) 
precG = g1;
	
    var g = g1.selectAll("g")
        .data(d.children)
      .enter().append("g");
	  

    g.filter(function(d) { return d.children; })
        .classed("children", true)
        .on("dblclick", transition);

    g.selectAll(".child")
        .data(function(d) { return d.children || [d]; })
      .enter().append("rect")
        .attr("class", "child")
        .call(rect)
		.style("fill", function(d) { return color(d.parent.name); });
		
	

    g.append("rect")
        .attr("class", "parent")
        .call(rect)
      .append("title")
        .text(function(d) { return formatNumber(d.value); });

	g.select(".parent")
		.on("mouseenter",function(e){
			$(this).siblings("rect").attr("opacity","1");
		})
		.on("mouseleave",function(){
			$(this).siblings("rect").attr("opacity","0.5");
		})
	
    g.append("text")
        .attr("dy", ".75em")
        .text(function(d) { return d.name; })
        .call(text);
		

		
		function transition(d) {
			//alert(d3.event);
			dates = d;
			thiz = this;
			  if (transitioning || !d) return;
			  transitioning = true;
		
			  var g2 = display(d),
				  t1 = g1.transition().duration(750),
				  t2 = g2.transition().duration(750);
				
				
				precG = g1;
				gg1=g1;
				gg2=g2;//alert(d.name);
				tt1=t1;
			  
			  // Update the domain only after entering new elements.
			  x.domain([d.x, d.x + d.dx]);
			  y.domain([d.y, d.y + d.dy]);
		
			  // Enable anti-aliasing during the transition.
			  svg.style("shape-rendering", null);
		
			  // Draw child nodes on top of parent nodes.
			  svg.selectAll(".depth").sort(function(a, b) { return a.depth - b.depth; });
		
			  // Fade-in entering text.
			  g2.selectAll("text").style("fill-opacity", 0);
		
			  // Transition to the new view.
			  t1.selectAll("text").call(text).style("fill-opacity", 0);
			  t2.selectAll("text").call(text).style("fill-opacity", 1);
			  t1.selectAll("rect").call(rect);
			  t2.selectAll("rect").call(rect);
		
			  // Remove the old node when the transition is finished.
			  t1.remove().each("end", function() {

				svg.style("shape-rendering", "crispEdges");
				transitioning = false;
				
			
				OnEnd(t2[0][0].node);
			  });
			}//end transition
     return g;
  }//end display


  	function text(text) {
    	text.attr("x", function(d) { return x(d.x) + 6; })
        	.attr("y", function(d) { return y(d.y) + 6; });
  	}

  	function rect(rect) {
    	rect.attr("x", function(d) { return x(d.x); })
        	.attr("y", function(d) { return y(d.y); })
			.attr("rx", 5).attr("ry", 5)
			.attr("stroke", "black").attr("stroke-width", 3)
			.attr("opacity","0.5")
        	.attr("width", function(d) { return x(d.x + d.dx) - x(d.x); })
        	.attr("height", function(d) { return y(d.y + d.dy) - y(d.y); });

  	}

	function name(d) {
		return d.parent
			? name(d.parent) + "." + d.name
			: d.name;
	}

	function toArray(obj) {
	  var array = [];
	  for (var i = obj.length >>> 0; i--;) { 
		array[i] = obj[i];
	  }
	  return array;
	}
	
	function filterFunction(element, index, array)
	{
		return element.textContent == "Data management systems";
	}
	
	function OnEnd(d){
		//d -> g.depth
		var elem = d.childNodes;
		var filtered = toArray(d.childNodes).filter(filterFunction);
		//console.log(filtered.length);
		
		if(filtered.length > 0)
			fireEvent(filtered[0].parentNode, "click");			
	}
	


$("#up").click(function () {
		fireEvent(d3.select(".grandparent").node() ,"click");
});

function fireEvent(element,event) {
   if (document.createEvent) {
       // dispatch for firefox + others
       var evt = document.createEvent("HTMLEvents");
       evt.initEvent(event, true, true ); // event type,bubbling,cancelable
       return !element.dispatchEvent(evt);
   } else { 
       // dispatch for IE
       var evt = document.createEventObject();
       return element.fireEvent('on' + event,evt)
   }
}
  

var $chart = $('#chart');
var $svg = $("svg");

var cursorStartY, svgStartTop;
var cursorStartX, svgStartLeft;


$chart
		.on('mouseenter', function(e){
			
			$(this).on('mousedown',function(e){
											
				/*Drag start*/
				cursorStartY = e.clientY + window.scrollY;
				cursorStartX = e.clientX + window.scrollX;
				
				if(!svgStartLeft) svgStartLeft = -8;
				if(!svgStartTop) svgStartTop = 0;
				
				/*Drag go*/
				$(window).on('mousemove', function(e) {
					$("rect").css('cursor',"move");			   
					$svg.css('transition','transform 0s ease');
					var x, y;
					
					x = e.clientX + window.scrollX;
    				y = e.clientY + window.scrollY;
					
					svgStartLeftOffset = svgStartLeft + x - cursorStartX;
					svgStartTopOffset = svgStartTop + y - cursorStartY;
					  
					  if(Math.abs(svgStartTopOffset) < $svg.height()- getClientHeight() + headerHeight &&
							svgStartTopOffset < 0 &&
							svgStartLeftOffset < 0 &&
							Math.abs(svgStartLeftOffset) < $svg.width()- getClientWidth() + 0)
					  {

						  $svg.css('transform','translate('+ svgStartLeftOffset +'px, '+ svgStartTopOffset +'px)');

					  }
					  else{
							if(svgStartTopOffset >= 0 ) 
							{
							  svgStartTopOffset = 0;
						  	}
						  	else if(Math.abs(svgStartTopOffset) > $svg.height()- getClientHeight() + headerHeight)
						  	{
						  		svgStartTopOffset = -1.0* ($svg.height()- getClientHeight() + headerHeight);
							}
						  	
							if(svgStartLeftOffset > 0)
							{
								svgStartLeftOffset = 0; 
							}
							else if(Math.abs(svgStartLeftOffset) > $svg.width()- getClientWidth() + 0)
							{
								svgStartLeftOffset = -1.0*($svg.width()- getClientWidth() + 0);
							}

							$svg.css('transform','translate('+ svgStartLeftOffset +'px, '+ svgStartTopOffset +'px)');
					  }
					  
					return false;
				});
				return false;
			})
			.on('mouseup', function(e){
				svgStartTop = svgStartTopOffset;
				svgStartLeft = svgStartLeftOffset;

				$("rect").css('cursor',"");	
				$(window).off('mousemove');
				return false;
			});
		})
		.on('mouseleave', function(){
			$(window).off('mousemove');
			$("rect").css('cursor',"");	
			$svg.css('transform','translate(0px, 0px)');
			$svg.css('transition','transform 1s ease');

									   
			return false;	
		})

;
$(document).ready(function() {
  $('#detailed-view').sidr();
});
