// @flow

import React, { Component } from 'react';
import './App.css';
import {
  Sidebar,
  Toolbar,
  ComponentTree,
  LayerDetails,
  Icon
} from './viewer-components';
import Case from './renderer/Case';
import { flattenComponentLayers } from './helpers';
import {
  teamComponent,
  cardComponent,
  listItemComponent,
  colorsData,
  textStyles
} from './data';
import { colorsPath, textStylesPath } from './constants';
import VisualCues from './VisualCues';

import type { LonaComponent, LonaColor, LonaTextStyles } from './LonaTypes.js';

type State = {|
  components: Map<string, LonaComponent>,
  colors: LonaColor[],
  textStyles: LonaTextStyles,
  selectedItem: string,
  selectedLayer: ?string,
  hoveredLayer: ?string,
  mobileSidebarOpen: boolean
|};

class App extends Component<void, State> {
  constructor(props: void) {
    super(props);
    this.state = {
      components: new Map([
        ['./screen/Team.component', teamComponent],
        ['./components/Card.component', cardComponent],
        ['./components/ListItem.component', listItemComponent]
      ]),
      colors: colorsData.colors,
      textStyles: textStyles,
      selectedItem: './components/Card.component',
      selectedLayer: null,
      hoveredLayer: null,
      mobileSidebarOpen: false
    };
  }

  handleComponentSelected = (item: string) => {
    this.setState({
      selectedItem: item,
      selectedLayer: null,
      mobileSidebarOpen: false
    });
  };

  handleMenuToggle = () => {
    this.setState({
      mobileSidebarOpen: !this.state.mobileSidebarOpen
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
    const { selectedItem, mobileSidebarOpen } = this.state;
    return (
      <div className={mobileSidebarOpen ? 'App is-sidebar-open' : 'App'}>
        <div className="App-sidebar">
          <Sidebar
            componentsPaths={Array.from(this.state.components.keys())}
            onItemClick={this.handleComponentSelected}
            selectedItem={selectedItem}
          />
          <input
            style={{ display: 'none' }}
            type="file"
            multiple={true}
            webkitdirectory="true"
            directory="true"
            onChange={this.onImportWorkspace}
          />
        </div>
        <div className="App-body">
          <div className="Section">
            <h2 className="TitleLg Section-title">
              {this.renderMobileMenuButton()}
              {getNameFromComponentPath(selectedItem)}
            </h2>
            {this.renderContent()}
          </div>
          <VisualCues
            hoveredLayer={this.state.hoveredLayer}
            selectedLayer={this.state.selectedLayer}
          />
          <div
            className="App-body-menuOverlay"
            onClick={this.handleMenuToggle}
          />
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
    if (
      this.state.selectedItem === colorsPath ||
      this.state.selectedItem === textStylesPath
    ) {
      return null;
    }

    const component = this.selectedComponent();
    const layer = flattenComponentLayers(component).find(
      l => l.name === this.state.selectedLayer
    );

    if (layer == null) {
      return null;
    }

    return <LayerDetails layer={layer} colors={this.state.colors} />;
  }

  renderComponentTree() {
    if (
      this.state.selectedItem === colorsPath ||
      this.state.selectedItem === textStylesPath
    ) {
      return null;
    }

    return (
      <ComponentTree
        component={this.selectedComponent()}
        selectedLayerName={this.state.selectedLayer}
        onHoverLayer={layerName =>
          this.setState({
            hoveredLayer: layerName
          })
        }
        onSelectLayer={layerName =>
          this.setState({
            selectedLayer: layerName
          })
        }
      />
    );
  }

  renderContent() {
    if (this.state.selectedItem === colorsPath) {
      return this.renderColors();
    }

    if (this.state.selectedItem === textStylesPath) {
      return this.renderTextSyles();
    }

    const component = this.selectedComponent();

    return (
      <div className="Cases">
        {component.cases.map((lonaCase, i) => (
          <Case
            key={i}
            componentName={getNameFromComponentPath(this.state.selectedItem)}
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
            <div
              className="color-display"
              style={{ background: color.value }}
            />
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

  renderMobileMenuButton() {
    return (
      <button
        onClick={this.handleMenuToggle}
        className="u-hidden-md-up App-body-menuButton"
      >
        <Icon name="menu" />
      </button>
    );
  }

  onImportWorkspace = async (event: any) => {
    const files = Array.from(event.target.files);
    const colorsFile = files.find(file => file.name === 'colors.json');
    if (colorsFile == null) {
      throw new Error('Workspace should contains colors.json');
    }
    const textStylesFile = files.find(file => file.name === 'textStyles.json');
    if (textStylesFile == null) {
      throw new Error('Workspace should contains textStyles.json');
    }
    const components = await Promise.all(
      files
        .filter(file => file.name.endsWith('.component'))
        .map(importComponent)
    );
    this.setState({
      components: new Map(components),
      selectedItem: components[0][0], // Select first path of first component
      colors: await importColors(colorsFile),
      textStyles: await importTextStyles(textStylesFile)
    });
  };
}

export default App;

async function importComponent(file: any): Promise<any> {
  const result = await readFileAsText(file);
  return [
    getPathFromWebkitRelativePath(file.webkitRelativePath),
    JSON.parse(result.target.result)
  ];
}

async function importColors(file: File): Promise<LonaColor[]> {
  const result = await readFileAsText(file);
  return JSON.parse(result.target.result).colors;
}

async function importTextStyles(file: File): Promise<LonaTextStyles> {
  const result = await readFileAsText(file);
  return JSON.parse(result.target.result);
}

function getNameFromComponentPath(path: string): string {
  const paths = path.split('/');
  return paths[paths.length - 1].replace('.component', '').replace('.json', '');
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
