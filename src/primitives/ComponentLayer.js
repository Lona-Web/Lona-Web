// @flow

import React from 'react';
import { cloneDeep, flatten } from 'lodash';
import { applyLogic } from '../helpers';
import { Layer } from './';

import type {
  LonaLayer,
  LonaComponentLayer,
  LonaComponent,
  LonaTextStyles,
  LonaColor
} from '../LonaTypes.js';

type Props = {
  layer: LonaComponentLayer,
  textStyles: LonaTextStyles,
  colors: LonaColor[],
  components: Map<string, LonaComponent>
};

export default class View extends React.Component<Props, void> {
  render() {
    const { layer, textStyles, colors, components } = this.props;
    const component = components.get(layer.url);
    if (component === undefined) {
      throw new Error(`Component not found : ${layer.url}`);
    }
    const componentLayer: LonaLayer = cloneDeep(component.rootLayer);
    const layers = flattenLayers(componentLayer);
    for (var logic of component.logic) {
      applyLogic(logic, layer.parameters, layers);
    }
    return <Layer layer={componentLayer} textStyles={textStyles} colors={colors} components={components} />;
  }
}

function flattenLayers(layer: LonaLayer): LonaLayer[] {
  switch (layer.type) {
    case 'Text':
    case 'Image':
    case 'Component':
      return [layer];
    case 'View':
      return flatten(layer.children.map(flattenLayers)).concat(layer);
    default:
      throw new Error('Unkown layer type' + layer.type);
  }
}
