import { reqList } from './services/dashboard';
export default {
    namespace: 'dashboard',
    state: {
        orderList: [],
        role: '',
        roleMap: {},
    },
    effects: {
        *getList({ payload }, { put, call, select }) {
            try {
                const res = yield call(reqList);
                yield put({
                    type: 'updatePageReducer',
                    payload: {
                        ...res,
                    },
                });
            } catch (err) {
                console.log(err);
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
                orderList: [],
                role: '',
                roleMap: {},
            };
        },
    },
};
