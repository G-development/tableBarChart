export const createSVGElem = (elementId, width, height, margin) => {
  //   $("#" + elementId).empty();
  var extSvg = d3
    .select(elementId)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  var svg = extSvg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    // .attr("class", "heatBar")
    // .attr("id", "heatBar_" + elementId);

  return svg;
};
