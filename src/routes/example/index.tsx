import * as React from 'react';
import * as cx from 'classnames';
import * as CSSModules from 'react-css-modules';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { CountState, add_count } from './modules/reducer';
const style = require('./index.scss');

interface ExampleProps {
  count:CountState;
  handle_add_count:any;
}

interface ExampleState {

}

export class Example extends React.Component<ExampleProps, Partial<ExampleState>> {
  constructor(props:any, context:any) {
    super(props, context);
    this.state = {
    };
  }
  render() {
    const {count, handle_add_count} = this.props;
    console.log(this.props);

    return (
      <div styleName="main-wrap">
        <div className="record">Highest Record: {count.record}</div>
        <div className="current">Current: {count.current}</div>
        <div styleName="btn">
          <button
            onClick={() => { console.log('++++'); handle_add_count(); }}
          >+</button>
        </div>
      </div>
    );
  }
}

const map_state_to_props = (state:any) => {
  return {
    count: state.count,
  };
};

const map_dispatch_to_props = (dispatch:any) => {
  return bindActionCreators(
    {
      handle_add_count: add_count,
      // minus_count: on_minus_count,
    },
    dispatch,
  );
};

export let ExampleContainer = connect(
  map_state_to_props,
  map_dispatch_to_props,
)(CSSModules(Example, style, { allowMultiple: true }));
