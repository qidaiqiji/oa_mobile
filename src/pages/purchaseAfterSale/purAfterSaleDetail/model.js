import { Toast } from 'antd-mobile';
import Router from 'umi/router';
import {
    reqGetPurAfterSaleDetail,
    reqBossConfirm,
    reqOrderAction,
} from './services/purAfterSaleDetail';
export default {
    namespace: 'purAfterSaleDetail',
    state: {
        totalOrder: {},
        goodsList: [],
        goodsListVisible: false,
        rejectModalVisible: false,
        operateVisible: false,
        operaRecordList: '',
        purListVisible: false,
        refundOrderList: [],
        operationList: [],
        actionList: [],
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
            const {} = yield select(state => state.purAfterSaleDetail);
            try {
                const res = yield call(reqGetPurAfterSaleDetail, { ...payload });
                Toast.hide();
                yield put({
                    type: 'updateReducer',
                    payload: {
                        totalOrder: res.data,
                        goodsList: res.data.goodsList,
                        operationList: res.data.operaRecordList,
                        actionList: res.data.actionList,
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
                    reqOrderAction,
                    payload.actionurl,
                    payload.id,
                    payload.remark
                );
                if (+res.code === 0) {
                    Toast.success(res.msg);
                }
                Router.go(-1);
                yield put({
                    type: 'updateReducer',
                    payload: {
                        ...payload,
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
                goodsListVisible: false,
                rejectModalVisible: false,
                operateVisible: false,
                operaRecordList: '',
                purListVisible: false,
                refundOrderList: [],
                operationList: [],
                actionList: [],
            };
        },
    },
};
