import { call, put, fork, take, select, takeEvery } from 'redux-saga/effects';

export function* RootSaga() {
    yield fork(require('src/redux/user_info/saga').UserSaga);
}
