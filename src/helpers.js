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
    width: getPixelOrDefault(params.width),
    minWidth: '0px'
  };
}

export function getBorderStyle(params: LonaLayerParameters, colors: LonaColor[]) {
  return {
    borderStyle: 'solid',
    borderWidth: getPixelOrDefault(params.borderWidth, '0px'),
    borderColor: getColorOrDefault(params.borderColor, colors),
    borderRadius: getPixelOrDefault(params.borderRadius, '')
  };
}

export function getOrDefault<T>(value: ?T, fallback: T): T {
  return value == null ? fallback : value;
}

export function applyLogics(logics: LonaLogic[], parameters: {}, layer: LonaLayer): LonaLayer {
  return logics.reduce((l, logic) => applyLogic(logic, parameters, l), layer);
}

export function applyLogic(logic: LonaLogic, parameters: {}, layer: LonaLayer): LonaLayer {
  switch (logic.function.name) {
    case 'assign(lhs, to rhs)': {
      return applyAssignLhsToRhsLogic(logic.function, parameters, layer);
    }
    case 'if(value)': {
      return applyIfValueLogic(logic.function, logic.nodes, parameters, layer);
    }
    default:
      throw new Error(`function not supported (${logic.function.name})`);
  }
}

function applyAssignLhsToRhsLogic(fn: LonaAssignLhsToRhs, parameters: {}, layer: LonaLayer): LonaLayer {
  const valueToAssign = extractValue(fn.arguments.lhs, parameters);
  if (valueToAssign == null) {
    return layer;
  }

  if (fn.arguments.rhs.type !== 'identifier' || fn.arguments.rhs.value.path[0] !== 'layers') {
    throw new Error(`Rhs not supported (${JSON.stringify(fn.arguments.rhs)}`);
  }

  const layerName = fn.arguments.rhs.value.path[1];
  const parameterName = fn.arguments.rhs.value.path[2];

  return assignParameterToLayer(layer, layerName, parameterName, valueToAssign);
}

function assignParameterToLayer(
  layer: LonaLayer,
  layerName: string,
  parameterName: string,
  value: any
): LonaLayer {
  if (layer.name === layerName) {
    return {
      ...layer,
      parameters: {
        ...layer.parameters,
        [parameterName]: value
      }
    };
  }

  if (layer.type === 'View') {
    return {
      ...layer,
      children: layer.children.map(child => assignParameterToLayer(child, layerName, parameterName, value))
    };
  }

  return layer;
}

function applyIfValueLogic(fn: LonaIfValue, nodes: LonaLogic[], parameters: {}, layer: LonaLayer): LonaLayer {
  const value = extractValue(fn.arguments.value, parameters);
  if (value) {
    return applyLogics(nodes, parameters, layer);
  }
  return layer;
}

function extractValue(variable: LonaVariable, parameters: {}): any {
  switch (variable.type) {
    case 'identifier': {
      if (variable.value.path[0] === 'parameters') {
        return parameters[variable.value.path[1]];
      }
      throw new Error(`LonaVariable not supported (${JSON.stringify(variable)})`);
    }
    case 'value': {
      return variable.value.data;
    }
    default:
      throw new Error(`LonaVariable not supported (${JSON.stringify(variable)})`);
  }
}
