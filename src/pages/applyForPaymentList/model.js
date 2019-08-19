import { reqGetList, reqGetConfig } from './services/applyForPaymentList';
import { Toast } from 'antd-mobile';
const awaitCheckStatus = 1;
export default {
    namespace: 'applyForPaymentList',
    state: {
        table: [],
        pageSize: 10,
        loadingMore: true,
        totalList: [],
        total: 0,
        curPage: 1,
        // status: [],
        status: '',
        statusMap: {},
        keywords: '',
    },
    effects: {
        *getList({ payload }, { put, call, select }) {
            Toast.loading('加载中...', 0);
            yield put({
                type: 'updatePageReducer',
                payload: {
                    ...payload,
                },
            });
            const { pageSize, totalList, curPage, status, keywords } = yield select(
                state => state.applyForPaymentList
            );
            try {
                const res = yield call(reqGetList, {
                    pageSize,
                    curPage,
                    status,
                    keywords,
                });
                if (res.code === 0) {
                    Toast.hide();
                }
                yield put({
                    type: 'updatePageReducer',
                    payload: {
                        purchaseOrderPayList: res.data.purchaseOrderPayList,
                        total: res.data.total,
                        totalList: [...totalList, ...res.data.purchaseOrderPayList],
                        loadingMore: false,
                    },
                });
            } catch (err) {
                Toast.loading('加载失败', 1);
                yield put({
                    type: 'updatePageReducer',
                    payload: {
                        loadingMore: false,
                    },
                });
                console.log(err);
            }
        },
        *getConfig({ payload }, { put, call }) {
            try {
                const config = yield call(reqGetConfig);
                yield put({
                    type: 'updatePageReducer',
                    payload: {
                        statusMap: config.data.statusMap,
                    },
                });
            } catch (err) {
                console.log(err);
            }
        },
        *unmount({ _ }, { put }) {
            yield put({
                type: 'unmountReducer',
            });
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
                table: [],
                pageSize: 10,
                loadingMore: true,
                totalList: [],
                total: 0,
                curPage: 1,
                // status: [],
                status: '',
                statusMap: {},
                keywords: '',
            };
        },
    },
};
