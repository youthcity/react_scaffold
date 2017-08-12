import { remove } from 'lodash';
import { handleActions } from 'redux-actions';

import { create_action, Action } from 'src/utils/redux_base';

export type State = {};
export const initial_state:State = {};
export const example_reducer = handleActions(
  { },
  initial_state);