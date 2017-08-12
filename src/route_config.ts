import { IndexContainer } from './routes/index';

export let client_route = {
  childRoutes: [{
    path: '/',
    component: IndexContainer,
    childRoutes:[],
  }],
};
