import { cpAbout, cpString, cpDropDownString, cpButtonGroup} from "./util";

var dimensionType = [
  { value: "first", label: "First dimension"},
  { value: "second", label: "Second dimension" }
]

var measureType = [
  { value: "='row'", label: "Row", tooltip: "This measure refers to a row of table"},  
  { value: "='graph'",label: "Graph", tooltip: "This measure refers to graph" }
]

export default {
  type: "items",
  component: "accordion",
  items: {
    dimensions: {
      uses: "dimensions",
      min: 1,
      max: 1,
      items: {
        type: cpDropDownString("qDef.type","Dimension type", dimensionType, "first"),
      },
    },
    measures: {
      uses: "measures",
      min: 1,
      max: 10,
      items: {
        type: cpButtonGroup("qAttributeExpressions.0.qExpression", "Measure type",  "='row'", measureType),
        prevGraphTitle: cpString("qAttributeExpressions.1.qExpression", "Prev line title", "", "optional", "string", "expression", function (data) { return data.qAttributeExpressions[0].qExpression == "='graph'" }),
        prevGraphValue: cpString("qAttributeExpressions.2.qExpression", "Prev line values", "", "always", "string", "expression", function (data) { return data.qAttributeExpressions[0].qExpression == "='graph'" }),
        refLine: cpString("qAttributeExpressions.3.qExpression", "Reference line", "", "always", "string", "expression", function (data) { return data.qAttributeExpressions[0].qExpression == "='graph'" }),
        arrow: cpString("qAttributeExpressions.4.qExpression", "Arrow", "", "always", "string", "expression", function (data) { return data.qAttributeExpressions[0].qExpression == "='graph'" }),
        barColor: cpString("qAttributeExpressions.5.qExpression", "Bar color", "", "always", "string", "expression", function (data) { return data.qAttributeExpressions[0].qExpression == "='graph'" }),
        // Navigation
				navSheet: cpString("qAttributeExpressions.6.qExpression", "Sheet Navigation", "", "always", "string", "expression"),
				navSel: cpString("qAttributeExpressions.7.qExpression", "Value to select(Field;value|Field;value:value:..)", "", "always", "string", "expression"),
				navClear: cpString("qAttributeExpressions.8.qExpression", "Value to clear(Field|Field)", "", "always", "string", "expression"),
      },
    },

    settings: {
      uses: "settings",
    },
    config: {
      type: "items",
      label: "Configuration",
      items: {
        // Insert component
        refLineColor: cpString("tbc.refLineColor", "Ref. line color", "", "optional", "string", "expression"),
        refLineWidth: cpString("tbc.refLineWidth", "Ref. line width", "", "optional", "string", "expression"),
        refLineDashArray: cpString("tbc.refLineDashArray", "Ref. line dasharray", "", "optional", "string", "expression"),
        refLineDashOffset: cpString("tbc.refLineDashOffset", "Ref. line dashoffset", "", "optional", "string", "expression"),
      },
    },

    about: cpAbout("extension", "1.0.0"),
  },
};
