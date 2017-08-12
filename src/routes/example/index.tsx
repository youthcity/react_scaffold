import * as React from 'react';
import * as cx from 'classnames';
import * as CSSModules from 'react-css-modules';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const style = require('./index.scss');

type ExampleProps = {};
type ExampleState = {};

export class Example extends React.Component<ExampleProps, Partial<ExampleState>> {
  constructor(props:any, context:any) {
    super(props, context);
    this.state = {};
  }
  render() {
    return (<div>example</div>);
  }
}

const map_state_to_props = (state:any) => {
  return {};
};

const map_dispatch_to_props = (dispatch:any) => {
  return bindActionCreators(
    {},
    dispatch,
  );
};

export let ExampleContainer = connect(
  map_state_to_props,
  map_dispatch_to_props,
)(CSSModules(Example, style, { allowMultiple: true }));
