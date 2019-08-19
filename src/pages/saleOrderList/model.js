import { reqGetOrderDetail, reqGetConfig } from './services/saleOrderList';
import { Toast } from 'antd-mobile';
// const awaitCheckStatus = 1;
export default {
    namespace: 'saleOrderList',
    state: {
        // checkStatus: [],
        checkStatus: '',
        totalList: [],
        loadingMore: true,
        curPage: 1,
        pageSize: 10,
        total: '',
        customer: '',
        checkStatusMap: {},
        status: '',
        statusMap: {},
    },
    effects: {
        *getList({ payload }, { put, call, select, all }) {
            Toast.loading('加载中...', 0);
            yield put({
                type: 'updateReducer',
                payload: {
                    ...payload,
                },
            });
            const { checkStatus, totalList, curPage, pageSize, customer, status } = yield select(
                state => state.saleOrderList
            );
            try {
                const res = yield all([
                    call(reqGetConfig),
                    call(reqGetOrderDetail, {
                        checkStatus,
                        pageSize,
                        curPage,
                        customer,
                    }),
                ]);
                Toast.hide();
                yield put({
                    type: 'updateReducer',
                    payload: {
                        totalList: [...totalList, ...res[1].data.orderList],
                        total: res[1].data.total,
                        checkStatusMap: res[0].data.checkMap,
                        statusMap: res[0].data.statusMap,
                        loadingMore: false,
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
                checkStatus: '',
                totalList: [],
                loadingMore: true,
                curPage: 1,
                pageSize: 10,
                total: '',
                customer: '',
                checkStatusMap: {},
                status: '',
                statusMap: {},
            };
        },
    },
};
