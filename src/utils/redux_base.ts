import { Action as OriginAction, createAction } from 'redux-actions';
import { assign } from 'lodash';

export enum APIStatus {
  Initial = 'initial',
  Fetching = 'fetching',
  Success = 'success',
  Failed = 'failed',
}
export interface Action<Payload = undefined> extends OriginAction<Payload> {
  readonly type:string;
  readonly payload:Payload;
}
export interface APIACTION<RequestPayload = undefined, SuccessPayload = undefined> {
  request:{
    action:(payload?:RequestPayload) => Action<RequestPayload>;
    type:string;
  };
  success:{
    action:(payload?:SuccessPayload) => Action<SuccessPayload>;
    type:string;
  };
}

export function create_action(action_type:string) : () => Action;
export function create_action<Payload>(
    action_type:string,
) : (payload:Payload) => Action<Payload>;
export function create_action<Payload>(
    action_type:string,
    payloadCreator?:(...args:Payload[keyof Payload][]) => Payload,
) : (payload?:Payload) => Action<Payload|undefined> {
  if (payloadCreator) {
    return (createAction(action_type, payloadCreator) as (payload:Payload) => Action<Payload>);
  } else {
    return (createAction(action_type, (p:Payload) => p) as (payload?:Payload) => Action<Payload>);
  }
}

export function create_fetch_action(action_type:string) : APIACTION;
export function create_fetch_action<RequestType, SuccessType>(action_type:string) :  APIACTION<RequestType, SuccessType>;
export function create_fetch_action<RequestType, SuccessType>(
    action_type:string,
) : APIACTION<RequestType|undefined, SuccessType|undefined> {
    return create_fetch_actions<RequestType, SuccessType>(action_type);
}

export function create_fetch_actions<RequestType = undefined, SuccessType = undefined>(action_type:string) : APIACTION<RequestType, SuccessType> {
  return {
    request: {
      action: create_action<RequestType>(action_type),
      type: action_type,
    },
    success: {
      action: create_action<SuccessType>(action_type + '_success'),
      type: action_type + '_success',
    },
  };
}

export function update_state<StateType>(
    old_value:StateType,
    new_value:Partial<StateType>) : StateType {
  return assign({}, old_value, new_value);
}