// @flow

import React from 'react';
import { applyLogics } from '../helpers';
import { Layer } from './';

import type { LonaComponentLayer, LonaComponent, LonaTextStyles, LonaColor } from '../LonaTypes.js';

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
    const layerWithLogicApplied = applyLogics(component.logic, layer.parameters, component.rootLayer);
    return (
      <Layer layer={layerWithLogicApplied} textStyles={textStyles} colors={colors} components={components} />
    );
  }
}
