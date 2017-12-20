// @flow

import React from 'react';
import { getFontOrDefault, getBackgroundStyle } from '../../helpers';

import type {
  LonaTextLayer,
  LonaTextStyles,
  LonaColor
} from '../../LonaTypes.js';

type Props = {
  layer: LonaTextLayer,
  textStyles: LonaTextStyles,
  colors: LonaColor[]
};

function applyNumberOfLinesStyle(numberOfLines: ?number) {
  if (numberOfLines == null) {
    return {};
  } else {
    return {
      overflow: 'hidden',
      WebkitLineClamp: numberOfLines,
      WebkitBoxOrient: 'vertical',
      display: '-webkit-box'
    };
  }
}

export default class Text extends React.Component<Props, void> {
  render() {
    const { layer, textStyles, colors } = this.props;
    const textStyle = getFontOrDefault(layer.parameters.font, textStyles);
    return (
      <span
        lonaid={layer.name}
        key={layer.name}
        style={{
          ...getBackgroundStyle(layer.parameters, colors),
          ...applyNumberOfLinesStyle(layer.parameters.numberOfLines),
          fontFamily: textStyle.fontFamily,
          fontWeight: textStyle.fontWeight,
          fontSize: textStyle.fontSize + 'px',
          lineHeight: textStyle.lineHeight + 'px',
          color: textStyle.color
        }}
      >
        {layer.parameters.text}
      </span>
    );
  }
}
