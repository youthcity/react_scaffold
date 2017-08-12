import * as ReactRouterRedux from 'react-router-redux';
import { combineReducers } from 'redux';
import { user_reducer } from 'src/redux/user_info/reducer';
import { notice_reducer } from 'src/redux/notice/reducer';

export let root_reducer = combineReducers({
  routing: ReactRouterRedux.routerReducer,
  user_info: user_reducer,
  notice_list: notice_reducer,
});
