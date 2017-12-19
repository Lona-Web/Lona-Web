// @flow

import React, { Component } from 'react';
import './App.css';
import { Sidebar, Toolbar, ComponentTree, LayerDetails } from './viewer-components';
import Case from './renderer/Case';
import { flattenComponentLayers } from './helpers';
import { teamComponent, cardComponent, listItemComponent, colorsData, textStyles } from './data';

import type { LonaComponent, LonaColor, LonaTextStyles } from './LonaTypes.js';

type State = {
  components: Map<string, LonaComponent>,
  colors: LonaColor[],
  textStyles: LonaTextStyles,
  selectedItem: string,
  selectedLayer: ?string
};

class App extends Component<void, State> {
  constructor(props: void) {
    super(props);
    this.state = {
      components: new Map([
        ['Team', teamComponent],
        ['Card', cardComponent],
        ['ListItem', listItemComponent]
      ]),
      colors: colorsData.colors,
      textStyles: textStyles,
      selectedItem: 'Colors',
      selectedLayer: null
    };
  }

  handleComponentSelected = (item: string) => {
    this.setState({
      selectedItem: item
    });
  };

  selectedComponent(): LonaComponent {
    const component = this.state.components.get(this.state.selectedItem);

    if (component === undefined) {
      throw new Error(`Component not found (${this.state.selectedItem})`);
    }

    return component;
  }

  render() {
    const { selectedItem, components } = this.state;
    return (
      <div className="App">
        <div className="App-sidebar">
          <Sidebar
            items={this.getSidebarItems()}
            onItemClick={this.handleComponentSelected}
            selectedItem={selectedItem}
          />
          <input
            type="file"
            multiple={true}
            webkitdirectory="true"
            directory={true}
            onChange={this.onImportWorkspace}
          />
        </div>
        <div className="App-body">
          <div className="section">
            <h2 className="TitleLg section-title">{getNameFromComponentPath(selectedItem)}</h2>
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

  getSidebarItems() {
    return Array.from(this.state.components.keys())
      .map(key => ({ id: key, name: getNameFromComponentPath(key) }))
      .concat([{ id: 'Colors', name: 'Colors' }, { id: 'Text Styles', name: 'Text Styles' }]);
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
      return this.renderColors();
    }

    if (this.state.selectedItem === 'Text Styles') {
      return this.renderTextSyles();
    }

    const component = this.selectedComponent();

    return (
      <div className="Cases">
        {component.cases.map((lonaCase, i) => (
          <Case
            key={i}
            componentName={this.state.selectedItem}
            component={component}
            components={this.state.components}
            colors={this.state.colors}
            textStyles={this.state.textStyles}
            lonaCase={lonaCase}
          />
        ))}
      </div>
    );
  }

  renderColors() {
    return (
      <div className="colors-container">
        {this.state.colors.map(color => (
          <div key={color.id} className="color-container">
            <div className="color-display" style={{ background: color.value }} />
            <div className="color-name">{color.name}</div>
            <div className="color-value">{color.value}</div>
          </div>
        ))}
      </div>
    );
  }

  renderTextSyles() {
    return (
      <div className="text-styles-container">
        {this.state.textStyles.styles.map(textStyle => (
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

  onImportWorkspace = (event: any) => {
    const files = Array.from(event.target.files).filter(file => file.name.endsWith('.component'));
    const promises = files.map(readFileAsText);
    Promise.all(promises).then(events => {
      const components = events.map((e, i) => {
        const component = JSON.parse(e.target.result);
        return [getPathFromWebkitRelativePath(files[i].webkitRelativePath), component];
      });
      this.setState({ components: new Map(components) });
    });
  };
}

export default App;

function getNameFromComponentPath(path: string): string {
  const paths = path.split('/');
  return paths[paths.length - 1].replace('.component', '');
}

function getPathFromWebkitRelativePath(webkitRelativePath: string): string {
  return '.' + webkitRelativePath.slice(webkitRelativePath.indexOf('/'));
}

function readFileAsText(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e);
    reader.readAsText(file);
  });
}
