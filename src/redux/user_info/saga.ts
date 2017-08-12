import { delay, eventChannel } from 'redux-saga';
import { call, put, fork, take, select, takeEvery } from 'redux-saga/effects';
import * as PubSub from 'pubsub-js';

import { config } from 'src/utils/config';
import { API } from 'src/utils/http';
import { APIStatus } from 'src/utils/redux_base';
import { show_notice, NoticeType } from 'src/redux/notice/reducer';
import { error_parse } from 'src/utils/error_parse';
import {
  fetch_user_info,
  update_user_info,
} from './reducer';

export function* UserSaga() {
  yield fork(watch_fetch_userinfo);
}

function* watch_fetch_userinfo() {
  while (true) {
    yield take(fetch_user_info.request.type);
    yield put(update_user_info({id: 0}));
    const res = yield API.get('/api/user/info');
    let user_info;
    if (res.data.code === 200) {
      user_info = parse_userinfo(res.data.data.userInfo);
      const bind_info = yield API.get('/api/v2/pc/lesson/user/info');
      if (bind_info.data.code !== 200) {
        user_info.is_bind = 0;
      } else {
        user_info.is_bind = bind_info.data.data.isBind;
      }
      yield put(fetch_user_info.success.action(user_info));
      window['_vds'].push(['setCS1', 'user_id', user_info.id]);
    } else if (res.data.code !== 2002) {
      yield put(update_user_info({id: -1}));
      yield put(show_notice(
        {
          type: NoticeType.Error,
          content: 'get_userinfo_error',
        },
      ));
    }
  }
}

const parse_userinfo = (res_info) => {
  return {
    id: res_info.id,
    avatar: res_info.avatar,
    gold: res_info.gold,
    level: res_info.level,
    nickname: res_info.nickname,
    age_section_id: res_info.age_section_id,
    realname: res_info.real_name,
    username: res_info.username,
  };
};
