// @flow

import { cloneDeep, flatten } from 'lodash';
import React, { Component } from 'react';
import './App.css';
import Sidebar from './viewer-components/Sidebar';
import Toolbar from './viewer-components/Toolbar';
import ComponentTree from './viewer-components/ComponentTree';
import LayerDetails from './viewer-components/LayerDetails';

import { flattenComponentLayers } from './helpers';
import colorsData from './data/colors.js';
import cardComponent from './data/Card.component.js';
import listItemComponent from './data/ListItem.component.js';
import teamComponent from './data/Team.component.js';
import textStyles from './data/textStyles.js';
import type {
  LonaLayer,
  LonaTextLayer,
  LonaViewLayer,
  LonaImageLayer,
  LonaComponent,
  LonaTextStyles,
  LonaTextStyle,
  LonaColor,
  LonaCase,
  LonaCanvas,
  LonaLogic,
  LonaAssignLhsToRhs,
  LonaIdentifier,
  LonaIfValue,
  LonaVariable
} from './LonaTypes.js';

const components: Array<[string, LonaComponent]> = [
  ['Team', teamComponent],
  ['Card', cardComponent],
  ['ListItem', listItemComponent]
];

type Props = {
  selectedItem: string,
  selectedLayer: ?string,
  isToolbarOpen: boolean
};

class App extends Component<any, Props> {
  constructor(props: any) {
    super(props);
    this.state = {
      selectedItem: 'Team',
      selectedLayer: null
    };
  }

  handleComponentSelected = (item: string) => {
    this.setState({
      selectedItem: item
    });
  };

  handleOnToolbarToggle = () => {
    this.setState({
      isToolbarOpen: !this.state.isToolbarOpen
    });
  };

  selectedComponent(): LonaComponent {
    const component = components.find(x => x[0] === this.state.selectedItem);

    if (component == null) {
      throw new Error('Component not found');
    }

    return component[1];
  }

  render() {
    const { selectedItem, isToolbarOpen } = this.state;
    return (
      <div className={isToolbarOpen ? 'App is-toolbar-open' : 'App'}>
        <div className="App-sidebar">
          <Sidebar
            items={['Team', 'Card', 'ListItem', 'Colors', 'Text Styles']}
            onItemClick={this.handleComponentSelected}
            selectedItem={selectedItem}
          >
            {this.renderComponentTree()}
          </Sidebar>
        </div>
        <div className="App-body">
          <div className="section">
            <h2 className="section-title">{selectedItem}</h2>
            <div className="components-container">{this.renderContent()}</div>
          </div>
        </div>
        <div className="App-toolbar">
          <Toolbar isOpen={isToolbarOpen} onToggle={this.handleOnToolbarToggle}>
            {this.renderLayerDetails()}
          </Toolbar>
        </div>
      </div>
    );
  }

  renderLayerDetails() {
    if (this.state.selectedItem === 'Colors' || this.state.selectedItem === 'Text Styles') {
      return null;
    }

    const component = this.selectedComponent();
    const layer = flattenComponentLayers(component).find(l => l.name === this.state.selectedLayer);

    if (layer == null) {
      return null;
    }

    return <LayerDetails layer={layer} />;
  }

  renderComponentTree() {
    if (this.state.selectedItem === 'Colors' || this.state.selectedItem === 'Text Styles') {
      return null;
    }

    return (
      <ComponentTree
        component={this.selectedComponent()}
        selectedLayerName={this.state.selectedLayer}
        onSelectLayer={layerName =>
          this.setState({
            selectedLayer: layerName
          })
        }
      />
    );
  }

  renderContent() {
    if (this.state.selectedItem === 'Colors') {
      return <ColorComponent />;
    }

    if (this.state.selectedItem === 'Text Styles') {
      return <TextStyleComponent />;
    }

    const component = this.selectedComponent();

    return (
      <div className="grid-bg cases-container">
        {component.cases.map(lonaCase => this.renderComponentCase(component, lonaCase))}
      </div>
    );
  }

  renderComponentCase(component: LonaComponent, lonaCase: LonaCase) {
    const layer: LonaLayer = cloneDeep(component.rootLayer);
    const layers = flattenLayers(layer);
    for (var logic of component.logic) {
      applyLogic(logic, lonaCase.value, layers);
    }

    return (
      <div className="case-container">
        <h4>{lonaCase.name}</h4>
        <div className="canvases-container">
          {component.canvases.map(canvas => this.renderCanvas(component, canvas, layer))}
        </div>
      </div>
    );
  }

