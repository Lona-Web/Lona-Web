// @flow

import React from 'react';
import {
  getSpacingStyle,
  getBackgroundStyle,
  getDimensionStyle,
  getBorderStyle,
  getOrDefault
} from '../helpers';
import { Layer } from './';

import type { LonaViewLayer, LonaTextStyles, LonaColor, LonaComponent } from '../LonaTypes.js';

type Props = {
  layer: LonaViewLayer,
  textStyles: LonaTextStyles,
  colors: LonaColor[],
  components: Map<string, LonaComponent>
};

function getDimensionAndLayoutStyle(params) {
  return {
    flexDirection: getOrDefault(params.flexDirection, 'column'),
    flex: getOrDefault(params.flex, 0),
    alignItems: getOrDefault(params.alignItems, 'flex-start'),
    alignSelf: getOrDefault(params.alignSelf, 'stretch'),
    justifyContent: getOrDefault(params.justifyContent, 'flex-start')
  };
}

export default class View extends React.Component<Props, void> {
  render() {
    const { layer, textStyles, colors, components } = this.props;
    return (
      <div
        style={{
          display: 'flex',
          ...getSpacingStyle(layer.parameters),
          ...getDimensionStyle(layer.parameters),
          ...getBorderStyle(layer.parameters),
          ...getBackgroundStyle(layer.parameters, colors),
          ...getDimensionAndLayoutStyle(layer.parameters)
        }}
      >
        {layer.children.map(child => (
          <Layer
            key={child.name}
            layer={child}
            colors={colors}
            textStyles={textStyles}
            components={components}
          />
        ))}
      </div>
    );
  }
}
