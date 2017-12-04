import React, { Component } from 'react';
import './Sidebar.css';

import { LonaComponent } from '../LonaTypes.js';

type SidebarProps = {
    components: Array<[string, LonaComponent]>
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
                        {this.props.components.map(component => {
                            return (
                                <li>
                                    <a href="">{component[0]}</a>
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