  renderCanvas(component: LonaComponent, canvas: LonaCanvas, rootLayer: LonaLayer) {
    return (
      <div className="canvas-container">
        <h5>{canvas.name}</h5>
        <div
          style={{
            position: 'relative',
            height: canvas.heightMode === 'Exactly' ? getPixelOrDefault(canvas.height) : '',
            mineHight: canvas.heightMode === 'At Least' ? getPixelOrDefault(canvas.height) : '',
            width: getPixelOrDefault(canvas.width),
            background: getColorOrDefault(canvas.backgroundColor, colorsData.colors)
          }}
        >
          {this.renderLayer(rootLayer)}
        </div>
      </div>
    );
  }

  renderLayer(layer: LonaLayer) {
    if (layer.parameters.visible === false) {
      return null;
    }

    switch (layer.type) {
      case 'View':
        return this.renderViewLayer(layer);
      case 'Image':
        return this.renderImageLayer(layer);
      case 'Text':
        return this.renderTextLayer(layer);
      case 'Component': {
        const componentWithName = components.find(t => t[0] === layer.url);
        if (componentWithName == null) {
          throw new Error(`Component not found : ${layer.url}`);
        }
        const component = componentWithName[1];
        const componentLayer: LonaLayer = cloneDeep(component.rootLayer);
        const layers = flattenLayers(componentLayer);
        for (var logic of component.logic) {
          applyLogic(logic, layer.parameters, layers);
        }
        return this.renderLayer(componentLayer);
      }
      default:
        throw new Error('Layer type not supported: ' + layer.type);
    }
  }

  renderViewLayer(layer: LonaViewLayer) {
    return (
      <div
        style={{
          display: 'flex',
          ...getSpacingStyle(layer),
          ...getDimensionStyle(layer),
          ...getBorderStyle(layer),
          ...getBackgroundStyle(layer),
          ...getDimensionAndLayoutStyle(layer)
        }}
      >
        {layer.children.map(child => this.renderLayer(child))}
      </div>
    );
  }

