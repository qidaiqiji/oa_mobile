import { reqList } from './services/salePurchaseOrderList';
import { Toast } from 'antd-mobile';
export default {
    namespace: 'salePurchaseOrderList',
    state: {
        pageSize: 10,
        loadingMore: true,
        totalList: [],
        total: 0,
        curPage: 1,
        type: 2,
        // status: [],
        status: '',
        mPurchaseSupplierInfo: '',
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

            const {
                pageSize,
                curPage,
                type,
                totalList,
                mPurchaseSupplierInfo,
                status,
            } = yield select(state => state.salePurchaseOrderList);
            try {
                const res = yield call(reqList, {
                    pageSize,
                    curPage,
                    type,
                    mPurchaseSupplierInfo,
                    status,
                });
                Toast.hide();
                yield put({
                    type: 'updatePageReducer',
                    payload: {
                        total: res.data.total,
                        totalList: [...totalList, ...res.data.table],
                        loadingMore: false,
                    },
                });
            } catch (err) {
                Toast.fail('加载失败', 1);
                yield put({
                    type: 'updatePageReducer',
                    payload: {
                        loadingMore: false,
                    },
                });
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
                pageSize: 10,
                loadingMore: true,
                totalList: [],
                total: 0,
                curPage: 1,
                type: 2,
                // status: [],
                status: '',
                mPurchaseSupplierInfo: '',
            };
        },
    },
};
