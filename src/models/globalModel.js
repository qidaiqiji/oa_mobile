import { reqAuth, reqLogin } from '@/services/login';
import Router from 'umi/router';
import { Toast } from 'antd-mobile';
export default {
    namespace: 'globalModel',
    state: {
        isLogin: false,
        isButtonLoading: false,
    },
    effects: {
        *author({ payload }, { put, call, select }) {
            yield put({
                type: 'updatePageReducer',
                payload: {
                    isButtonLoading: true,
                },
            });
            try {
                const user = yield call(reqLogin, { ...payload });
                localStorage.setItem('token', user.data.access_token);
                yield put({
                    type: 'updatePageReducer',
                    payload: {
                        ...user.data,
                        isLogin: true,
                        isButtonLoading: false,
                    },
                });
            } catch (error) {
                yield put({
                    type: 'updatePageReducer',
                    payload: {
                        isButtonLoading: false,
                    },
                });
            }
        },
        *autoLogin({ payload }, { put, call, select }) {
            const { pathname } = payload;
            try {
                const user = yield call(reqAuth);
                if (+user.code === 0) {
                    if (pathname === '/') {
                        Router.push('/dashboard');
                    } else {
                        Router.push(pathname);
                    }
                }
                yield put({
                    type: 'updatePageReducer',
                    payload: {
                        ...user.data,
                    },
                });
            } catch (error) {
                Router.push('/login');
            }
        },
    },
    reducers: {
        updatePageReducer(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
        unmountReducer() {
            return {
                isLogin: true,
                isButtonLoading: false,
            };
        },
    },
};
