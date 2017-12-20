// @flow

import React, { Component } from 'react';
import './LayerDetails.css';
import type { LonaLayer } from '../LonaTypes.js';

type Props = {
  layer: LonaLayer
};

type Group = {
  label: string,
  parameters: string[]
};

const layerParametersGroups = [
  {
    label: 'Text',
    parameters: ['text', 'font', 'numberOfLines']
  },
  {
    label: 'Layout',
    parameters: [
      'visible',
      'flex',
      'alignSelf',
      'flexDirection',
      'alignItems',
      'justifyContent',
      'itemSpacing'
    ]
  },
  {
    label: 'Dimensions',
    parameters: ['width', 'height', 'aspectRatio']
  },
  {
    label: 'Position',
    parameters: ['position', 'top', 'right', 'left', 'bottom']
  },
  {
    label: 'Spacing',
    parameters: [
      'marginTop',
      'marginRight',
      'marginLeft',
      'marginBottom',
      'paddingTop',
      'paddingRight',
      'paddingLeft',
      'paddingBottom'
    ]
  },
  {
    label: 'Background',
    parameters: ['backgroundColor']
  },
  {
    label: 'Borders',
    parameters: ['borderColor', 'borderRadius', 'borderWidth']
  }
];

export default class LayerDetails extends Component<Props, void> {
  render() {
    const { name } = this.props.layer;
    const { parameters } = this.props.layer;

    return (
      <div className="LayerDetails">
        <h4 className="TitleXs">{name}</h4>

        {layerParametersGroups.map((group, i) => {
          const hasNoValueInGroupParams = group.parameters.every(
            key => !parameters[key]
          );

          if (hasNoValueInGroupParams) return false;

          return (
            <div key={i} className="LayerDetails-group">
              <h5 className="TitleXs LayerDetails-group-label">
                {group.label}
              </h5>
              <div className="LayerDetails-group-body">
                {this.renderGroup(group)}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  renderGroup(group: Group) {
    const { parameters } = this.props.layer;

    return group.parameters.map((key, f) => {
      return (
        <div key={f} className="LayerDetails-param">
          <label className="LayerDetails-param-label">{key}</label>
          <input
            className="LayerDetails-param-input"
            type="text"
            value={parameters[key] ? parameters[key] : ''}
            readOnly
          />
        </div>
      );
    });
  }
}
