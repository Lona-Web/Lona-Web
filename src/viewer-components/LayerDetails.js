// @flow

import React, { Component } from 'react';
import './LayerDetails.css';
import type { LonaLayer, LonaColor } from '../LonaTypes.js';

import { getColorOrDefault } from '../helpers';

type Props = {
  layer: LonaLayer,
  colors: LonaColor[]
};

type Group = {
  label: string,
  parameters: Array<string>
};

const layerParametersGroups = [
  {
    label: 'Text',
    parameters: ['font', 'numberOfLines', 'text']
  },
  {
    label: 'Position',
    parameters: ['position', 'top', 'right', 'left', 'bottom']
  },
  {
    label: 'Box',
    parameters: [
      'marginTop',
      'marginRight',
      'marginLeft',
      'marginBottom',
      'paddingTop',
      'paddingRight',
      'paddingLeft',
      'paddingBottom',
      'width',
      'height'
    ]
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
      'itemSpacing',
      'aspectRatio'
    ]
  },
  {
    label: 'Borders',
    parameters: ['borderColor', 'borderRadius', 'borderWidth']
  },
  {
    label: 'Background',
    parameters: ['backgroundColor']
  }
];

export default class LayerDetails extends Component<Props, void> {
  render() {
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
        {layerParametersGroups.map((group: Group, i: number) => {
          const hasValueInGroup = group.parameters.some(key => parameters[key]);
          if (hasValueInGroup) {
            if (group.label === 'Box') {
              return this.renderBoxGroup(group, i);
            } else {
              return this.renderGroup(group, i);
            }
          } else {
            return false;
          }
        })}
        {componentGroup}
      </div>
    );
  }

  renderGroup(group: Group, key: number = 0) {
    return (
      <div key={key} className={`LayerDetails-group`}>
        <h5 className="TitleXs LayerDetails-group-label">{group.label}</h5>
        <div className="LayerDetails-group-body">
          {group.parameters.map((paramKey, f) => this.renderParam(paramKey, f))}
        </div>
      </div>
    );
  }

  renderBoxGroup(group: Group, key: number = 0) {
    const { parameters } = this.props.layer;

    const displayBoxModelValue = (paramKey: string, pos: ?string) => {
      const isActive = parameters[paramKey];
      const activeClass = isActive ? 'is-active' : '';
      const posClass = pos ? 'BoxModel-value--' + pos : '';
      return (
        <div className={`BoxModel-value ${posClass} ${activeClass}`}>
          {isActive ? parameters[paramKey] : '-'}
        </div>
      );
    };

    return (
      <div key={key} className="LayerDetails-group">
        <h5 className="TitleXs LayerDetails-group-label">{group.label}</h5>
        <div className="LayerDetails-group-body">
          <div className="BoxModel">
            <div className="BoxModel-margin">
              <div className="BoxModel-title">Margin</div>
              {displayBoxModelValue('marginTop', 'top')}
              {displayBoxModelValue('marginRight', 'right')}
              {displayBoxModelValue('marginLeft', 'left')}
              {displayBoxModelValue('marginBottom', 'bottom')}
              <div className="BoxModel-padding">
                <div className="BoxModel-title">Padding</div>
                {displayBoxModelValue('paddingTop', 'top')}
                {displayBoxModelValue('paddingRight', 'right')}
                {displayBoxModelValue('paddingLeft', 'left')}
                {displayBoxModelValue('paddingBottom', 'bottom')}
                <div className="BoxModel-content">
                  {displayBoxModelValue('width')}
                  <div className="BoxModel-separator">x</div>
                  {displayBoxModelValue('height')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderParam(paramKey: string, key: number = 0) {
    const { parameters } = this.props.layer;
    const { colors } = this.props;
    const value = parameters[paramKey];

    let paramTemplate = null;

    if (paramKey === 'backgroundColor') {
      const color = getColorOrDefault(value, colors);
      paramTemplate = this.getColorParamTemplate(value, color);
    } else if (paramKey === 'text') {
      paramTemplate = this.getTextParamTemplate(value);
    } else {
      paramTemplate = this.getDefaultParamTemplate(value);
    }

    return (
      <div key={key} className={`LayerDetails-param ${paramKey}`}>
        <label className="LayerDetails-param-label">{paramKey}</label>
        {paramTemplate}
      </div>
    );
  }

  getDefaultParamTemplate(value: string) {
    return (
      <input
        className="LayerDetails-param-input"
        type="text"
        value={value}
        readOnly
      />
    );
  }

  getColorParamTemplate(value: string, color: string) {
    return (
      <div className="LayerDetails-param-color">
        <div
          className="LayerDetails-param-color-body"
          style={{ backgroundColor: color }}
        />
        {value}
      </div>
    );
  }

  getTextParamTemplate(value: string) {
    return (
      <textarea className="LayerDetails-param-text" readOnly value={value} />
    );
  }
}
