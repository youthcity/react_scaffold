import * as _ from 'lodash';
export function update_state<StateType>(
    old_value:StateType,
    new_value:Partial<StateType>) : StateType {
  return _.assign({}, old_value, new_value);
}

export function check_phone_number(phone_number) : boolean {
  return /^(0|86|17951)?(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[0-9])[0-9]{8}$/.test(phone_number);
}