import React, { Component } from 'react';
import './Toolbar.css';

class Toolbar extends React.Component {
  render() {
    return (
      <div className="Toolbar">
        <div className="Toolbar-body">{this.props.children}</div>
      </div>
    );
  }
}
export default Toolbar;
