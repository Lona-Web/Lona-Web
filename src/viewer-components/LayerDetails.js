// @flow

import React, { Component } from 'react';
import './LayerDetails.css';
import type { LonaLayer } from '../LonaTypes.js';

type Props = {
  layer: LonaLayer
};

export default class LayerDetails extends Component<Props, void> {
  render() {
    const { parameters, name } = this.props.layer;
    const paramList = Object.keys(parameters);
    return (
      <div className="LayerDetails">
        <h4 className="TitleXs">{name}</h4>
        <div className="LayerDetails-params">
          {paramList.map((key, val) => {
            return (
              <div className="LayerDetails-param">
                <label className="LayerDetails-param-label">{key}</label>
                <input className="LayerDetails-param-input" type="text" value={parameters[key]} readOnly />
              </div>
            );
          })}
          {/* <pre>{JSON.stringify(this.props.layer, null, 2)}</pre> */}
        </div>
      </div>
    );
  }
}
