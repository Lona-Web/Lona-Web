import React, { Component } from 'react';
import './Toolbar.css';

import { Icon } from './index';

class Toolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }
  render() {
    const { isOpen } = this.state;
    return (
      <div className={isOpen ? 'Toolbar is-open' : 'Toolbar'}>
        <div className="Toolbar-menu">
          <button
            onClick={() => {
              this.setState({
                isOpen: !this.state.isOpen
              });
            }}
          >
            <Icon name="code" />
          </button>
        </div>
        <div className="Toolbar-body">{this.props.children}</div>
      </div>
    );
  }
}
export default Toolbar;
