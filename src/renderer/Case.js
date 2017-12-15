// @flow
import type { LonaComponent, LonaCase, LonaCanvas, LonaLayer, LonaColor, LonaTextStyles } from '../LonaTypes';

import React from 'react';
import { applyLogics, getPixelOrDefault, getColorOrDefault } from '../helpers';
import Icon from '../viewer-components/Icon/Icon';
import { Layer } from './primitives';

type Props = {
  component: LonaComponent,
  lonaCase: LonaCase,
  colors: LonaColor[],
  textStyles: LonaTextStyles,
  components: Map<string, LonaComponent>
};

export default class Case extends React.Component<Props, void> {
  render() {
    const { component, lonaCase } = this.props;
    const layer = applyLogics(component.logic, lonaCase.value, component.rootLayer);
    return (
      <div key={lonaCase.name} className="Case">
        <div className="Case-wrapper">
          <h4>
            {lonaCase.name}{' '}
            <button className="Case-codeButton">
              <Icon name="content_copy" size="sm" />
            </button>
          </h4>
          <div className="Canvases">
            {component.canvases.map(canvas => this.renderCanvas(component, canvas, layer))}
          </div>
        </div>
      </div>
    );
  }

  renderCanvas(component: LonaComponent, canvas: LonaCanvas, rootLayer: LonaLayer) {
    return (
      <div key={canvas.name} className="Canvas">
        <h5>{canvas.name}</h5>
        <div
          style={{
            position: 'relative',
            height: canvas.heightMode === 'Exactly' ? getPixelOrDefault(canvas.height) : '',
            mineHight: canvas.heightMode === 'At Least' ? getPixelOrDefault(canvas.height) : '',
            width: getPixelOrDefault(canvas.width),
            background: getColorOrDefault(canvas.backgroundColor, this.props.colors)
          }}
        >
          <Layer
            layer={rootLayer}
            colors={this.props.colors}
            textStyles={this.props.textStyles}
            components={this.props.components}
          />
        </div>
      </div>
    );
  }
}
