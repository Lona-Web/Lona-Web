// @flow

import React from 'react';

type Props = {
  hoveredLayer: ?string,
  selectedLayer: ?string
};

type Overlay = {
  top: number,
  left: number,
  height: number,
  width: number
};

function layerNameToOverlays(layerName: ?string): Overlay[] {
  if (layerName == null) {
    return [];
  }

  return Array.from(document.querySelectorAll(`[lonaid="${layerName}"]`)).map(
    elementToOverlays
  );
}

function elementToOverlays(elem: Element): Overlay {
  const boundRect = elem.getBoundingClientRect();
  return {
    top: boundRect.top,
    left: boundRect.left,
    height: boundRect.height,
    width: boundRect.width
  };
}

export default class VisualCues extends React.Component<Props, void> {
  render() {
    return (
      <div style={{ position: 'absolute', height: '100%', width: '100%' }}>
        {layerNameToOverlays(this.props.selectedLayer).map((overlay, i) => (
          <div
            key={'selected-layer' + i}
            style={{
              position: 'absolute',
              border: '1px solid red',
              top: overlay.top + 'px',
              left: overlay.left + 'px',
              height: overlay.height + 'px',
              width: overlay.width + 'px'
            }}
          />
        ))}
        {layerNameToOverlays(this.props.hoveredLayer).map((overlay, i) => (
          <div
            key={'hovered-layer' + i}
            style={{
              position: 'absolute',
              background: 'blue',
              top: overlay.top + 'px',
              left: overlay.left + 'px',
              height: overlay.height + 'px',
              width: overlay.width + 'px',
              opacity: 0.2
            }}
          />
        ))}
      </div>
    );
  }
}
