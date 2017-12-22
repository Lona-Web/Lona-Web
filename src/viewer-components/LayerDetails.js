// @flow

import React, { Component } from 'react';
import './LayerDetails.css';
import type { LonaLayer } from '../LonaTypes.js';

type Props = {
  layer: LonaLayer
};

type Group = {
  label: string,
  parameters: Array<string>
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
    const { type, parameters } = this.props.layer;

    let componentGroup = null;
    if (type === 'Component') {
      const componentParamsGroup = {
        label: 'Parameters',
        parameters: Object.keys({ ...parameters })
      };
      componentGroup = this.renderGroup(componentParamsGroup);
    }

    return (
      <div className="LayerDetails">
        {/* <h4 className="TitleXs">{name}</h4> */}

        {layerParametersGroups.map((group: Group, i: number) => {
          const hasValueInGroup = group.parameters.some(key => parameters[key]);
          if (hasValueInGroup) return this.renderGroup(group, i);
          else return false;
        })}

        {componentGroup}
      </div>
    );
  }

  renderGroup(group: Group, key: number = 0) {
    return (
      <div key={key} className={`LayerDetails-group ${group.label}`}>
        <h5 className="TitleXs LayerDetails-group-label">{group.label}</h5>
        <div className="LayerDetails-group-body">
          {group.parameters.map((paramKey, f) => this.renderParam(paramKey, f))}
        </div>
      </div>
    );
  }

  renderParam(paramKey: string, key: number = 0) {
    const { parameters } = this.props.layer;
    const value = parameters[paramKey];
    let paramTemplate = (
      <input
        className="LayerDetails-param-input"
        type="text"
        value={value}
        readOnly
      />
    );

    if (paramKey === 'backgroundColor') {
      paramTemplate = (
        <div className="LayerDetails-param-color">
          <div
            className="LayerDetails-param-color-body"
            style={{ backgroundColor: value }}
          />
          {value}
        </div>
      );
    }

    return (
      <div key={key} className={`LayerDetails-param ${paramKey}`}>
        <label className="LayerDetails-param-label">{paramKey}</label>
        {paramTemplate}
      </div>
    );
  }
}
