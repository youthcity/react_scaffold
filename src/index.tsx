import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { init_config, config } from './utils/config';
import { Root } from 'src/root';

const root_element = document.getElementById('root');
const ready = () => {
  ReactDOM.render(<Root/>, root_element);
};

init_config(ready);
