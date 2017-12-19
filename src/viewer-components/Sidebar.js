import React from 'react';
import './Sidebar.css';

type SidebarProps = {
  items: Array<{ id: string, name: string }>,
  onItemClick: (item: string) => {},
  selectedItem: string
};

class Sidebar extends React.Component<SidebarProps> {
  render() {
    return (
      <div className="Sidebar">
        <div className="Sidebar-body">
          <ul>
            {this.props.items.map(item => {
              return (
                <li key={item.id}>
                  <a
                    className={
                      this.props.selectedItem === item.id ? 'is-selected' : ''
                    }
                    onClick={() => this.props.onItemClick(item.id)}
                  >
                    {item.name}
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
