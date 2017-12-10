// @flow

import * as React from 'react';
import './Icon.css';

type SizeEnumType = 'sm' | 'md' | 'lg' | 'xl';

type IconProps = {
  size: ?SizeEnumType,
  name: string
};

function Icon(props: IconProps): React.Node {
  const sizeClass = props.size ? ' Icon--' + props.size : '';
  return <i className={'Icon' + sizeClass}>{props.name}</i>;
}

export default Icon;
