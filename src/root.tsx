import * as React from 'react';
import { Provider } from 'react-redux';
import { Store, createStore, applyMiddleware, Middleware } from 'redux';
import * as _ from 'lodash';
import { syncHistoryWithStore } from 'react-router-redux';
import { Router, browserHistory } from 'react-router';
import createSagaMiddleware from 'redux-saga';

import { client_route } from 'src/route_config';
import { root_reducer }  from 'src/redux/root_reducer';
import { config } from 'src/utils/config';
import { RootSaga } from  'src/redux/root_sagas';

// create_store
const saga_middleware = createSagaMiddleware();

const middlewares:Middleware[] = [
    saga_middleware,
  ].filter(Boolean);

const create_store_with_midddleware = applyMiddleware(
  ...middlewares,
)(createStore);
export const saga_run = saga_middleware.run;

export const store = create_store_with_midddleware(
  root_reducer,
  DEBUG && (window as any).__REDUX_DEVTOOLS_EXTENSION__
    && (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
);
saga_run(RootSaga);

const history = syncHistoryWithStore(browserHistory as any, store) as any;
const rootRoute = _.assign({}, client_route);

export class Root extends React.Component<any, any> {
  constructor(props:any, context:any) {
    super(props, context);
  }
  render() {
    return (
      <Provider store={store}>
        <Router history={history} routes={rootRoute} />
      </Provider>
    );
  }
}