  renderImageLayer(layer: LonaImageLayer) {
    const aspectRatioStyle = {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    };
    return (
      <AspectRatio key={layer.name} aspectRatio={layer.parameters.aspectRatio}>
        <img
          style={{
            display: 'flex',
            ...getSpacingStyle(layer),
            ...getDimensionStyle(layer),
            ...getBorderStyle(layer),
            ...getBackgroundStyle(layer),
            ...getDimensionAndLayoutStyle(layer),
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

  renderTextLayer(layer: LonaTextLayer) {
    const textStyle = getFontOrDefault(layer.parameters.font, textStyles);
    return (
      <span
        key={layer.name}
        style={{
          ...getBackgroundStyle(layer),
          ...applyNumberOfLinesStyle(layer),
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

export default App;

function flattenLayers(layer: LonaLayer): LonaLayer[] {
  switch (layer.type) {
    case 'Text':
    case 'Image':
    case 'Component':
      return [layer];
    case 'View':
      return flatten(layer.children.map(flattenLayers)).concat(layer);
    default:
      throw new Error('Unkown layer type' + layer.type);
  }
}

function applyLogic(logic: LonaLogic, parameters: {}, layers: LonaLayer[]) {
  switch (logic.function.name) {
    case 'assign(lhs, to rhs)': {
      applyAssignLhsToRhsLogic(logic.function, parameters, layers);
      break;
    }
    case 'if(value)': {
      applyIfValueLogic(logic.function, logic.nodes, parameters, layers);
      break;
    }
    default:
      throw new Error(`function not supported (${logic.function.name})`);
  }
}

function applyIfValueLogic(fn: LonaIfValue, nodes: LonaLogic[], parameters: {}, layers: LonaLayer[]) {
  const value = extractValue(fn.arguments.value, parameters);
  if (value) {
    for (var logic of nodes) {
      applyLogic(logic, parameters, layers);
    }
  }
}

function applyAssignLhsToRhsLogic(fn: LonaAssignLhsToRhs, parameters: {}, layers: LonaLayer[]) {
  const lhsValue = extractValue(fn.arguments.lhs, parameters);
  if (lhsValue != null) {
    setRhsValue(fn.arguments.rhs, layers, lhsValue);
  }
}

function extractValue(variable: LonaVariable, parameters: {}) {
  switch (variable.type) {
    case 'identifier': {
      if (variable.value.path[0] === 'parameters') {
        return parameters[variable.value.path[1]];
      }
      break;
    }
    case 'value': {
      return variable.value.data;
    }
  }

  throw new Error(`LonaVariable not supported (${JSON.stringify(variable)})`);
}

function setRhsValue(rhs: LonaIdentifier, layers: LonaLayer[], value: any) {
  switch (rhs.type) {
    case 'identifier': {
      if (rhs.value.path[0] === 'layers') {
        const layer = layers.find(l => l.name === rhs.value.path[1]);
        if (layer == null) {
          throw new Error('Layer not found');
        }
        layer.parameters[rhs.value.path[2]] = value;
        return;
      }
    }
  }

  throw new Error('Rhs not supported');
}

function getPixelOrDefault(value: number | void, fallback: string = '') {
  return value ? value + 'px' : fallback;
}

function getFontOrDefault(textStyleId: string, textStyles: LonaTextStyles): LonaTextStyle {
  const result = textStyles.styles.find(style => style.id === textStyleId);
  if (result) {
    return result;
  }

  const defaultStyle = textStyles.styles.find(style => style.id === textStyles.defaultStyleName);
  if (defaultStyle) {
    return defaultStyle;
  }

  throw new Error('Text style not found');
}

function getOrDefault<T>(value: T | void, fallback: T): T {
  return value == null ? fallback : value;
}

function getColorOrDefault(colorId: string | void, colors: LonaColor[]): string {
  if (colorId == null) {
    return '';
  }

  const result = colors.find(color => color.id === colorId);
  if (result) {
    return result.value;
  }

  return colorId;
}

function getSpacingStyle(layer) {
  return {
    paddingTop: getPixelOrDefault(layer.parameters.paddingTop),
    paddingRight: getPixelOrDefault(layer.parameters.paddingRight),
    paddingBottom: getPixelOrDefault(layer.parameters.paddingBottom),
    paddingLeft: getPixelOrDefault(layer.parameters.paddingLeft),

    marginTop: getPixelOrDefault(layer.parameters.marginTop),
    marginRight: getPixelOrDefault(layer.parameters.marginRight),
    marginBottom: getPixelOrDefault(layer.parameters.marginBottom),
    marginLeft: getPixelOrDefault(layer.parameters.marginLeft)
  };
}

function getDimensionStyle(layer) {
  return {
    height: getPixelOrDefault(layer.parameters.height),
    width: getPixelOrDefault(layer.parameters.width)
  };
}

function getBorderStyle(layer) {
  return {
    borderColor: layer.parameters.borderColor,
    borderRadius: getPixelOrDefault(layer.parameters.borderRadius),
    borderWidth: getPixelOrDefault(layer.parameters.borderWidth)
  };
}

function getDimensionAndLayoutStyle(layer) {
  return {
    flexDirection: getOrDefault(layer.parameters.flexDirection, 'column'),
    flex: getOrDefault(layer.parameters.flex, 0),
    alignItems: getOrDefault(layer.parameters.alignItems, 'flex-start'),
    alignSelf: getOrDefault(layer.parameters.alignSelf, 'stretch'),
    justifyContent: getOrDefault(layer.parameters.justifyContent, 'flex-start')
  };
}

function applyNumberOfLinesStyle(layer: LonaTextLayer) {
  if (layer.parameters.numberOfLines == null) {
    return {};
  } else {
    return {
      overflow: 'hidden',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      display: '-webkit-box'
    };
  }
}

function getBackgroundStyle(layer) {
  return {
    background: getColorOrDefault(layer.parameters.backgroundColor, colorsData.colors)
  };
}

//Todo: improve it to really support Yoga aspect ratio and apply it to other layers
class AspectRatio extends Component<any, any> {
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

function ColorComponent() {
  return (
    <div className="colors-container">
      {colorsData.colors.map(color => (
        <div key={color.id} className="color-container">
          <div className="color-display" style={{ background: color.value }} />
          <div className="color-name">{color.name}</div>
          <div className="color-value">{color.value}</div>
        </div>
      ))}
    </div>
  );
}

function TextStyleComponent() {
  return (
    <div className="text-styles-container">
      {textStyles.styles.map(textStyle => (
        <div
          key={textStyle.id}
          style={{
            fontFamily: textStyle.fontFamily,
            fontWeight: textStyle.fontWeight,
            fontSize: textStyle.fontSize + 'px',
            lineHeight: textStyle.lineHeight + 'px',
            color: textStyle.color
          }}
        >
          {textStyle.name}
        </div>
      ))}
    </div>
  );
}
