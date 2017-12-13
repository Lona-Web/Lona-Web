// @flow

import { flatten } from 'lodash';

import type {
  LonaLayer,
  LonaTextStyles,
  LonaTextStyle,
  LonaComponent,
  LonaColor,
  LonaLogic,
  LonaAssignLhsToRhs,
  LonaIdentifier,
  LonaIfValue,
  LonaVariable,
  LonaLayerParameters
} from './LonaTypes.js';

export function flattenLayers(layer: LonaLayer): LonaLayer[] {
  if (layer.type === 'View') {
    return [layer].concat(flatten(layer.children.map(child => flattenLayers(child))));
  } else {
    return [layer];
  }
}

export function flattenComponentLayers(component: LonaComponent) {
  return flattenLayers(component.rootLayer);
}

export function getFontOrDefault(textStyleId: string, textStyles: LonaTextStyles): LonaTextStyle {
  const result = textStyles.styles.find(style => style.id === textStyleId);
  if (result) {
    return result;
  }

  const defaultStyle = textStyles.styles.find(style => style.id === textStyles.defaultStyleName);
  if (defaultStyle) {
    return defaultStyle;
  }

  throw new Error('Text style not found');
}

export function getBackgroundStyle(params: LonaLayerParameters, colors: LonaColor[]) {
  return {
    background: getColorOrDefault(params.backgroundColor, colors)
  };
}

export function getColorOrDefault(colorId: ?string, colors: LonaColor[]): string {
  if (colorId == null) {
    return '';
  }

  const result = colors.find(color => color.id === colorId);
  if (result) {
    return result.value;
  }

  return colorId;
}

export function getSpacingStyle(params: LonaLayerParameters) {
  return {
    paddingTop: getPixelOrDefault(params.paddingTop),
    paddingRight: getPixelOrDefault(params.paddingRight),
    paddingBottom: getPixelOrDefault(params.paddingBottom),
    paddingLeft: getPixelOrDefault(params.paddingLeft),

    marginTop: getPixelOrDefault(params.marginTop),
    marginRight: getPixelOrDefault(params.marginRight),
    marginBottom: getPixelOrDefault(params.marginBottom),
    marginLeft: getPixelOrDefault(params.marginLeft)
  };
}

export function getPixelOrDefault(value: ?number, fallback: string = '') {
  return value ? value + 'px' : fallback;
}

export function getDimensionStyle(params: LonaLayerParameters) {
  return {
    height: getPixelOrDefault(params.height),
    width: getPixelOrDefault(params.width)
  };
}

export function getBorderStyle(params: LonaLayerParameters) {
  return {
    borderColor: params.borderColor,
    borderRadius: getPixelOrDefault(params.borderRadius),
    borderWidth: getPixelOrDefault(params.borderWidth)
  };
}

export function getOrDefault<T>(value: ?T, fallback: T): T {
  return value == null ? fallback : value;
}

export function applyLogic(logic: LonaLogic, parameters: {}, layers: LonaLayer[]) {
  switch (logic.function.name) {
    case 'assign(lhs, to rhs)': {
      applyAssignLhsToRhsLogic(logic.function, parameters, layers);
      break;
    }
    case 'if(value)': {
      applyIfValueLogic(logic.function, logic.nodes, parameters, layers);
      break;
    }
    default:
      throw new Error(`function not supported (${logic.function.name})`);
  }
}

function applyIfValueLogic(fn: LonaIfValue, nodes: LonaLogic[], parameters: {}, layers: LonaLayer[]) {
  const value = extractValue(fn.arguments.value, parameters);
  if (value) {
    for (var logic of nodes) {
      applyLogic(logic, parameters, layers);
    }
  }
}

function applyAssignLhsToRhsLogic(fn: LonaAssignLhsToRhs, parameters: {}, layers: LonaLayer[]) {
  const lhsValue = extractValue(fn.arguments.lhs, parameters);
  if (lhsValue != null) {
    setRhsValue(fn.arguments.rhs, layers, lhsValue);
  }
}

function extractValue(variable: LonaVariable, parameters: {}) {
  switch (variable.type) {
    case 'identifier': {
      if (variable.value.path[0] === 'parameters') {
        return parameters[variable.value.path[1]];
      }
      break;
    }
    case 'value': {
      return variable.value.data;
    }
  }

  throw new Error(`LonaVariable not supported (${JSON.stringify(variable)})`);
}

function setRhsValue(rhs: LonaIdentifier, layers: LonaLayer[], value: any) {
  switch (rhs.type) {
    case 'identifier': {
      if (rhs.value.path[0] === 'layers') {
        const layer = layers.find(l => l.name === rhs.value.path[1]);
        if (layer == null) {
          throw new Error('Layer not found');
        }
        layer.parameters[rhs.value.path[2]] = value;
        return;
      }
    }
  }

  throw new Error('Rhs not supported');
}
