import { remove } from 'lodash';
import { handleActions } from 'redux-actions';
import { update_state } from 'src/utils/base';

import { create_action, Action } from 'src/utils/redux_base';

export interface CountState {
  record:number;
  current:number;
}

export const initial_state:CountState = {
  record:0,
  current:0,
};

export const ADD_COUNT = 'count/add';
export const add_count = create_action<Partial<CountState>>(ADD_COUNT);
export const handle_add_count = (state:CountState, action:Action<Partial<CountState>>) : CountState => {
  const new_current = state.current + 1;
  return { ...state,
    current: new_current,
    record: new_current > state.record ? new_current : state.record,
  };
};

export const MINUS_COUNT = 'count/minus';
export const handle_minus_count = (state:CountState, action:Action<Partial<CountState>>) : CountState => {
  return {
    ...state,
    current: state.current - 1,
  };
};

export const count_reducer = handleActions(
  {
    [ADD_COUNT]: handle_add_count,
    [MINUS_COUNT]: handle_minus_count,
  },
  initial_state);