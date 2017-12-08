// @flow

import React, { Component } from 'react';
import { flatten } from 'lodash';

import type { LonaComponent, LonaLayer } from '../LonaTypes.js';

type Props = {
  component: LonaComponent,
  selectedLayerName: ?string,
  onSelectLayer: (layerName: string) => void
};

type LayerItem = {
  name: string,
  depth: number
};

function flattenLayers(layer: LonaLayer, depth: number): LayerItem[] {
  if (layer.type === 'View') {
    return [
      {
        name: layer.name,
        depth
      }
    ].concat(flatten(layer.children.map(child => flattenLayers(child, depth + 1))));
  } else {
    return [
      {
        name: layer.name,
        depth
      }
    ];
  }
}

export default class ComponentTree extends Component<Props, void> {
  render() {
    const items = flattenLayers(this.props.component.rootLayer, 0);
    return (
      <div className="ComponentTree">
        <ul>
          {items.map(item => {
            return (
              <li key={item.name}>
                <a
                  className={this.props.selectedLayerName === item.name ? 'is-selected' : ''}
                  onClick={() => this.props.onSelectLayer(item.name)}
                >
                  <div style={{ paddingLeft: item.depth * 12 + 'px' }}>{item.name}</div>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
