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
  const visualCuesRoot = document.querySelector('#visual-cues');
  if (visualCuesRoot == null) {
    throw new Error('visual-cues element not found');
  }
  const offset = visualCuesRoot.getBoundingClientRect();
  const boundRect = elem.getBoundingClientRect();
  return {
    top: boundRect.top - offset.top,
    left: boundRect.left - offset.left,
    height: boundRect.height,
    width: boundRect.width
  };
}

export default class VisualCues extends React.Component<Props, void> {
  render() {
    return (
      <div
        id="visual-cues"
        style={{
          position: 'absolute',
          height: '100%',
          width: '100%',
          pointerEvents: 'none',
          top: '0',
          bottom: '0',
          left: '0',
          right: '0'
        }}
      >
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
