export const createProps = (layout) => {
  var tbc = layout.tbc;
  var allProps = {
    // Reference line settings
    refLineColor:
      tbc.refLineColor && tbc.refLineColor != null && tbc.refLineColor != ""
        ? tbc.refLineColor
        : "black",
    refLineWidth:
      tbc.refLineWidth && tbc.refLineWidth != null && tbc.refLineWidth != ""
        ? tbc.refLineWidth
        : "0.5",
    refLineDashArray:
      tbc.refLineDashArray &&
      tbc.refLineDashArray != null &&
      tbc.refLineDashArray != ""
        ? tbc.refLineDashArray
        : "3",
    refLineDashOffset:
      tbc.refLineDashOffset &&
      tbc.refLineDashOffset != null &&
      tbc.refLineDashOffset != ""
        ? tbc.refLineDashOffset
        : "0.5",
  };
  return allProps;
};
