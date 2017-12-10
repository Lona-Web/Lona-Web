import React from 'react';
import './Icon.css';

let Icon = (props) => {
    let sizeClass = props.size ? ' Icon--' + props.size : '';
    return (
        <i className={'Icon' + sizeClass}>{props.name}</i>
    )
}

export default Icon;