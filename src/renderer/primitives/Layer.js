// @flow

import React from 'react';
import type { LonaLayer, LonaTextStyles, LonaColor, LonaComponent } from '../../LonaTypes.js';
import { View, Image, Text, ComponentLayer } from './';

type Props = {
  layer: LonaLayer,
  colors: LonaColor[],
  textStyles: LonaTextStyles,
  components: Map<string, LonaComponent>
};

const Layer = (props: Props) => {
  const { layer, colors, textStyles, components } = props;
  if (layer.parameters.visible === false) {
    return null;
  }

  switch (layer.type) {
    case 'View':
      return <View layer={layer} textStyles={textStyles} colors={colors} components={components} />;
    case 'Image':
      return <Image layer={layer} colors={colors} />;
    case 'Text':
      return <Text layer={layer} textStyles={textStyles} colors={colors} />;
    case 'Component':
      return <ComponentLayer layer={layer} textStyles={textStyles} colors={colors} components={components} />;
    default:
      throw new Error('Layer type not supported: ' + layer.type);
  }
};

export default Layer;
