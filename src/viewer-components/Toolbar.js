// @flow

import React from 'react';
import './Toolbar.css';

import { Icon } from './index';

class Toolbar extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      isOpen: true
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
            {/* <Icon name="my_location" size="sm" /> */}
            <Icon name="menu" />
          </button>
        </div>
        <div className="Toolbar-body">{this.props.children}</div>
      </div>
    );
  }
}
export default Toolbar;
