// @flow
import React from 'react';
import './Case.css';

import SyntaxHighlighter, {
  registerLanguage
} from 'react-syntax-highlighter/prism-light';
import { atomDark as editorStyle } from 'react-syntax-highlighter/styles/prism';
import jsx from 'react-syntax-highlighter/languages/prism/jsx';

import type {
  LonaComponent,
  LonaCase,
  LonaCanvas,
  LonaLayer,
  LonaColor,
  LonaTextStyles
} from '../LonaTypes';
import { applyLogics, getPixelOrDefault, getColorOrDefault } from '../helpers';
import { getReactCodeExample } from '../codeExamples';
import { Icon } from '../viewer-components';
import { Layer } from './primitives';

registerLanguage('jsx', jsx);
const editorCustomStyle = {
  backgroundColor: 'transparent',
  borderRadius: 0,
  margin: 0,
  padding: 0
};

type Props = {
  componentName: string,
  component: LonaComponent,
  lonaCase: LonaCase,
  colors: LonaColor[],
  textStyles: LonaTextStyles,
  components: Map<string, LonaComponent>
};

type State = {
  isCodeExampleVisible: boolean
};

export default class Case extends React.Component<Props, State> {
  constructor(props: void) {
    super(props);
    this.state = {
      isCodeExampleVisible: false
    };
  }

  render() {
    const { component, lonaCase, componentName } = this.props;
    const layer = applyLogics(
      component.logic,
      lonaCase.value,
      component.rootLayer
    );
    return (
      <div key={lonaCase.name} className="Case">
        <div className="Case-wrapper">
          <div className="Case-header">
            <h4 className="TitleSm u-mb-0">{lonaCase.name}</h4>
            <button
              title="View code example"
              className="Case-codeButton"
              onClick={() =>
                this.setState({
                  isCodeExampleVisible: !this.state.isCodeExampleVisible
                })
              }
            >
              <Icon name="code" size="md" />
            </button>
          </div>
          <div
            className={
              this.state.isCodeExampleVisible
                ? 'Case-drawer is-open'
                : 'Case-drawer'
            }
          >
            <div className="Case-code">
              <SyntaxHighlighter
                style={editorStyle}
                customStyle={editorCustomStyle}
                language="jsx"
              >
                {getReactCodeExample(component, componentName, lonaCase)}
              </SyntaxHighlighter>
            </div>
          </div>
          <div className="Canvases">
            {component.canvases.map(canvas =>
              this.renderCanvas(component, canvas, layer)
            )}
          </div>
        </div>
      </div>
    );
  }

  renderCanvas(
    component: LonaComponent,
    canvas: LonaCanvas,
    rootLayer: LonaLayer
  ) {
    return (
      <div key={canvas.name} className="Canvas">
        <h5 className="TitleXs">{canvas.name}</h5>
        <div
          style={{
            position: 'relative',
            height:
              canvas.heightMode === 'Exactly'
                ? getPixelOrDefault(canvas.height)
                : '',
            mineHight:
              canvas.heightMode === 'At Least'
                ? getPixelOrDefault(canvas.height)
                : '',
            width: getPixelOrDefault(canvas.width),
            background: getColorOrDefault(
              canvas.backgroundColor,
              this.props.colors
            )
          }}
        >
          <Layer
            layer={rootLayer}
            colors={this.props.colors}
            textStyles={this.props.textStyles}
            components={this.props.components}
          />
        </div>
      </div>
    );
  }
}
