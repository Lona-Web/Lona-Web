// @flow

import * as React from 'react';
import './Icon.css';

type SizeEnumType = 'sm' | 'md' | 'lg' | 'xl';

type IconProps = {
  size: ?SizeEnumType,
  name: string,
  display: ?'inline'
};

function Icon(props: IconProps): React.Node {
  const sizeClass = props.size ? ' Icon--' + props.size : '';
  const displayClass = props.display ? ' Icon--' + props.display : '';
  return <i className={'Icon' + sizeClass + displayClass}>{props.name}</i>;
}

export default Icon;
