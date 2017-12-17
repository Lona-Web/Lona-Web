// @flow

import React, { Component } from 'react';
import './App.css';
import { Sidebar, Toolbar, ComponentTree, LayerDetails } from './viewer-components';
import Case from './renderer/Case';
import { flattenComponentLayers } from './helpers';
import colorsData from './data/colors.js';
import cardComponent from './data/Card.component.js';
import listItemComponent from './data/ListItem.component.js';
import teamComponent from './data/Team.component.js';
import textStyles from './data/textStyles.js';

import type { LonaComponent } from './LonaTypes.js';

const components: Map<string, LonaComponent> = new Map([
  ['Team', teamComponent],
  ['Card', cardComponent],
  ['ListItem', listItemComponent]
]);

type State = {
  selectedItem: string,
  selectedLayer: ?string
};

class App extends Component<void, State> {
  constructor(props: void) {
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

  selectedComponent(): LonaComponent {
    const component = components.get(this.state.selectedItem);

    if (component === undefined) {
      throw new Error(`Component not found (${this.state.selectedItem})`);
    }

    return component;
  }

  render() {
    const { selectedItem } = this.state;
    return (
      <div className="App">
        <div className="App-sidebar">
          <Sidebar
            items={['Team', 'Card', 'ListItem', 'Colors', 'Text Styles']}
            onItemClick={this.handleComponentSelected}
            selectedItem={selectedItem}
          />
        </div>
        <div className="App-body">
          <div className="section">
            <h2 className="TitleLg section-title">{selectedItem}</h2>
            {this.renderContent()}
          </div>
        </div>
        <div className="App-toolbar">
          <Toolbar>
            {this.renderComponentTree()}
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
      <div className="Cases">
        {component.cases.map(lonaCase => (
          <Case
            componentName={this.state.selectedItem}
            component={component}
            components={components}
            colors={colorsData.colors}
            textStyles={textStyles}
            lonaCase={lonaCase}
          />
        ))}
      </div>
    );
  }
}

export default App;

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
