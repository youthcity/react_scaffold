export let example_route = {
  path: 'example',
  getComponent(nextState:any, cb:any) {
    require.ensure([], (require:any) => {
      cb(undefined, require('./index').Example);
    });
  },
};