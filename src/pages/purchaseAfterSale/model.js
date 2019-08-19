import { reqGetList, reqGetConfig } from './services/purchaseAfterSale';
import { Toast } from 'antd-mobile';
// const awaitCheckStatus = 1;
export default {
    namespace: 'purchaseAfterSale',
    state: {
        // orderStatus: [],
        orderStatus: '',
        totalList: [],
        mPurSearchInfo: '',
        loadingMore: true,
        curPage: 1,
        total: '',
        orderTypeMap: {},
        orderStatusMap: {},
        status: '',
        pageSize: 10,
    },
    effects: {
        *getList({ payload }, { put, call, select }) {
            Toast.loading('加载中...', 0);
            yield put({
                type: 'updateReducer',
                payload: {
                    ...payload,
                },
            });
            const {
                orderStatus,
                mPurSearchInfo,
                totalList,
                curPage,
                status,
                pageSize,
            } = yield select(state => state.purchaseAfterSale);
            try {
                const res = yield call(reqGetList, {
                    orderStatus,
                    mPurSearchInfo,
                    curPage,
                    pageSize,
                });
                Toast.hide();
                yield put({
                    type: 'updateReducer',
                    payload: {
                        totalList: [...totalList, ...res.data.backOrderList],
                        total: res.data.total,
                        loadingMore: false,
                    },
                });

                if (res.code != 0) {
                    yield put({
                        type: 'updateReducer',
                        payload: {
                            loadingMore: false,
                            ...payload,
                        },
                    });
                }
            } catch (err) {
                console.log(err);
            }
        },
        *getConfig({ payload }, { put, call }) {
            try {
                const res = yield call(reqGetConfig);
                yield put({
                    type: 'updateReducer',
                    payload: {
                        orderTypeMap: res.data.orderTypeMap,
                        orderStatusMap: res.data.orderStatusMap,
                    },
                });
            } catch (err) {
                console.log(err);
            }
        },
    },
    reducers: {
        updateReducer(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
        unmountReducer() {
            return {
                // orderStatus: [],
                orderStatus: '',
                totalList: [],
                mPurSearchInfo: '',
                loadingMore: true,
                curPage: 1,
                pageSize: 10,
                total: '',
                orderTypeMap: {},
                orderStatusMap: {},
                status: '',
            };
        },
    },
};
