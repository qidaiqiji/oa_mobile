import Router from 'umi/router';
import { Toast } from 'antd-mobile';
import {
    reqGetOrderDetail,
    reqCheck,
    reqBossCheckSureVerify,
    reqGetConfig,
} from './services/orderDetail';
export default {
    namespace: 'orderDetail',
    state: {
        totalOrder: {},
        goodsList: [],
        subOrders: [],
        listSonVisible: false,
        invioceVisible: false,
        goodsListVisible: false,
        rejectModalVisible: false,
        operateVisible: false,
        operaRecord: '',
        checkStatusMap: {},
        statusMap: {},
        actionList: [],
    },
    effects: {
        *getList({ payload }, { put, call, select, all }) {
            const {} = yield select(state => state.orderDetail);
            try {
                const res = yield all([
                    call(reqGetConfig),
                    call(reqGetOrderDetail, { ...payload }),
                ]);
                Toast.hide();
                yield put({
                    type: 'updateReducer',
                    payload: {
                        totalOrder: res[1].data.totalOrder,
                        goodsList: res[1].data.totalOrder.goodsList,
                        subOrders: res[1].data.subOrders,
                        operaRecord: res[1].data.operaRecord,
                        checkStatusMap: res[0].data.checkMap,
                        actionList: res[1].data.actionList,
                        statusMap: res[0].data.statusMap,
                        ...res.data,
                        ...payload,
                    },
                });
            } catch (err) {
                console.log(err);
            }
        },
        *clickSureAction({ payload }, { put, call }) {
            try {
                const res = yield call(
                    reqCheck,
                    payload.actionurl,
                    payload.totalOrderId,
                    payload.remark,
                    payload.id
                );
                if (+res.code === 0) {
                    Toast.success(res.msg);
                }
                Router.go(-1);
                yield put({
                    type: 'updateReducer',
                    payload: {
                        ...res.data,
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
                totalOrder: {},
                goodsList: [],
                subOrders: [],
                listSonVisible: false,
                invioceVisible: false,
                goodsListVisible: false,
                rejectModalVisible: false,
                operateVisible: false,
                operaRecord: '',
                checkStatusMap: {},
                statusMap: {},
                actionList: [],
            };
        },
    },
};
