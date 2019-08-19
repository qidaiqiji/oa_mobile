import { reqGetOrderDetail, reqGetConfig } from './services/afterSaleList';
import { Toast } from 'antd-mobile';
// const awaitCheckStatus = 1;
export default {
    namespace: 'afterSaleList',
    state: {
        // checkStatus: [],
        checkStatus: '',
        orderType: -1,
        totalList: [],
        mSaleSearchInfo: '',
        loadingMore: true,
        curPage: 1,
        pageSize: 10,
        total: '',
        orderTypeMap: {},
        checkStatusMap: {},
        mPurSearchInfo: '',
        status: [],
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
                checkStatus,
                mSaleSearchInfo,
                totalList,
                curPage,
                pageSize,
                status,
            } = yield select(state => state.afterSaleList);
            try {
                const res = yield call(reqGetOrderDetail, {
                    checkStatus,
                    mSaleSearchInfo,
                    curPage,
                    pageSize,
                });
                Toast.hide();
                yield put({
                    type: 'updateReducer',
                    payload: {
                        totalList: [...totalList, ...res.data.orderList],
                        total: res.data.total,
                        ...res.data,
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
                const config = yield call(reqGetConfig);
                yield put({
                    type: 'updateReducer',
                    payload: {
                        orderTypeMap: config.data.orderTypeMap,
                        checkStatusMap: config.data.checkStatusMap,
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
                // checkStatus: [],
                checkStatus: '',
                orderType: -1,
                totalList: [],
                mSaleSearchInfo: '',
                loadingMore: true,
                curPage: 1,
                pageSize: 10,
                total: '',
                orderTypeMap: {},
                checkStatusMap: {},
                mPurSearchInfo: '',
                status: [],
            };
        },
    },
};
