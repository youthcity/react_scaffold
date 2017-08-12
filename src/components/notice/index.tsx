import * as React from 'react';
import * as PubSub from 'pubsub-js';
import * as cx from 'classnames';
import { map } from 'lodash';
import * as CSSModules from 'react-css-modules';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  NoticeType,
  NoticeItem,
  delete_notice,
  show_notice,
} from 'src/redux/notice/reducer';
const style = require('./index.scss');

interface NoticesProps {
  notice_list:NoticeItem[];
  delete_notice:typeof delete_notice;
  show_notice:typeof show_notice;
}

export class Notices extends React.Component<NoticesProps, {}> {
  private notice_subscribe:any;
  constructor(props:any, context:any) {
    super(props, context);
    this.state = {};
  }
  componentDidMount() {
   this.notice_subscribe = PubSub.subscribe('show_tips', (type, msg:string | NoticeItem) => {
    if (typeof msg === 'string') {
      this.props.show_notice({type: NoticeType.Simple, content: msg});
    } else {
      this.props.show_notice(msg);
    }
   });
  }
  componentWillUnMount() {
    PubSub.unsubscribe(this.notice_subscribe);
  }
  render_notice_content(notice:NoticeItem) {
    if (notice.type === NoticeType.Simple) {
      return <SimpleNotice
          key={notice.id}
          delete_notice={this.props.delete_notice}
          notice_info={notice} />;
    } else {
      return <CommonNotice
          key={notice.id}
          delete_notice={this.props.delete_notice}
          notice_info={notice} />;
    }
  }
  render() {
    const notice_list = this.props.notice_list || [];
    let html = undefined;
    html = (
      <div className={cx(
          style.tips_wrap,
          {[style.show]: notice_list.length > 0})}>
        {
          map(notice_list, (item, key) => {
            return this.render_notice_content(item);
          })
        }
      </div>
    );
    return html;
  }
}

class SimpleNotice extends React.Component<{
  delete_notice:typeof delete_notice;
  notice_info:NoticeItem;
}, any> {
  componentDidMount() {
    setTimeout(
      () => {
        this.props.delete_notice(this.props.notice_info.id);
      },
      3000);
  }
  render() {
    return (
      <div className={style.simple_tips}>
        {this.props.notice_info.content}
      </div>
    );
  }
}

class CommonNotice extends React.Component<{
  delete_notice:typeof delete_notice;
  notice_info:NoticeItem;
}, any> {
  componentDidMount() {
    setTimeout(
      () => {
        this.props.delete_notice(this.props.notice_info.id);
      },
      3000);
  }
  render() {
    return (
      <div className={style.tips_item}>
        <i className={cx(
            style.tips_icon,
            {[style.error]: this.props.notice_info.type === NoticeType.Error},
            {[style.success]: this.props.notice_info.type === NoticeType.Success},
            )}>
        </i>
        <span className={style.tips_content}>
          {this.props.notice_info.content}
        </span>
      </div>
    );
  }
}

const map_state_to_props = (state:any) => {
  return {
    notice_list: state.notice_list,
  };
};

const map_dispatch_to_props = (dispatch:any) => {
  return bindActionCreators(
    {
      delete_notice: delete_notice,
      show_notice: show_notice,
    },
    dispatch,
  );
};

export let NoticesContainer = connect(
  map_state_to_props,
  map_dispatch_to_props,
)(CSSModules(Notices, style, { allowMultiple: true }));