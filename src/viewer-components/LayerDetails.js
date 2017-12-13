// @flow

import React, { Component } from 'react';

import type { LonaLayer } from '../LonaTypes.js';

type Props = {
  layer: LonaLayer
};

export default class LayerDetails extends Component<Props, void> {
  render() {
    return (
      <div className="LayerDetails">
        <h3 className="TitleSm">Layer Properties</h3>
        <div>
          <i>Display all layer properties in readonly here</i>
        </div>
      </div>
    );
  }
}
