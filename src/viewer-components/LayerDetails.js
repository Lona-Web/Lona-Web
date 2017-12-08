// @flow

import React, { Component } from 'react';
import { flatten } from 'lodash';

import type { LonaLayer } from '../LonaTypes.js';

type Props = {
  layer: LonaLayer
};

export default class LayerDetails extends Component<Props, void> {
  render() {
    return (
      <div className="LayerDetails">
        <h4>Layer Properties</h4>
        <div>
          <i>Display all layer properties in readonly here</i>
        </div>
      </div>
    );
  }
}
