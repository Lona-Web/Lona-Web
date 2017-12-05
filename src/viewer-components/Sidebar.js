import React, { Component } from 'react';
import './Sidebar.css';

type SidebarProps = {
    components: Array<[string, LonaComponent | React.ElementType]>,
    onComponentClick: ([string, LonaComponent | React.ElementType]) => {}
};

class Sidebar extends React.Component<SidebarProps> {
    handleCompoenentClick = (component) => {
        this.props.onComponentClick(component);
    }
    render() {
        return (
            <div className="Sidebar">
                <div className="Sidebar-header">
                    <img alt="Lona Logo" src="/images/icon_64x64.png" srcSet="/images/icon_64x64.png 1x, /images/icon_64x64@2x.png 2x" />
                </div>
                <div className="Sidebar-body">
                    <ul>
                        {this.props.components.map((component, i) => {
                            return (
                                <li key={i}>
                                    <a onClick={this.handleCompoenentClick.bind(this, component)}>{component[0]}</a>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        );
    }
}
export default Sidebar;
