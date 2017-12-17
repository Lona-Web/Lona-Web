// @flow

import type { LonaComponent, LonaCase, LonaParameter } from './LonaTypes.js';

export function getReactCodeExample(component: LonaComponent, name: string, lonaCase: LonaCase): string {
  let str = `<${name} `;
  for (let prop in lonaCase.value) {
    str += `\n\  ${jsxAssignment(prop, getParameterType(component, prop), lonaCase.value[prop])}`;
  }
  str += '/>';
  return str;
}

function jsxAssignment(prop, type, value) {
  if (type === 'String') {
    return `${prop}="${value}"`;
  } else {
    return `${prop}={${value}}`;
  }
}

function getParameter(component: LonaComponent, name: string): LonaParameter {
  const param = component.parameters.find(p => p.name === name);

  if (param == null) {
    throw new Error(`Parameter ${name} not found in component`);
  }

  return param;
}

function getParameterType(component: LonaComponent, name: string): string {
  const param = getParameter(component, name);

  if (typeof param.type === 'string') {
    return param.type;
  }

  return param.type.of;
}
