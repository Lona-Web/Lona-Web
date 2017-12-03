// @flow

import { cloneDeep, flatten } from "lodash";
import React, { Component } from "react";
import "./App.css";
import Sidebar from './viewer-components/Sidebar';

import colorsData from "./data/colors.js";
import cardComponent from "./data/Card.component.js";
import listItemComponent from "./data/ListItem.component.js";
import teamComponent from "./data/Team.component.js";
import textStyles from "./data/textStyles.js";
import type {
  LonaLayer,
  LonaTextLayer,
  LonaViewLayer,
  LonaImageLayer,
  LonaComponent,
  LonaTextStyles,
  LonaTextStyle,
  LonaColor,
  LonaCase,
  LonaCanvas,
  LonaLogic,
  LonaAssignLhsToRhs,
  LonaIdentifier,
  LonaIfValue,
  LonaVariable
} from "./LonaTypes.js";

const components: Array<[string, LonaComponent]> = [
  ["Team", teamComponent],
  ["Card", cardComponent],
  ["ListItem", listItemComponent]
];

class App extends Component<any, any> {
  render() {
    return (
      <div className="App">
        <div className="App-sidebar">
          <Sidebar/>
        </div>
        <div className="App-body">
          <div className="section">
            <h2 className="section-title">Components</h2>
            <div className="components-container">
              {components.map(component =>
                this.renderComponent(component[0], component[1])
              )}
            </div>
          </div>
          <div className="section">
            <h2 className="section-title">Colors</h2>
            <div className="colors-container">
              {colorsData.colors.map(color => (
                <div className="color-container">
                  <div
                    className="color-display"
                    style={{ background: color.value }}
                  />
                  <div className="color-name">{color.name}</div>
                  <div className="color-value">{color.value}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="section">
            <h2 className="section-title">Text Styles</h2>
            <div className="text-styles-container">
              {textStyles.styles.map(textStyle => (
                <div
                  style={{
                    fontFamily: textStyle.fontFamily,
                    fontWeight: textStyle.fontWeight,
                    fontSize: textStyle.fontSize + "px",
                    lineHeight: textStyle.lineHeight + "px",
                    color: textStyle.color
                  }}
                >
                  {textStyle.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderComponent(name: string, component: LonaComponent) {
    return (
      <div>
        <h3>{name}</h3>
        <div className="grid-bg cases-container">
          {component.cases.map(lonaCase =>
            this.renderComponentCase(component, lonaCase)
          )}
        </div>
      </div>
    );
  }

  renderComponentCase(component: LonaComponent, lonaCase: LonaCase) {
    const layer: LonaLayer = cloneDeep(component.rootLayer);
    const layers = flattenLayers(layer);
    for (var logic of component.logic) {
      applyLogic(logic, lonaCase.value, layers);
    }

    return (
      <div className="case-container">
        {component.canvases.map(canvas =>
          this.renderCanvas(component, canvas, layer)
        )}
      </div>
    );
  }

  renderCanvas(
    component: LonaComponent,
    canvas: LonaCanvas,
    rootLayer: LonaLayer
  ) {
    return (
      <div
        style={{
          position: "relative",
          margin: "20px",
          height:
            canvas.heightMode === "Exactly"
              ? getPixelOrDefault(canvas.height)
              : "",
          mineHight:
            canvas.heightMode === "At Least"
              ? getPixelOrDefault(canvas.height)
              : "",
          width: getPixelOrDefault(canvas.width),
          background: getColorOrDefault(
            canvas.backgroundColor,
            colorsData.colors
          )
        }}
      >
        {this.renderLayer(rootLayer)}
      </div>
    );
  }

  renderLayer(layer: LonaLayer) {
    switch (layer.type) {
      case "View":
        return this.renderViewLayer(layer);
      case "Image":
        return this.renderImageLayer(layer);
      case "Text":
        return this.renderTextLayer(layer);
      case "Component": {
        const componentWithName = components.find(t => t[0] === layer.url);
        if (componentWithName == null) {
          throw new Error(`Component not found : ${layer.url}`);
        }
        const component = componentWithName[1];
        const componentLayer: LonaLayer = cloneDeep(component.rootLayer);
        const layers = flattenLayers(componentLayer);
        for (var logic of component.logic) {
          applyLogic(logic, layer.parameters, layers);
        }
        return this.renderLayer(componentLayer);
      }
      default:
        throw new Error("Layer type not supported: " + layer.type);
    }
  }

  renderViewLayer(layer: LonaViewLayer) {
    return (
      <div
        style={{
          ...getDisplayStyle(layer),
          ...getSpacingStyle(layer),
          ...getDimensionStyle(layer),
          ...getBorderStyle(layer),
          ...getBackgroundStyle(layer),
          ...getDimensionAndLayoutStyle(layer)
        }}
      >
        {layer.children.map(child => this.renderLayer(child))}
      </div>
    );
  }

  renderImageLayer(layer: LonaImageLayer) {
    // Todo: Aspect Ratio
    return (
      <img
        style={{
          ...getDisplayStyle(layer),
          ...getSpacingStyle(layer),
          ...getDimensionStyle(layer),
          ...getBorderStyle(layer),
          ...getBackgroundStyle(layer),
          ...getDimensionAndLayoutStyle(layer),
          minHeight: getPixelOrDefault(layer.parameters.height),
          minWidth: getPixelOrDefault(layer.parameters.width)
        }}
        src={getOrDefault(
          layer.parameters.image,
          "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
        )}
      />
    );
  }

  renderTextLayer(layer: LonaTextLayer) {
    const textStyle = getFontOrDefault(layer.parameters.font, textStyles);
    return (
      <span
        style={{
          ...getDisplayStyle(layer),
          ...getBackgroundStyle(layer),
          fontFamily: textStyle.fontFamily,
          fontWeight: textStyle.fontWeight,
          fontSize: textStyle.fontSize + "px",
          lineHeight: textStyle.lineHeight + "px",
          color: textStyle.color
        }}
      >
        {layer.parameters.text}
      </span>
    );
  }
}

export default App;

function flattenLayers(layer: LonaLayer): LonaLayer[] {
  switch (layer.type) {
    case "Text":
    case "Image":
    case "Component":
      return [layer];
    case "View":
      return flatten(layer.children.map(flattenLayers)).concat(layer);
    default:
      throw new Error("Unkown layer type" + layer.type);
  }
}

function applyLogic(logic: LonaLogic, parameters: {}, layers: LonaLayer[]) {
  switch (logic.function.name) {
    case "assign(lhs, to rhs)": {
      applyAssignLhsToRhsLogic(logic.function, parameters, layers);
      break;
    }
    case "if(value)": {
      applyIfValueLogic(logic.function, logic.nodes, parameters, layers);
      break;
    }
    default:
      throw new Error(`function not supported (${logic.function.name})`);
  }
}

function applyIfValueLogic(
  fn: LonaIfValue,
  nodes: LonaLogic[],
  parameters: {},
  layers: LonaLayer[]
) {
  const value = extractValue(fn.arguments.value, parameters);
  if (value) {
    for (var logic of nodes) {
      applyLogic(logic, parameters, layers);
    }
  }
}

function applyAssignLhsToRhsLogic(
  fn: LonaAssignLhsToRhs,
  parameters: {},
  layers: LonaLayer[]
) {
  const lhsValue = extractValue(fn.arguments.lhs, parameters);
  if (lhsValue != null) {
    setRhsValue(fn.arguments.rhs, layers, lhsValue);
  }
}

function extractValue(variable: LonaVariable, parameters: {}) {
  switch (variable.type) {
    case "identifier": {
      if (variable.value.path[0] === "parameters") {
        return parameters[variable.value.path[1]];
      }
      break;
    }
    case "value": {
      return variable.value.data;
    }
  }

  throw new Error(`LonaVariable not supported (${JSON.stringify(variable)})`);
}

function setRhsValue(rhs: LonaIdentifier, layers: LonaLayer[], value: any) {
  switch (rhs.type) {
    case "identifier": {
      if (rhs.value.path[0] === "layers") {
        const layer = layers.find(l => l.name === rhs.value.path[1]);
        if (layer == null) {
          throw new Error("Layer not found");
        }
        layer.parameters[rhs.value.path[2]] = value;
        return;
      }
    }
  }

  throw new Error("Rhs not supported");
}

function getPixelOrDefault(value: number | void, fallback: string = "") {
  return value ? value + "px" : fallback;
}

function getFontOrDefault(
  textStyleId: string,
  textStyles: LonaTextStyles
): LonaTextStyle {
  const result = textStyles.styles.find(style => style.id === textStyleId);
  if (result) {
    return result;
  }

  const defaultStyle = textStyles.styles.find(
    style => style.id === textStyles.defaultStyleName
  );
  if (defaultStyle) {
    return defaultStyle;
  }

  throw new Error("Text style not found");
}

function getOrDefault(value, fallback) {
  return value == null ? fallback : value;
}

function getColorOrDefault(
  colorId: string | void,
  colors: LonaColor[]
): string {
  if (colorId == null) {
    return "";
  }

  const result = colors.find(color => color.id === colorId);
  if (result) {
    return result.value;
  }

  return colorId;
}

function getSpacingStyle(layer) {
  return {
    paddingTop: getPixelOrDefault(layer.parameters.paddingTop),
    paddingRight: getPixelOrDefault(layer.parameters.paddingRight),
    paddingBottom: getPixelOrDefault(layer.parameters.paddingBottom),
    paddingLeft: getPixelOrDefault(layer.parameters.paddingLeft),

    marginTop: getPixelOrDefault(layer.parameters.marginTop),
    marginRight: getPixelOrDefault(layer.parameters.marginRight),
    marginBottom: getPixelOrDefault(layer.parameters.marginBottom),
    marginLeft: getPixelOrDefault(layer.parameters.marginLeft)
  };
}

function getDimensionStyle(layer) {
  return {
    height: getPixelOrDefault(layer.parameters.height),
    width: getPixelOrDefault(layer.parameters.width)
  };
}

function getBorderStyle(layer) {
  return {
    borderColor: layer.parameters.borderColor,
    borderRadius: getPixelOrDefault(layer.parameters.borderRadius),
    borderWidth: getPixelOrDefault(layer.parameters.borderWidth)
  };
}

function getDimensionAndLayoutStyle(layer) {
  return {
    flexDirection: getOrDefault(layer.parameters.flexDirection, "column"),
    flex: getOrDefault(layer.parameters.flex, 0),
    alignItems: getOrDefault(layer.parameters.alignItems, "flex-start"),
    alignSelf: getOrDefault(layer.parameters.alignSelf, "stretch"),
    justifyContent: getOrDefault(layer.parameters.justifyContent, "flex-start")
  };
}

function getDisplayStyle(layer) {
  return {
    display: getOrDefault(layer.parameters.visible, true) ? "flex" : "none"
  };
}

function getBackgroundStyle(layer) {
  return {
    background: getColorOrDefault(
      layer.parameters.backgroundColor,
      colorsData.colors
    )
  };
}
