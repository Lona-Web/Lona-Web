// @flow

import { flatten } from 'lodash';

import type { LonaComponent, LonaLayer } from './LonaTypes.js';

function flattenLayers(layer: LonaLayer): LonaLayer[] {
  if (layer.type === 'View') {
    return [layer].concat(flatten(layer.children.map(child => flattenLayers(child))));
  } else {
    return [layer];
  }
}

export function flattenComponentLayers(component: LonaComponent) {
  return flattenLayers(component.rootLayer);
}
