import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as CSSModules from 'react-css-modules';
import * as cx from 'classnames';

import { NoticesContainer } from 'src/components/notice';
import { fetch_user_info, UserInfo } from 'src/redux/user_info/reducer';
const style = require('./index.scss');

export type IndexProps = {
  user_info:UserInfo;
  fetch_user_info:typeof fetch_user_info.request.action;
};

class Index extends React.Component<IndexProps, any> {
  constructor(props:any, context:any) {
    super(props, context);
    this.props.fetch_user_info();
  }
  render() {
    const intruduction = '';
    const { user_info } = this.props;
    const html = (
      <div styleName="index_container">
        {
          this.props.children ? this.props.children : 'hello world'
        }
      </div>
    );
    return (
      <div id="root-wrapper">
        <NoticesContainer />
        {html}
      </div>
    );
  }
}
const map_state_to_props = (state:any) => {
  return {
    user_info: state.user_info,
  };
};

const map_dispatch_to_props = (dispatch:any) => {
  return bindActionCreators(
    {
      fetch_user_info: fetch_user_info.request.action,
    },
    dispatch,
  );
};

export const IndexContainer = connect(
  map_state_to_props,
  map_dispatch_to_props,
)(CSSModules(Index, style, { allowMultiple: true }));
