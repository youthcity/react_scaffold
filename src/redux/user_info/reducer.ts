import { handleActions } from 'redux-actions';

import { create_action, create_fetch_action , Action } from 'src/utils/redux_base';
import { update_state } from 'src/utils/base';

export type UserInfo = {
  id:number,
  avatar:string,
  username:string,
  nickname:string;
  realname:string;
  gold:number;
  birthday:string;
  sex:string;
  phone_number:number;
  is_bind:number;
};
export let initial_userInfo = {
  id: -2,
  avatar: 'https://static.codemao.cn/whitepaw/course/avatar_empty.png',
  username: '',
  nickname: '',
  realname: '',
  gold: 0,
  birthday: '',
  sex: '',
  phone_number: 0,
  is_bind: 0,
};

export const UPDATE_USER_INFO = 'common/user/update_user_info';
export const update_user_info = create_action<Partial<UserInfo>>(UPDATE_USER_INFO);
const handle_update_user_info = (state:UserInfo, action:Action<Partial<UserInfo>>) : UserInfo => {
  return update_state(state, action.payload);
};
export const FETCH_USER_INFO = 'common/user/fetch_user_info';
export const fetch_user_info = create_fetch_action<undefined, UserInfo>(FETCH_USER_INFO);
export const handle_fetch_user_info = (state:UserInfo) => {
  return update_state(state, { id:0 });
};
export const handle_fetch_user_info_success =
  (state:UserInfo, action:Action<UserInfo>) => {
    return action.payload;
  };

export const user_reducer = handleActions(
  {
    [fetch_user_info.success.type]: handle_fetch_user_info_success,
    [UPDATE_USER_INFO]: handle_update_user_info,
  },
  initial_userInfo);