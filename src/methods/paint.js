import * as d3 from "d3";

import { createProps } from "../features/createProps";
import { createSVGElem } from "../features/usefulMethods";

import "./style.css";
var qlik = window.require("qlik");

export default function paint($element, layout) {
  console.log("Layout", layout);

  const allProps = createProps(layout);

  var hc = layout.qHyperCube,
    mat = hc.qDataPages[0].qMatrix,
    dimensions = [],
    measures = [],
    dimTypes = [],
    graphPosition;

  hc.qDimensionInfo.forEach((dim) => dimensions.push(dim.qFallbackTitle));
  hc.qDimensionInfo.map((dim) => dimTypes.push(dim.type));
  hc.qMeasureInfo.forEach((meas) =>
    measures.push({
      name: meas.qFallbackTitle,
      refersTo: meas.qAttrExprInfo[0].qFallbackTitle,
    })
  );

  let headerRow = mat.map((item) => item[0].qText);
  // console.log("headerRow", headerRow);

  // Table measures
  var tResult = measures
    .map((measure, i) => {
      if (measure.refersTo == "='row'") {
        let vals = mat.map((item) => item[i + 1].qText);
        let nav = mat.map((item) => {
          return {
            navSheet: item[i + 1].qAttrExps.qValues[6].qText,
            navSel: item[i + 1].qAttrExps.qValues[7].qText,
            navClear: item[i + 1].qAttrExps.qValues[8].qText,
          };
        });

        return {
          row: measure.name,
          vals: vals,
          nav: nav,
        };
      } else graphPosition = i + 1;
    })
    .filter((item) => item != undefined);

  console.log("tResult", tResult);
  // console.log("graphPosition", graphPosition);

  // Graph measure
  if (graphPosition != undefined) {
    var gResult = mat.map((item) => {
      return {
        dimension: item[0].qText,
        val: item[graphPosition].qNum,
        valQText: item[graphPosition].qText,
        prevTitle: item[graphPosition].qAttrExps.qValues[1].qText,
        prevValues: item[graphPosition].qAttrExps.qValues[2].qText,
        arrow: item[graphPosition].qAttrExps.qValues[4].qText,
        color: item[graphPosition].qAttrExps.qValues[5].qText,
      };
    });
    // console.log("gResult", gResult);
  }

  // Initial stuffs
  const elementId = "TBC_" + layout.qInfo.qId,
    containerWidth = $element.width(),
    containerHeight = $element.height();

  var margin = { top: 20, right: 0, bottom: 0, left: 20 },
    width = containerWidth - margin.left - margin.right,
    height = containerHeight - margin.top - margin.bottom;

  // $("#" + elementId).css({ maxHeight: containerHeight + "px" });

  /* TABLE */
  var tablearea, table, tr, td;
  // Create table
  tablearea = document.getElementById(elementId);
  $(tablearea).empty();
  table = document.createElement("table");
  if (graphPosition != undefined) {
    // Pre graph row
    tr = document.createElement("tr");
    $(tr).addClass("barchart-prev");
    td = document.createElement("td");
    td.append(gResult[0].prevTitle);
    tr.append(td);
    gResult.forEach((item) => {
      let tdInside = document.createElement("td");
      tdInside.append(item.prevValues);
      tr.append(tdInside);
    });
    table.append(tr);

    // Graph row
    tr = document.createElement("tr");
    $(tr).addClass("barchart");
    td = document.createElement("td");
    td.append(hc.qMeasureInfo[graphPosition - 1].qFallbackTitle);
    tr.append(td);
    td = document.createElement("td");
    $(td).attr("colspan", headerRow.length);
    tr.append(td);
    table.append(tr);
  }

  // Header row
  debugger;
  tr = document.createElement("tr");
  $(tr).addClass("header");
  var th = document.createElement("th");
  $(th).addClass("blank");
  tr.append(th);
  headerRow.forEach((item) => {
    let th = document.createElement("th");
    let div = document.createElement("div");
    th.append(div);
    $(div).html(
      `<img src="https://flagicons.lipis.dev/flags/1x1/${item.toLowerCase()}.svg">`
    );
    div.append(item);
    tr.append(th);
  });
  table.append(tr);

  // Start table
  for (let i = 0; i < tResult.length; i++) {
    tr = document.createElement("tr");
    $(tr).addClass("row");
    td = document.createElement("td");
    td.append(tResult[i].row);
    tr.append(td);

    for (let j = 0; j < tResult[i].vals.length; j++) {
      td = document.createElement("td");
      td.append(tResult[i].vals[j]);
      tr.append(td);
      // Navigation
      $(td).click(function () {
        console.log("clicked", tResult[i].row);
        if (
          tResult[i].nav[j]?.navSheet ||
          tResult[i].nav[j]?.navSel ||
          tResult[i].nav[j]?.navClear
        ) {
          // console.log("ok");
          qlik.fun.promiseNavigationHistory(
            tResult[i].nav[j]?.navClear,
            tResult[i].nav[j]?.navSel,
            tResult[i].nav[j]?.navSheet,
            false
          );
        }
      });
    }
    table.append(tr);
  }

  // Append table
  tablearea.append(table);
  // var html = `<table>`;

  // // If graph measure is defined
  // if (graphPosition != undefined) {
  //   // Pre graph row
  //   html += `<tr class="barchart-prev">`;
  //   html += `<td><b>` + gResult[0].prevTitle + `</b></td>`;
  //   gResult.forEach((item) => {
  //     html += `<td><i>` + item.prevValues + `</i></td>`;
  //   });
  //   html += `</tr>`;

  //   // Graph row
  //   html += `<tr class="barchart">`;
  //   html +=
  //     `<td><b>` +
  //     hc.qMeasureInfo[graphPosition - 1].qFallbackTitle +
  //     `</b></td>`;
  //   html += `<td colspan = "` + headerRow.length + `"></td>`;
  //   html += `</tr>`;
  // }

  // // Header row
  // html += `<tr class="header">`;
  // html += `<th class="blank"></th>`;
  // headerRow.forEach((item) => {
  //   html +=
  //     `<th><div><img src="https://flagicons.lipis.dev/flags/1x1/${item.toLowerCase()}.svg">` +
  //     item +
  //     `</div></th>`;
  // });
  // html += `</tr>`;

  // // Start table
  // for (let i = 0; i < tResult.length; i++) {
  //   html += `<tr class="row">`;
  //   html += `<td><b>` + tResult[i].row + `</b></td>`;
  //   for (let j = 0; j < tResult[i].vals.length; j++)
  //     html +=
  //       `<td onclick="myFunction(${tResult[i]})">` +
  //       tResult[i].vals[j] +
  //       `</td>`;
  //   html += `</tr>`;
  // }

  // // Close table
  // html += `</table>`;

  // // Append table
  // document.getElementById(elementId).innerHTML = html;

  /* GRAPH LOGIC */
  if (graphPosition != undefined) {
    var graph = $("#" + elementId + " .barchart > td:last-child");
    var graphHeight = graph[0].getBoundingClientRect();

    // Create SVG
    var svg = createSVGElem(
      graph[0],
      graphHeight.width,
      graphHeight.height,
      margin
    );

    // set the ranges
    var x = d3.scaleBand().range([0, graphHeight.width]).padding(0.1);
    var y = d3.scaleLinear().range([graphHeight.height, 0]);

    // Scale the range of the data in the domains
    x.domain(gResult.map((d) => d.dimension));
    y.domain([0, d3.max(gResult, (d) => d.val)]);

    // Append bars
    svg
      .selectAll(".bar")
      .data(gResult)
      .enter()
      .append("g")
      .attr("class", "bar")
      .append("rect")
      .attr("fill", (d) => d.color)
      .attr("x", (d) => x(d.dimension))
      .attr("width", x.bandwidth())
      .attr("y", (d) => y(d.val))
      .attr("height", (d) => graphHeight.height - y(d.val));

    var bars = svg.selectAll(".bar");

    // Append text values
    bars
      .append("text")
      .attr("x", (d) => x(d.dimension) - 3)
      .attr("y", (d) => y(d.val) - 10)
      .attr("dy", ".35em")
      .text((d) => d.valQText)
      .style("font-size", "10px");

    // Get width of texts
    svg.selectAll(".bar text").each(function (d) {
      d.textWidth = this.getComputedTextLength();
    });

    // Manage arrows after text
    bars
      .append("foreignObject")
      .attr("x", (d) => x(d.dimension) + d.textWidth)
      .attr("y", (d) => y(d.val) - 18)
      .attr("width", 12)
      .attr("height", 12)
      .append("xhtml:img")
      .attr("width", 12)
      .attr("height", 12)
      .attr("src", (d) =>
        d.arrow === "True"
          ? "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Green_triangle.svg/405px-Green_triangle.svg.png"
          : "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Armed_forces_red_triangle.svg/405px-Armed_forces_red_triangle.svg.png?20060521225616"
      );

    // Append reference line
    var refLineValue = mat[0][graphPosition].qAttrExps.qValues[3].qNum;
    svg
      .append("g")
      .attr("id", "refLine_" + refLineValue)
      .append("line")
      .style("stroke", allProps.refLineColor)
      .style("stroke-width", allProps.refLineWidth)
      .style("stroke-dasharray", allProps.refLineDashArray) //("3, 3"))
      .style("stroke-dashoffset", allProps.refLineDashOffset)
      .attr("x1", 0)
      .attr("y1", y(refLineValue))
      .attr("x2", graphHeight.width)
      .attr("y2", y(refLineValue));
  }

  // console.log("End TBC");
}
