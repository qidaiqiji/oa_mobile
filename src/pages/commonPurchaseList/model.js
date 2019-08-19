import { reqGetList } from './services/commonPurchaseList';
import { Toast } from 'antd-mobile';
export default {
    namespace: 'commonPurchaseList',
    state: {
        table: [],
        pageSize: 10,
        loadingMore: true,
        totalList: [],
        total: 0,
        curPage: 1,
        type: 1,
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
                totalList,
                curPage,
                status,
                mPurchaseSupplierInfo,
                type,
            } = yield select(state => state.commonPurchaseList);

            try {
                const res = yield call(reqGetList, {
                    pageSize,
                    curPage,
                    status,
                    type,
                    mPurchaseSupplierInfo,
                });
                if (res.code === 0) {
                    Toast.hide();
                }
                yield put({
                    type: 'updatePageReducer',
                    payload: {
                        total: res.data.total,
                        totalList: [...totalList, ...res.data.table],
                        loadingMore: false,
                    },
                });
            } catch (err) {
                Toast.fail('请求失败', 1);
                yield put({
                    type: 'updatePageReducer',
                    payload: {
                        loadingMore: false,
                    },
                });
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
                type: 1,
                // status: [],
                status: '',
                mPurchaseSupplierInfo: '',
            };
        },
    },
};
