import React, { Component } from 'react';
import './Sidebar.css';

type SidebarProps = {
    items: Array<[string]>
};

class Sidebar extends React.Component<SidebarProps> {
    render() {
        return (
            <div className="Sidebar">
                <div className="Sidebar-header">
                    <img alt="Lona Logo" src="/images/icon_64x64.png" srcSet="/images/icon_64x64.png 1x, /images/icon_64x64@2x.png 2x" />
                </div>
                <div className="Sidebar-body">
                    <ul>
                        {this.props.items.map(item => {
                            return (
                                <li>
                                    <a href="">{item}</a>
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
