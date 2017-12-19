// @flow

import { makeTree } from './Sidebar.js';

describe('makeTree', () => {
  it('should handle root components', () => {
    const result = makeTree([
      './C1.component',
      './C2.component',
      './C3.component'
    ]);
    expect(result).toEqual([
      {
        type: 'Item',
        fullPath: './C1.component',
        name: 'C1'
      },
      {
        type: 'Item',
        fullPath: './C2.component',
        name: 'C2'
      },
      {
        type: 'Item',
        fullPath: './C3.component',
        name: 'C3'
      }
    ]);
  });

  it('should handle folders', () => {
    const result = makeTree([
      './F1/C1.component',
      './F1/C2.component',
      './C3.component'
    ]);
    expect(result).toEqual([
      {
        type: 'Folder',
        name: 'F1',
        children: [
          {
            type: 'Item',
            fullPath: './F1/C1.component',
            name: 'C1'
          },
          {
            type: 'Item',
            fullPath: './F1/C2.component',
            name: 'C2'
          }
        ]
      },
      {
        type: 'Item',
        fullPath: './C3.component',
        name: 'C3'
      }
    ]);
  });
});
