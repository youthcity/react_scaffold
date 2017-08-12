import { remove } from 'lodash';
import { handleActions } from 'redux-actions';

import { create_action, Action } from 'src/utils/redux_base';

export enum  NoticeType {
  Error = 'error',
  Success = 'success',
  Normal = 'normal',
  Simple = 'simple',
}
export type NoticeItem = {
  id?:number;
  type:NoticeType;
  content:string;
};

const initial_notice:NoticeItem[] = [];

export const SHOW_NOTICE = 'common/notice/show_notice';
export const show_notice = create_action<NoticeItem>(SHOW_NOTICE);
const handle_show_notice = (state:NoticeItem[], action:Action<NoticeItem>) => {
  const notices = [...state];
  notices.push({
    id: Date.parse(new Date().toString()),
    type: action.payload.type,
    content: action.payload.content,
  });
  return notices;
};

export const DELETE_NOTICE = 'common/notice/delete_notice';
export const delete_notice = create_action<number>(DELETE_NOTICE);
const handle_delete_notice = (state:NoticeItem[], action:Action<number>) => {
  const notices = [...state];
  remove(notices, (item) => item.id === action.payload);
  return notices;
};

export const notice_reducer = handleActions(
  {
    [SHOW_NOTICE]: handle_show_notice,
    [DELETE_NOTICE]: handle_delete_notice,
  },
  initial_notice);