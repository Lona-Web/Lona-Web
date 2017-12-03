import React from 'react';
import './Sidebar.css';

export default function Sidebar() {
    return (
        <div className="Sidebar">
            <div className="Sidebar-header">
                <img
                  alt="Lona Logo"
                  src="/images/icon_64x64.png"
                  srcSet="/images/icon_64x64.png 1x, /images/icon_64x64@2x.png 2x" />
            </div>
            <div className="Sidebar-body">sidebar goes here</div>
        </div>
    );
}
