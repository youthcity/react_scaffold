import { IndexContainer } from './routes/index';
import { example_route } from 'src/routes/example/route';

export let client_route = {
  childRoutes: [{
    path: '/',
    component: IndexContainer,
    childRoutes:[
      example_route,
    ],
  }],
};
