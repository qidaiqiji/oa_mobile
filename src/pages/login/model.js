import { reqLogin } from './services/login';
export default {
    namespace: 'login',
    state: {
        isLogin: false,
    },
    effects: {
        *author({ payload }, { put, call, select }) {
            yield put({
                type: 'updatePageReducer',
            });
            try {
                const user = yield call(reqLogin, { ...payload });
                console.log(user);
                localStorage.setItem('token', user.data.access_token);
                yield put({
                    type: 'updatePageReducer',
                    payload: {
                        ...user.data,
                        isLogin: true,
                    },
                });
            } catch (error) {
                yield put({
                    type: 'updatePageReducer',
                });
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
    },
};
