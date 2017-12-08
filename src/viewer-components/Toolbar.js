import React, { Component } from 'react';
import './Toolbar.css';

class Toolbar extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  handleToggleClick = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  render() {
    const { isOpen } = this.state;
    return (
      <div className={isOpen ? 'Toolbar is-open' : 'Toolbar'}>
        <div className="Toolbar-menu">
          <button onClick={this.handleToggleClick}>O</button>
        </div>
        <div className="Toolbar-body">
          <div>Component tree goes here</div>
          <div>Layer details goes here</div>
          <div>{this.props.children}</div>
        </div>
      </div>
    );
  }
}
export default Toolbar;
