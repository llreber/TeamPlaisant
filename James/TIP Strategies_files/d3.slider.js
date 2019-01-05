d3.slider=function module(){"use strict";var min=0,max=100,step=1,animate=true,orientation="horizontal",axis=false,margin=50,value,scale;var axisScale,dispatch=d3.dispatch("slide","slideend","slidestart"),formatPercent=d3.format(".2%"),tickFormat=d3.format(".0"),sliderLength;function slider(selection){selection.each(function(){if(!scale){scale=d3.scale.linear().domain([min,max]);}
value=value||scale.domain()[0];var div=d3.select(this).classed("d3-slider d3-slider-"+orientation,true);var drag=d3.behavior.drag();drag.on("dragend",function(){dispatch.slideend();}).on("dragstart",function(){dispatch.slidestart();})
var handle=div.append("a").classed("d3-slider-handle",true).attr("xlink:href","#").on("click",stopPropagation).call(drag);if(orientation==="horizontal"){div.on("click",onClickHorizontal);drag.on("drag",onDragHorizontal);handle.style("left",formatPercent(scale(value)));sliderLength=parseInt(div.style("width"),10);}else{div.on("click",onClickVertical);drag.on("drag",onDragVertical);handle.style("bottom",formatPercent(scale(value)));sliderLength=parseInt(div.style("height"),10);}
if(axis){createAxis(div);}
function createAxis(dom){if(typeof axis==="boolean"){axis=d3.svg.axis().ticks(Math.round(sliderLength/100)).tickFormat(tickFormat).orient((orientation==="horizontal")?"bottom":"right");}
axisScale=scale.copy().range([0,sliderLength]);axis.scale(axisScale);var svg=dom.append("svg").classed("d3-slider-axis d3-slider-axis-"+axis.orient(),true).on("click",stopPropagation);var g=svg.append("g");if(orientation==="horizontal"){svg.style("left",-margin);svg.attr({width:sliderLength+margin*2,height:margin});if(axis.orient()==="top"){svg.style("top",-margin);g.attr("transform","translate("+margin+","+margin+")")}else{g.attr("transform","translate("+margin+",0)")}}else{svg.style("top",-margin);svg.attr({width:margin,height:sliderLength+margin*2});if(axis.orient()==="left"){svg.style("left",-margin);g.attr("transform","translate("+margin+","+margin+")")}else{g.attr("transform","translate("+0+","+margin+")")}}
g.call(axis);}
function moveHandle(pos){var newValue=stepValue(Math.floor(scale.invert(pos/sliderLength)));if(value!==newValue){var oldPos=formatPercent(scale(stepValue(value))),newPos=formatPercent(scale(stepValue(newValue))),position=(orientation==="horizontal")?"left":"bottom";dispatch.slide(d3.event.sourceEvent||d3.event,value=newValue);if(animate){handle.transition().styleTween(position,function(){return d3.interpolate(oldPos,newPos);}).duration((typeof animate==="number")?animate:250);}else{handle.style(position,newPos);}}}
function stepValue(val){var valModStep=(val-scale.domain()[0])%step,alignValue=val-valModStep;if(Math.abs(valModStep)*2>=step){alignValue+=(valModStep>0)?step:-step;}
return alignValue;}
function onClickHorizontal(){moveHandle((d3.event.offsetX||d3.event.layerX)-2);dispatch.slideend();}
function onClickVertical(){moveHandle(sliderLength-d3.event.offsetY||d3.event.layerY);dispatch.slideend();}
function onDragHorizontal(){moveHandle(Math.max(0,Math.min(sliderLength,d3.event.x)));}
function onDragVertical(){moveHandle(sliderLength-Math.max(0,Math.min(sliderLength,d3.event.y)));}
function stopPropagation(){d3.event.stopPropagation();}});}
slider.min=function(_){if(!arguments.length)return min;min=_;return slider;}
slider.max=function(_){if(!arguments.length)return max;max=_;return slider;}
slider.step=function(_){if(!arguments.length)return step;step=_;return slider;}
slider.animate=function(_){if(!arguments.length)return animate;animate=_;return slider;}
slider.orientation=function(_){if(!arguments.length)return orientation;orientation=_;return slider;}
slider.axis=function(_){if(!arguments.length)return axis;axis=_;return slider;}
slider.margin=function(_){if(!arguments.length)return margin;margin=_;return slider;}
slider.value=function(_){if(!arguments.length)return value;value=_;return slider;}
slider.scale=function(_){if(!arguments.length)return scale;scale=_;return slider;}
d3.rebind(slider,dispatch,"on");return slider;}