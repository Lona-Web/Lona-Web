// @flow

import React from 'react';
import {
  getSpacingStyle,
  getBackgroundStyle,
  getDimensionStyle,
  getBorderStyle,
  getOrDefault,
  getPixelOrDefault
} from '../../helpers';

import type { LonaImageLayer, LonaColor } from '../../LonaTypes.js';

type Props = {
  layer: LonaImageLayer,
  colors: LonaColor[]
};

//Todo: improve it to really support Yoga aspect ratio and apply it to other layers
class AspectRatio extends React.Component<any, any> {
  render() {
    if (this.props.aspectRatio) {
      return (
        <div style={{ position: 'relative', width: '100%' }}>
          <div
            style={{
              width: '100%',
              paddingTop: 100 / this.props.aspectRatio + '%'
            }}
          />
          {this.props.children}
        </div>
      );
    } else {
      return this.props.children;
    }
  }
}

export default class Image extends React.Component<Props, void> {
  render() {
    const { layer, colors } = this.props;
    const aspectRatioStyle = {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    };
    return (
      <AspectRatio key={layer.id} aspectRatio={layer.parameters.aspectRatio}>
        <img
          layerid={layer.id}
          alt={layer.name}
          style={{
            display: 'flex',
            ...getSpacingStyle(layer.parameters),
            ...getDimensionStyle(layer.parameters),
            ...getBorderStyle(layer.parameters, colors),
            ...getBackgroundStyle(layer.parameters, colors),
            alignSelf: getOrDefault(layer.parameters.alignSelf, 'stretch'),
            flex: getOrDefault(layer.parameters.flex, 0),
            minHeight: getPixelOrDefault(layer.parameters.height),
            minWidth: getPixelOrDefault(layer.parameters.width),
            ...(layer.parameters.aspectRatio ? aspectRatioStyle : {}) // Move to Aspect Ratio component
          }}
          src={getOrDefault(
            layer.parameters.image,
            'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
          )}
        />
      </AspectRatio>
    );
  }
}
