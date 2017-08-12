import axios from 'axios';
import * as _ from 'lodash';

let cfg:any;

export const init_config = (cb:any) => {
  if (!_.isUndefined(cfg)) {
    return;
  }

  axios.get('/config').then((data) => {
    cfg = data.data;
    cb();
  });
};

export const config = () => {
  if (!cfg) {
    console.error(`
      Tried to get config before it was loaded. This should never happen.
      Ensure your code is not run before the index.ts init function has been called.

      Be aware that the config is not accessible from within the WHITEPAW Runtime.
    `);
    return;
  }
  return cfg;
};
