import React, { Component } from 'react';
import './Sidebar.css';
import logo from '../assets/icon_64x64.png';
import logo2 from '../assets/icon_64x64@2x.png';

type SidebarProps = {
  items: string,
  onItemClick: (item: string) => {},
  selectedItem: string
};

class Sidebar extends React.Component<SidebarProps> {
  render() {
    return (
      <div className="Sidebar">
        {/* <div className="Sidebar-header">
          <img alt="Lona Logo" src={logo} srcSet={logo + ' ' + logo2} />
        </div> */}
        <div className="Sidebar-body">
          <ul>
            {this.props.items.map((item, i) => {
              return (
                <li key={i}>
                  <a
                    className={this.props.selectedItem === item ? 'is-selected' : ''}
                    onClick={() => this.props.onItemClick(item)}
                  >
                    {item}
                  </a>
                </li>
              );
            })}
          </ul>

          {this.props.children}
        </div>
      </div>
    );
  }
}
export default Sidebar;
