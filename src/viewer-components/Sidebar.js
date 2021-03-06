// @flow

import React from 'react';
import './Sidebar.css';
import { colorsPath, textStylesPath } from '../constants';
import { Icon } from './';

type Item = {
  type: 'Item',
  name: string,
  key: string
};

type Folder = {
  type: 'Folder',
  name: string,
  children: Array<Item | Folder>
};

function addLeaf(
  subPaths: string[],
  fullPath: string,
  result: Array<Item | Folder>
): Array<Item | Folder> {
  if (subPaths.length === 0) {
    throw new Error(`subPaths can't be empty`);
  }

  if (subPaths.length === 1) {
    return result.concat({
      type: 'Item',
      key: fullPath,
      name: subPaths[subPaths.length - 1].replace('.component', '')
    });
  }

  const existingFolder = result.find(
    i => i.type === 'Folder' && i.name === subPaths[0]
  );
  if (existingFolder == null) {
    return result.concat({
      type: 'Folder',
      name: subPaths[0],
      children: addLeaf(subPaths.slice(1), fullPath, [])
    });
  } else {
    // Todo: don't mutate folder
    existingFolder.children = addLeaf(
      subPaths.slice(1),
      fullPath,
      existingFolder.children
    );
    return result;
  }
}

export function makeTree(paths: string[]): Array<Item | Folder> {
  return paths
    .reduce((result, path) => {
      const subPaths = path.split('/').slice(1); // remove the '.' prefix
      return addLeaf(subPaths, path, result);
    }, [])
    .concat([
      { key: colorsPath, name: 'Colors', type: 'Item' },
      { key: textStylesPath, name: 'Text Styles', type: 'Item' }
    ]);
}

function itemKeyToIcon(key) {
  switch (key) {
    case colorsPath:
      return 'color_lens';
    case textStylesPath:
      return 'font_download';
    default:
      return 'layers';
  }
}

type SidebarProps = {
  componentsPaths: string[],
  onItemClick: (item: string) => {},
  selectedItem: string
};

class Sidebar extends React.Component<SidebarProps, void> {
  render() {
    const items = makeTree(this.props.componentsPaths);
    return (
      <div className="Sidebar">
        <div className="Sidebar-body">
          <div className="TreeList">
            <ul>{items.map(item => this.renderItem(item))}</ul>
          </div>
        </div>
      </div>
    );
  }

  renderItem(item: Folder | Item) {
    return item.type === 'Folder'
      ? this.renderFolder(item)
      : this.renderComponent(item);
  }

  renderFolder(folder: Folder) {
    return (
      <li key={folder.name}>
        <div className="TreeList-folder">
          <Icon name="folder" size="sm" display="inline" />
          <span className="TreeList-folder-name">{folder.name}</span>
          <Icon name="keyboard_arrow_down" size="sm" display="inline" />
        </div>
        <ul>{folder.children.map(item => this.renderItem(item))}</ul>
      </li>
    );
  }

  renderComponent(item: Item) {
    return (
      <li key={item.key}>
        <a
          className={this.props.selectedItem === item.key ? 'is-selected' : ''}
          onClick={() => this.props.onItemClick(item.key)}
        >
          <Icon name={itemKeyToIcon(item.key)} size="sm" display="inline" />
          {item.name}
        </a>
      </li>
    );
  }
}
export default Sidebar;
