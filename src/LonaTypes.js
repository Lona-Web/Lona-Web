// @flow

export type LonaComponent = {|
  canvases: LonaCanvas[],
  cases: LonaCase[],
  config: {
    canvasLayout: string
  },
  rootLayer: LonaLayer,
  logic: LonaLogic[],
  metadata: {},
  parameters: {}
|};

export type LonaCanvas = {|
  backgroundColor: string,
  exportScale: number,
  height: number,
  heightMode: 'At Least' | 'Exactly',
  name: string,
  parameters: {},
  visible: boolean,
  width: number
|};

export type LonaCase = {|
  name: string,
  type: string,
  value: {},
  visible: boolean
|};

export type LonaLogic = {|
  function: LonaAssignLhsToRhs | LonaIfValue,
  nodes: LonaLogic[]
|};

export type LonaAssignLhsToRhs = {|
  arguments: {
    lhs: LonaVariable,
    rhs: LonaIdentifier
  },
  name: 'assign(lhs, to rhs)'
|};

export type LonaIfValue = {|
  arguments: {
    value: LonaIdentifier
  },
  name: 'if(value)'
|};

export type LonaVariable = LonaIdentifier | LonaValue;

export type LonaIdentifier = {|
  type: 'identifier',
  value: {
    path: string[],
    type: string
  }
|};

export type LonaValue = {|
  type: 'value',
  value: {
    data: any,
    type: string
  }
|};

export type LonaLayer = LonaTextLayer | LonaViewLayer | LonaImageLayer | LonaComponentLayer;

export type LonaComponentLayer = {|
  type: 'Component',
  name: string,
  url: string,
  parameters: {}
|};

type LayerParameters = {|
  // dimension and layout
  flex?: number,
  alignSelf?: 'stretch' | 'space-between',
  width?: number,
  height?: number,
  aspectRatio?: number,

  visible?: boolean,

  // background
  backgroundColor?: string,

  //border
  borderColor?: string,
  borderRadius?: number,
  borderWidth?: number,

  // dimension and layout
  width?: number,
  height?: number,

  // position
  position?: 'absolute' | 'relative',
  top?: number,
  right?: number,
  left?: number,
  bottom?: number,

  // spacing
  marginTop?: number,
  marginRight?: number,
  marginLeft?: number,
  marginBottom?: number,
  paddingTop?: number,
  paddingRight?: number,
  paddingLeft?: number,
  paddingBottom?: number
|};

export type LonaImageLayer = {|
  type: 'Image',
  name: string,
  parameters: LayerParameters & {|
    image?: string
  |}
|};

export type LonaTextLayer = {|
  type: 'Text',
  name: string,
  parameters: LayerParameters & {|
    text: string,
    font: string,
    numberOfLines: number
  |}
|};

export type LonaViewLayer = {|
  type: 'View',
  name: string,
  children: LonaLayer[],
  parameters: LayerParameters & {
    flexDirection?: 'row' | 'column',
    alignItems?: 'flex-start' | 'center' | 'flex-end',
    justifyContent?: 'flex-start' | 'center' | 'flex-end',
    itemSpacing?: number
  }
|};

export type LonaTextStyles = {|
  defaultStyleName: string,
  styles: LonaTextStyle[]
|};

export type LonaTextStyle = {|
  id: string,
  name: string,
  fontFamily: string,
  fontWeight: string,
  fontSize: number,
  lineHeight: number,
  color: string
|};

export type LonaColor = {| name: string, id: string, value: string, comment?: string |};
